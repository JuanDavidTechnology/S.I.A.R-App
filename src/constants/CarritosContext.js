import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const CarritosContext = createContext(null);

/**
 * Estado inicial: 4 ranuras (slots). Cada una puede tener un carrito.
 * Sirve como arranque/fallback offline; la telemetría real se obtiene por
 * polling a /telemetry/latest.php y se actualiza con /telemetry/update.php.
 */
const initialState = [
  {
    id: 1,
    carrito: {
      id: 'car-1',
      nombre: 'carr 1',
      zona: 'Zona 1',
      deviceId: 'bt-robot-alpha',
      plantas: 180,
      conectado: true,
      velocidad: 31.5,
      bateria: 85,
      temp: 18,
      sensorIzq: true,
      sensorDer: true,
    },
  },
  {
    id: 2,
    carrito: {
      id: 'car-2',
      nombre: 'carr 2',
      zona: 'Zona 2',
      deviceId: 'bt-robot-beta',
      plantas: 130,
      conectado: true,
      velocidad: 19.4,
      bateria: 72,
      temp: 19,
      sensorIzq: true,
      sensorDer: false,
    },
  },
  {
    id: 3,
    carrito: {
      id: 'car-3',
      nombre: 'carr 3',
      zona: 'Zona 3',
      deviceId: 'bt-robot-gamma',
      plantas: 75,
      conectado: true,
      velocidad: 24.0,
      bateria: 60,
      temp: 18,
      sensorIzq: true,
      sensorDer: true,
    },
  },
  { id: 4, carrito: null },
];

/* Helpers de normalización (soportan snake_case del API y camelCase local) */
const toBool = (value) =>
  value === true || value === 1 || value === '1' || value === 'true' || value === 'si' || value === 'on';

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const normalizeSlots = (lista, baseSlots) =>
  baseSlots.map((slotInicial, index) => {
    const serverSlot = Array.isArray(lista) ? lista[index] : null;
    if (!serverSlot) return slotInicial;

    const car = serverSlot.carrito !== undefined ? serverSlot.carrito : serverSlot;
    if (!car) return { id: slotInicial.id, carrito: null };

    const fallback = slotInicial.carrito || {};
    return {
      id: slotInicial.id,
      carrito: {
        id: car.id ?? car.car_id ?? fallback.id ?? `car-${slotInicial.id}`,
        nombre: car.nombre ?? fallback.nombre ?? `carr ${slotInicial.id}`,
        zona: car.zona ?? fallback.zona ?? 'Zona 1',
        deviceId: car.deviceId ?? car.device_id ?? fallback.deviceId ?? null,
        plantas: toNumber(car.plantas ?? fallback.plantas ?? 0),
        conectado: toBool(car.conectado ?? fallback.conectado),
        velocidad: toNumber(car.velocidad ?? fallback.velocidad ?? 0),
        bateria: toNumber(car.bateria ?? fallback.bateria ?? 0),
        temp: toNumber(car.temp ?? fallback.temp ?? 0),
        sensorIzq: toBool(car.sensorIzq ?? car.sensor_izq ?? fallback.sensorIzq),
        sensorDer: toBool(car.sensorDer ?? car.sensor_der ?? fallback.sensorDer),
      },
    };
  });

/**
 * CarritosProvider
 * Fuente única de verdad de la telemetría de los carritos.
 * - Polling cada 4 s a /telemetry/latest.php (datos reales desde MySQL).
 * - La consola escribe telemetría con actualizarDatosReales() ->
 *   POST /telemetry/update.php.
 */
export const CarritosProvider = ({ children }) => {
  const [slots, setSlots] = useState(initialState);

  // Polling de telemetría real desde el servidor
  useEffect(() => {
    let mounted = true;

    const cargarTelemetria = async () => {
      try {
        const payload = await api.get('/telemetry/latest.php');
        if (!mounted) return;
        const lista = Array.isArray(payload)
          ? payload
          : (payload && (payload.slots || payload.data || payload.list)) || [];
        if (Array.isArray(lista)) {
          setSlots((prev) => normalizeSlots(lista, prev));
        }
      } catch (_error) {
        // Sin conexión: se conserva el último estado conocido (arranque offline)
      }
    };

    cargarTelemetria();
    const intervalo = setInterval(cargarTelemetria, 4000);
    return () => {
      mounted = false;
      clearInterval(intervalo);
    };
  }, []);

  // Conectar / vincular un dispositivo en el slot indicado
  const conectarCarrito = useCallback((id, carritoData = {}) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === id
          ? {
              ...slot,
              carrito: {
                id: `car-${id}`,
                nombre: `carr ${id}`,
                zona: `Zona ${id}`,
                plantas: 120,
                conectado: true,
                velocidad: 0,
                bateria: 100,
                temp: 18,
                sensorIzq: true,
                sensorDer: true,
                ...carritoData,
              },
            }
          : slot
      )
    );
  }, []);

  // Desconectar: pausa la telemetría en vivo y refleja 0 km/h / Desconectado
  const desconectarCarrito = useCallback((id) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === id && slot.carrito
          ? {
              ...slot,
              carrito: { ...slot.carrito, conectado: false, velocidad: 0, bateria: 0, temp: 0 },
            }
          : slot
      )
    );
  }, []);

  // Actualizar telemetría desde la consola: reflejo local inmediato + envío a la API
  const actualizarDatosReales = useCallback((id, nuevosDatos = {}) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === id && slot.carrito
          ? { ...slot, carrito: { ...slot.carrito, ...nuevosDatos } }
          : slot
      )
    );
    api
      .post('/telemetry/update.php', { slot_id: id, ...nuevosDatos })
      .catch(() => {});
  }, []);

  return (
    <CarritosContext.Provider
      value={{
        slots,
        carritos: slots,
        setCarritos: setSlots,
        actualizarDatosReales,
        conectarCarrito,
        desconectarCarrito,
      }}
    >
      {children}
    </CarritosContext.Provider>
  );
};

export const useCarritos = () => {
  const context = useContext(CarritosContext);
  if (!context) {
    throw new Error('useCarritos must be used within a CarritosProvider');
  }
  return context;
};

export default CarritosContext;