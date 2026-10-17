import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { useSettings } from './SettingsContext';

const NotificationContext = createContext(null);

/* Hora legible para la fecha de cada notificación (ej. "6:40 PM") */
const formatFecha = (value) => {
  if (typeof value === 'string' && /\d{1,2}:\d{2}\s?(AM|PM)/i.test(value)) {
    return value;
  }
  const ts = typeof value === 'number' ? value : new Date(value).getTime();
  const fecha = new Date(Number.isFinite(ts) ? ts : Date.now());
  let horas = fecha.getHours();
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  const ampm = horas >= 12 ? 'PM' : 'AM';
  horas = horas % 12 || 12;
  return `${horas}:${minutos} ${ampm}`;
};

const toBool = (value) =>
  value === true || value === 1 || value === '1' || value === 'true';

const VALID_TIPOS = ['success', 'warning', 'danger', 'info'];

const mapServerNotification = (n) => {
  const tipoRaw = String(n.tipo ?? 'info').toLowerCase();
  return {
    id: String(
      n.id ?? n.notification_id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    ),
    titulo: n.titulo ?? n.title ?? 'Notificación',
    mensaje: n.mensaje ?? n.message ?? '',
    fecha: formatFecha(n.fecha ?? n.created_at ?? n.date ?? Date.now()),
    tipo: VALID_TIPOS.includes(tipoRaw) ? tipoRaw : 'info',
    leido: toBool(n.leido ?? n.is_read ?? n.read),
  };
};

/**
 * NotificationProvider
 * Historial de notificaciones de S.I.A.R.
 * - Carga el historial real desde GET /notifications/list.php (MySQL).
 * - markAsRead / markAllAsRead sincronizan el estado leído con
 *   PUT /notifications/mark_read.php.
 * - addNotification sigue generando eventos en tiempo real de forma local.
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { notificationsEnabled } = useSettings();

  const cargarHistorial = useCallback(() => {
    return api
      .get('/notifications/list.php')
      .then((payload) => {
        const lista = Array.isArray(payload)
          ? payload
          : (payload && (payload.notifications || payload.data || payload.list)) || [];
        if (Array.isArray(lista)) {
          setNotifications(lista.map(mapServerNotification).slice(0, 40));
        }
      })
      .catch(() => {});
  }, []);

  // Cargar el historial real de MySQL al montar el provider
  useEffect(() => {
    let mounted = true;
    api
      .get('/notifications/list.php')
      .then((payload) => {
        if (!mounted) return;
        const lista = Array.isArray(payload)
          ? payload
          : (payload && (payload.notifications || payload.data || payload.list)) || [];
        if (Array.isArray(lista)) {
          setNotifications(lista.map(mapServerNotification).slice(0, 40));
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Registrar una notificación en local (evento inmediato generado por la app)
  const addNotification = useCallback(
    (titulo, mensaje, tipo = 'info') => {
      if (!notificationsEnabled) return;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newNotify = {
        id,
        titulo,
        mensaje,
        fecha: formatFecha(Date.now()),
        tipo,
        leido: false,
      };
      setNotifications((prev) => [newNotify, ...prev].slice(0, 40));
    },
    [notificationsEnabled]
  );

  // Eliminar una notificación individual
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Marcar como leída (tarjeta individual) con sincronización al servidor
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, leido: true } : item))
    );
    api.put('/notifications/mark_read.php', { id }).catch(() => {});
  }, []);

  // Marcar todas como leídas (al ingresar al módulo se limpia el contador)
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, leido: true })));
    api.put('/notifications/mark_read.php', { all: true }).catch(() => {});
  }, []);

  // Limpiar toda la lista
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Contador dinámico de notificaciones sin leer
  const unreadCount = notifications.filter((n) => !n.leido).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        unreadCount,
        refreshNotifications: cargarHistorial,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;