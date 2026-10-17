import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import Svg, { Path } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '../navigation/NavigationContext';
import { useCarritos } from '../constants/CarritosContext';
import { useNotifications } from '../constants/NotificationContext';
import { useSettings } from '../constants/SettingsContext';

/* =============================================================================
 * PANTALLA: Control Manual (Landscape) — Diseño original en 3 filas
 * =============================================================================
 * 1. SUP: Tarjetas (Hora/Temperatura · Estado del Cultivo · Clima/Conexión)
 * 2. MEDIO: Botones de sensores (Izquierdo / Derecho)
 * 3. INFERIOR: Joystick Vertical · Gauge de Batería · Joystick Horizontal
 * ===========================================================================*/

/* =============================================================================
 * FUNCIONES DE RENDERIZADO DINÁMICO (emojis / colores / textos)
 * ===========================================================================*/
const getCultivoStyle = (estado) => {
  switch (estado.tipo) {
    case 'saludable':
      return { icon: '🌱', color: '#2E7D32', text: 'Cultivo saludable' };
    case 'alerta':
      return {
        icon: '🔥',
        color: '#FF6D00',
        text: `${estado.titulo} (${estado.porcentaje}%)`,
      };
    case 'peligro':
      return { icon: '⚠️', color: '#D32F2F', text: 'Anomalía crítica detectada' };
    default:
      return { icon: '🌿', color: '#2E7D32', text: 'Estado normal' };
  }
};

const getSensorIcon = (sensor) => {
  if (!sensor.conectado) return '🚫';
  return sensor.nivelSignal === 'alto' ? '📡' : '📱';
};

/* =============================================================================
 * ESTADO DE CULTIVO derivado de los sensores (actualiza la tarjeta central)
 * ===========================================================================*/
const buildEstadoCultivo = (izq, der) => {
  if (izq.conectado && der.conectado) {
    return {
      tipo: 'saludable',
      porcentaje: 0,
      titulo: 'Cultivo Óptimo',
      descripcion: 'Los sensores reportan condiciones óptimas del cultivo, sin anomalías en el follaje.',
    };
  }
  if (!izq.conectado && !der.conectado) {
    return {
      tipo: 'peligro',
      porcentaje: 35,
      titulo: 'Sensores sin conexión',
      descripcion: 'Ambos sensores están sin conexión; se requiere revisión inmediata del sistema.',
    };
  }
  if (izq.conectado) {
    return {
      tipo: 'alerta',
      porcentaje: 20,
      titulo: 'Tonalidades naranjas',
      descripcion: 'Se ha evidenciado un 20% de tonalidades naranjas en las plantas.',
    };
  }
  return {
    tipo: 'alerta',
    porcentaje: 15,
    titulo: 'Estrés hídrico',
    descripcion: 'Se ha evidenciado un 15% de estrés hídrico en las plantas.',
  };
};

/* =============================================================================
 * PANTALLA PRINCIPAL
 * ===========================================================================*/
