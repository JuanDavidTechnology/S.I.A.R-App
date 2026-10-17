import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNotifications } from '../constants/NotificationContext';
import { useNavigation } from '../navigation/NavigationContext';
import { useSettings } from '../constants/SettingsContext';

/* Ícono y colores según el tipo de alerta (info / warning / success / danger) */
const getNotificationConfig = (tipo) => {
  switch (tipo) {
    case 'danger':
      return { icon: 'alert-circle', color: '#D32F2F', bg: '#FFEBEE' };
    case 'warning':
      return { icon: 'battery-alert', color: '#F57C00', bg: '#FFF3E0' };
    case 'success':
      return { icon: 'check-circle', color: '#2E7D32', bg: '#E8F5E9' };
    default:
      return { icon: 'file-download-outline', color: '#0288D1', bg: '#E1F5FE' };
  }
};

/**
 * NotificationsScreen Component
 * Centro de Notificaciones Global S.I.A.R. (Context Dynamic Notifications).
 * Visualiza los eventos registrados por cualquier módulo a través del
 * NotificationContext (conexión del robot, informes, sensores, configuración).
 */
export const NotificationsScreen = () => {
  const { goBack } = useNavigation();
  const {
    notifications,
    clearNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();
  const { theme } = useSettings();

  // Al ingresar al módulo, todas las notificaciones se marcan como leídas y
  // el contador (badge) se limpia automáticamente
  useEffect(() => {
    const aviso = setTimeout(() => markAllAsRead(), 0);
    return () => clearTimeout(aviso);
  }, [markAllAsRead]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      {/* ============ ENCABEZADO ============ */}
      <View style={[styles.header, { backgroundColor: theme.cardBg }]}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={goBack}>
          <MaterialCommunityIcons name="chevron-left" size={22} color="#0F3818" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Notificaciones del Sistema</Text>

        <TouchableOpacity style={styles.clearBtn} activeOpacity={0.7} onPress={clearNotifications}>
          <Text style={[styles.clearAllText, { color: theme.primary }]}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      {/* ============ LISTA DE NOTIFICACIONES ============ */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="bell-off-outline" size={48} color={theme.accent} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No hay actividad reciente registrada
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const config = getNotificationConfig(item.tipo);
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => markAsRead(item.id)}
              style={[
                styles.card,
                {
                  backgroundColor: item.leido
                    ? theme.cardBg
                    : theme.isDarkMode
                    ? '#24402B'
                    : '#F1F8E9',
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={[styles.iconBox, { backgroundColor: config.bg }]}>
                <MaterialCommunityIcons name={config.icon} size={24} color={config.color} />
              </View>

              <View style={styles.contentBox}>
                <View style={styles.titleRow}>
                  <Text
                    style={[
                      styles.title,
                      !item.leido && styles.unreadTitle,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {item.titulo}
                  </Text>
                  <Text style={[styles.date, { color: theme.textSecondary }]}>{item.fecha}</Text>
                </View>
                <Text style={[styles.message, { color: theme.textSecondary }]}>{item.mensaje}</Text>
              </View>

              <TouchableOpacity
                onPress={() => removeNotification(item.id)}
                style={styles.deleteBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons name="close" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9F6',
  },

  /* ------------------------------ ENCABEZADO ------------------------------ */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2EFE0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F3818',
  },
  clearBtn: {
    padding: 6,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2E7D32',
  },

  /* ------------------------------ LISTA ------------------------------ */
  listContainer: {
    padding: 16,
    gap: 12,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentBox: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
    gap: 8,
  },
  title: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: 'bold',
    color: '#0F3818',
  },
  date: {
    fontSize: 10,
    color: '#888888',
  },
  message: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 16,
    marginTop: 4,
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 8,
  },

  /* ------------------------------ VACÍO ------------------------------ */
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
});

export default NotificationsScreen;