export function ControlManualScreen() {
  const { goBack } = useNavigation();
  const { params } = useRoute();
  const { slots, actualizarDatosReales } = useCarritos();
  const { addNotification } = useNotifications();
  const { theme, unitMetric } = useSettings();

  // 1. Estados dinámicos de telemetría
  const [time, setTime] = useState('9:10 AM');

  // Estados de movimiento (joysticks interactivos con PanResponder nativo)
  const [valVertical, setValVertical] = useState(0); // -100 a 100
  const [valHorizontal, setValHorizontal] = useState(0); // -45° a 45°

  // Carrito objetivo de la consola: el pasado por navegación ({ carId, zona })
  // o, si se entró sin parámetros, el primer carrito conectado.
  const carId = params?.carId ?? null;
  const carritoSlot =
    slots.find((s) => String(s.id) === String(carId)) || slots.find((s) => s.carrito?.conectado);
  const carrito = carritoSlot?.carrito ?? null;
  const slotId = carritoSlot?.id ?? null;

  /* ============================ JOYSTICK VERTICAL NATIVO (PanResponder, SIN EVENTOS WEB) ============================ */
  // Animación exclusiva del EJE Y (X queda bloqueada en 0)
  const [panY] = useState(() => new Animated.Value(0));

  // Responder estable, creado UNA sola vez: gesto aislado y fluido
  const [panResponderVertical] = useState(() =>
    PanResponder.create({
      // Captura inmediata del gesto dentro de su zona (eje Y)
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        // Detener animaciones previas y fijar el origen del arrastre
        panY.stopAnimation();
        panY.setValue(0);
      },
      onPanResponderMove: (_evt, gestureState) => {
        // Recorrido vertical suave entre -45px (arriba) y 45px (abajo); solo eje Y
        const maxRange = 45;
        let dy = gestureState.dy;
        if (dy < -maxRange) dy = -maxRange;
        if (dy > maxRange) dy = maxRange;
        panY.setValue(dy);
        const porcentaje = Math.round((-dy / maxRange) * 100);
        setValVertical(porcentaje);
      },
      onPanResponderRelease: () => {
        // Regreso automático al centro con efecto resorte suave
        Animated.spring(panY, {
          toValue: 0,
          tension: 40,
          friction: 7,
          useNativeDriver: false,
        }).start();
        setValVertical(0);
      },
      onPanResponderTerminate: () => {
        Animated.spring(panY, { toValue: 0, useNativeDriver: false }).start();
        setValVertical(0);
      },
    })
  );

  /* ============================ JOYSTICK HORIZONTAL NATIVO (PanResponder, SIN EVENTOS WEB) ============================ */
  // Animación exclusiva del EJE X (Y queda bloqueada en 0)
  const [panX] = useState(() => new Animated.Value(0));

  const [panResponderHorizontal] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        // Detener animaciones previas y fijar el origen del arrastre
        panX.stopAnimation();
        panX.setValue(0);
      },
      onPanResponderMove: (_evt, gestureState) => {
        // Recorrido horizontal suave entre -40px y 40px; solo eje X
        const maxRange = 40;
        let dx = gestureState.dx;
        if (dx < -maxRange) dx = -maxRange;
        if (dx > maxRange) dx = maxRange;
        panX.setValue(dx);
        setValHorizontal(Math.round((dx / maxRange) * 45));
      },
      onPanResponderRelease: () => {
        Animated.spring(panX, {
          toValue: 0,
          tension: 40,
          friction: 7,
          useNativeDriver: false,
        }).start();
        setValHorizontal(0);
      },
      onPanResponderTerminate: () => {
        Animated.spring(panX, { toValue: 0, useNativeDriver: false }).start();
        setValHorizontal(0);
      },
    })
  );

  // Pasos con flechas (misma escala que el arrastre)
  const stepVertical = (delta) => {
    const next = Math.max(-100, Math.min(100, valVertical + delta));
    panY.setValue(-(next / 100) * 45);
    setValVertical(next);
  };

  const stepHorizontal = (delta) => {
    const next = Math.max(-45, Math.min(45, valHorizontal + delta));
    panX.setValue((next / 45) * 40);
    setValHorizontal(next);
  };

  // Sincroniza la velocidad real del carrito (hasta 40 km/h) en el contexto cada vez
  // que cambia el mando vertical (por arrastre o por flechas)
  useEffect(() => {
    if (slotId != null) {
      actualizarDatosReales(slotId, {
        velocidad: Math.round((Math.abs(valVertical) / 100) * 40 * 10) / 10,
      });
    }
  }, [valVertical, slotId, actualizarDatosReales]);

  // 2. Reloj en tiempo real
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 10000);
    return () => clearInterval(timer);
  }, []);

  // 2b. Orientación Landscape al montar (Horizontal) y Portrait al salir (Vertical)
  useEffect(() => {
    async function lockLandscape() {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (error) {
        console.warn('No se pudo fijar la orientación horizontal:', error);
      }
    }
    lockLandscape();

    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      ).catch(() => {});
    };
  }, []);

  // Aviso global: se activó el control manual desde la aplicación
  useEffect(() => {
    const aviso = setTimeout(() => {
      addNotification(
        'Modo de Control',
        'Se activó el control manual desde la aplicación.',
        'info'
      );
    }, 500);
    return () => clearTimeout(aviso);
  }, [addNotification]);

  // Sin carrito seleccionable: vista de respaldo
  if (!carrito) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
        <View style={[styles.fallback, { backgroundColor: theme.bg }]}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={goBack}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.fallbackTitle, { color: theme.textPrimary }]}>
            Consola de Control Manual
          </Text>
          <Text style={[styles.fallbackSub, { color: theme.textSecondary }]}>
            Selecciona un carrito activo desde el inicio para abrir su consola independiente.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Sensores y estado del cultivo derivados de la telemetría viva del carrito
  const sensorIzquierdo = {
    conectado: Boolean(carrito.sensorIzq),
    nivelSignal: carrito.sensorIzq ? 'alto' : 'desconectado',
  };
  const sensorDerecho = {
    conectado: Boolean(carrito.sensorDer),
    nivelSignal: carrito.sensorDer ? 'alto' : 'desconectado',
  };
  const estadoCultivo = buildEstadoCultivo(sensorIzquierdo, sensorDerecho);
  const cultivoInfo = getCultivoStyle(estadoCultivo);

  // 4. Interacción con sensores (toggle de conexión -> actualiza la tarjeta central
  //    y persiste de forma aislada en el contexto de este carrito)
  const toggleSensor = (sensor) => {
    const target = carritoSlot.id;
    if (target == null) return;
    const nextLeft = sensor === 'left' ? !sensorIzquierdo.conectado : sensorIzquierdo.conectado;
    const nextRight = sensor === 'right' ? !sensorDerecho.conectado : sensorDerecho.conectado;
    actualizarDatosReales(target, { sensorIzq: nextLeft, sensorDer: nextRight });

    const nombre = carrito?.nombre ?? 'S.I.A.R.';
    if (sensor === 'left') {
      addNotification(
        nextLeft ? 'Sensor Activado' : 'Sensor Desactivado',
        `El sensor izquierdo de ${nombre} ${nextLeft ? 'se activó' : 'se desactivó'} desde la aplicación.`,
        nextLeft ? 'success' : 'warning'
      );
    } else {
      addNotification(
        nextRight ? 'Sensor Activado' : 'Sensor Desactivado',
        `El sensor derecho de ${nombre} ${nextRight ? 'se activó' : 'se desactivó'} desde la aplicación.`,
        nextRight ? 'success' : 'warning'
      );
    }
  };

  // Arc de batería: endpoint del arco activo según el porcentaje real (0-100)
  const porcentajeBateria = carrito.bateria;
  const batteryFraction = Math.min(1, Math.max(0, porcentajeBateria / 100));
  const angleDeg = 180 - batteryFraction * 180;
  const a = (angleDeg * Math.PI) / 180;
  const endX = 100 + 80 * Math.cos(a);
  const endY = 100 - 80 * Math.sin(a);
  const activeArc =
    batteryFraction >= 1
      ? 'M 20 100 A 80 80 0 0 1 180 100'
      : `M 20 100 A 80 80 0 0 1 ${endX.toFixed(1)} ${endY.toFixed(1)}`;
  const batteryStroke = porcentajeBateria > 20 ? '#388E3C' : '#D32F2F';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        {/* ============ FILA SUPERIOR: TARJETAS (Hora/Temp · Estado Cultivo · Clima/Conexión) ============ */}
        <View style={styles.topRow}>
          {/* Tarjeta Izquierda: botón atrás + Hora y Temperatura */}
          <View style={styles.greenCard}>
            <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={goBack}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <View style={styles.cardContent}>
              <Text style={styles.timeText}>{time}</Text>
              <Text style={styles.tempText}>
                {unitMetric
                  ? `${carrito.temp} °C`
                  : `${Math.round((carrito.temp * 9) / 5 + 32)} °F`}
              </Text>
            </View>
          </View>

          {/* Tarjeta Central: Estado del Cultivo */}
          <View style={styles.grayCard}>
            <View style={styles.cardContent}>
              <Text style={[styles.statusTitle, { color: cultivoInfo.color }]}>
                {cultivoInfo.icon} {cultivoInfo.text}
              </Text>
              <Text style={styles.statusDesc} numberOfLines={4}>
                {estadoCultivo.descripcion}
              </Text>
            </View>
          </View>

          {/* Tarjeta Derecha: Clima y Conexión */}
          <View style={styles.greenCard}>
            <View style={styles.cardContent}>
              <Text style={styles.weatherText}>🌤️ Dia Soleado</Text>
              <MaterialCommunityIcons
                name={carrito.conectado ? 'bluetooth-connect' : 'bluetooth-off'}
                size={20}
                color={carrito.conectado ? '#1B3B1A' : '#D32F2F'}
              />
              <Text
                style={[styles.connText, { color: carrito.conectado ? '#1B3B1A' : '#D32F2F' }]}
              >
                {carrito.conectado ? 'Conectado' : 'Desconectado'}
              </Text>
            </View>
          </View>
        </View>

        {/* ============ FILA INTERMEDIA: BOTONES DE SENSORES ============ */}
        <View style={styles.middleRow}>
          <TouchableOpacity
            style={[
              styles.sensorBtn,
              { borderColor: sensorIzquierdo.conectado ? '#2E7D32' : '#DDDDDD' },
            ]}
            activeOpacity={0.75}
            onPress={() => toggleSensor('left')}
          >
            <Text style={styles.sensorBtnText}>
              {getSensorIcon(sensorIzquierdo)} Sensor Izquierdo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sensorBtn,
              { borderColor: sensorDerecho.conectado ? '#2E7D32' : '#DDDDDD' },
            ]}
            activeOpacity={0.75}
            onPress={() => toggleSensor('right')}
          >
            <Text style={styles.sensorBtnText}>
              {getSensorIcon(sensorDerecho)} Sensor Derecho
            </Text>
          </TouchableOpacity>
        </View>

        {/* ============ FILA INFERIOR: JOYSTICKS + GAUGE DE BATERÍA ============ */}
        <View style={styles.bottomRow}>
          {/* Joystick Vertical (Eje Y, arrastre nativo PanResponder) */}
          <View style={styles.joyColumn}>
            <View style={styles.joyTrackVertical}>
              <TouchableOpacity
                style={styles.arrowHit}
                activeOpacity={0.7}
                onPress={() => stepVertical(10)}
              >
                <Text style={styles.arrowText}>▲</Text>
              </TouchableOpacity>

              <Animated.View
                collapsable={false}
                {...panResponderVertical.panHandlers}
                style={[styles.joyKnob, { transform: [{ translateY: panY }], zIndex: 10 }]}
              />

              <TouchableOpacity
                style={styles.arrowHit}
                activeOpacity={0.7}
                onPress={() => stepVertical(-10)}
              >
                <Text style={styles.arrowText}>▼</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.joystickLabel}>VERTICAL {valVertical}</Text>
          </View>

          {/* Gauge de Batería */}
          <View style={styles.batteryColumn}>
            <TouchableOpacity
              style={styles.batteryWrapper}
              activeOpacity={0.85}
              onPress={() =>
                actualizarDatosReales(carritoSlot.id, {
                  bateria: porcentajeBateria >= 100 ? 25 : Math.min(100, porcentajeBateria + 25),
                })
              }
            >
              <Svg width="180" height="90" viewBox="0 0 200 100">
                {/* Fondo Gris del Arco (Restante) */}
                <Path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#D9E8D6"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Barra Activa (color según porcentaje, progreso dinámico) */}
                {batteryFraction > 0 && (
                  <Path
                    d={activeArc}
                    fill="none"
                    stroke={batteryStroke}
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                )}
              </Svg>
              <Text style={styles.batteryPercent}>{porcentajeBateria} %</Text>
            </TouchableOpacity>
            <Text style={styles.batteryLabel}>Porcentaje De Batería</Text>
          </View>

          {/* Joystick Horizontal (Eje X, arrastre nativo PanResponder) */}
          <View style={styles.joyColumn}>
            <View style={styles.joyTrackHorizontal}>
              <TouchableOpacity
                style={styles.arrowHit}
                activeOpacity={0.7}
                onPress={() => stepHorizontal(-5)}
              >
                <Text style={styles.arrowText}>◀</Text>
              </TouchableOpacity>

              <Animated.View
                collapsable={false}
                {...panResponderHorizontal.panHandlers}
                style={[styles.joyKnob, { transform: [{ translateX: panX }], zIndex: 10 }]}
              />

              <TouchableOpacity
                style={styles.arrowHit}
                activeOpacity={0.7}
                onPress={() => stepHorizontal(5)}
              >
                <Text style={styles.arrowText}>▶</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.joystickLabel}>HORIZONTAL {valHorizontal}°</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* =============================================================================
 * ESTILOS
 * ===========================================================================*/
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8F6',
  },

  container: {
    flex: 1,
    backgroundColor: '#F7F8F6',
    padding: 12,
    justifyContent: 'space-between',
  },

  /* ------------------------------ FILA SUPERIOR: TARJETAS ------------------------------ */
  topRow: {
    flexDirection: 'row',
    gap: 12,
    height: '34%',
  },
  greenCard: {
    flex: 1,
    backgroundColor: '#C8E6C9',
    borderRadius: 24,
    padding: 12,
  },
  grayCard: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 24,
    padding: 12,
  },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: { fontSize: 15, fontWeight: 'bold', color: '#1B3B1A' },
  cardContent: {
    marginTop: 18,
    alignItems: 'center',
  },
  timeText: { fontSize: 20, fontWeight: 'bold', color: '#1B3B1A' },
  tempText: { fontSize: 14, fontWeight: 'bold', color: '#2E7D32', marginTop: 2 },
  statusTitle: { fontSize: 15, fontWeight: 'bold', color: '#2E7D32', textAlign: 'center' },
  statusDesc: {
    fontSize: 11,
    color: '#3E3E3E',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 15,
  },
  weatherText: { fontSize: 14, fontWeight: 'bold', color: '#33691E', textAlign: 'center' },
  connText: { fontSize: 12, fontWeight: 'bold', color: '#1B3B1A', marginTop: 6 },

  /* ------------------------------ FILA MEDIA: SENSORES ------------------------------ */
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  sensorBtn: {
    backgroundColor: '#EEEEEE',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  sensorBtnText: { fontSize: 14, fontWeight: 'bold', color: '#333333' },

  /* ------------------------------ FILA INFERIOR: JOYSTICKS + BATERÍA ------------------------------ */
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '45%',
  },
  joyColumn: {
    width: '25%',
    alignItems: 'center',
  },
  joyTrackVertical: {
    width: 70,
    height: 120,
    borderRadius: 35,
    backgroundColor: '#D7E8D6',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    overflow: 'visible',
    touchAction: 'none',
    userSelect: 'none',
  },
  joyTrackHorizontal: {
    width: 130,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#D7E8D6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    overflow: 'visible',
    touchAction: 'none',
    userSelect: 'none',
  },
  joyKnob: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    cursor: 'grab',
    touchAction: 'none',
  },
  arrowHit: { padding: 4 },
  arrowText: {
    fontSize: 12,
    color: '#1B3B1A',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 14,
  },
  joystickLabel: { fontSize: 11, fontWeight: 'bold', color: '#1B3B1A', marginTop: 6 },

  /* ------------------------------ GAUGE DE BATERÍA ------------------------------ */
  batteryColumn: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  batteryWrapper: {
    width: 180,
    height: 90,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  batteryPercent: {
    position: 'absolute',
    top: 24,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  batteryLabel: {
    fontSize: 11,
    color: '#444444',
    marginTop: 6,
  },

  /* ------------------------------ VISTA DE RESPALDO ------------------------------ */
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F8F6',
    padding: 24,
    gap: 10,
  },
  fallbackTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B3B1A' },
  fallbackSub: { fontSize: 13, color: '#666666', textAlign: 'center', lineHeight: 19, maxWidth: 280 },
});

export default ControlManualScreen;