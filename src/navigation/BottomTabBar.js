import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors as DefaultColors, Shadows } from '../constants/theme';
import { AppIcon } from '../components/Icons';
import { useNavigation } from './NavigationContext';
import { useAppStyle } from '../constants/StyleContext';
import { useNotifications } from '../constants/NotificationContext';

/**
 * BottomTabBar Component (Pixel-Perfect Implementation)
 * - Contenedor blanco con bordes superiores curvos (borderTopLeftRadius: 24, borderTopRightRadius: 24)
 * - Indicador de pestaña activa: Barra/Línea verde horizontal superior sobre la opción seleccionada
 * Items:
 * 1. Inicio -> Casa outline / verde
 * 2. Informes -> Gráfica de barras rectangulares
 * 3. Notificaciones -> Campana
 * 4. Configuracion -> Engranaje / Tuerca
 */
export const BottomTabBar = () => {
  const { activeTab, switchTab } = useNavigation();
  const { unreadCount } = useNotifications();

  let colors = DefaultColors;
  try {
    const styleCtx = useAppStyle();
    if (styleCtx) colors = styleCtx.colors;
  } catch (_) {}

  const tabs = [
    { key: 'Home', label: 'Inicio', icon: 'home-outline' },
    { key: 'Reports', label: 'Informes', icon: 'bar-chart' },
    { key: 'Notifications', label: 'Notificaciones', icon: 'bell' },
    { key: 'Settings', label: 'Configuracion', icon: 'settings' },
  ];

  return (
    <View
      style={[
        styles.tabBarContainer,
        { backgroundColor: colors.cardBackground || '#FFFFFF', borderColor: '#E8EFE5' },
      ]}
    >
      <View style={styles.tabBarInner}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const activeColor = colors.liveGreen || DefaultColors.liveGreen;
          const inactiveColor = '#8E8E8E';

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => switchTab(tab.key)}
              activeOpacity={0.75}
            >
              {/* Active Tab: Top Horizontal Green Bar Line */}
              {isActive ? (
                <View style={[styles.activeTopLine, { backgroundColor: activeColor }]} />
              ) : (
                <View style={styles.inactiveTopLinePlaceholder} />
              )}

              {/* Icon Container */}
              <View style={styles.iconWrapper}>
                <AppIcon
                  name={tab.icon}
                  size={22}
                  color={isActive ? activeColor : inactiveColor}
                />

                {/* Badge dinámico: solo en la campana y con notificaciones sin leer */}
                {tab.key === 'Notifications' && unreadCount > 0 && !isActive && (
                  <View style={styles.badgeNotification}>
                    <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                  </View>
                )}
              </View>

              {/* Tab Label */}
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? activeColor : inactiveColor,
                    fontWeight: isActive ? '800' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    ...Shadows.strong,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
    flex: 1,
    position: 'relative',
  },
  activeTopLine: {
    width: '60%',
    maxWidth: 42,
    height: 3.5,
    borderRadius: 2,
    marginBottom: 6,
  },
  inactiveTopLinePlaceholder: {
    width: '60%',
    maxWidth: 42,
    height: 3.5,
    marginBottom: 6,
    backgroundColor: 'transparent',
  },
  iconWrapper: {
    position: 'relative',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNotification: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tabLabel: {
    fontSize: 10.5,
    marginTop: 4,
    letterSpacing: 0.1,
  },
});

export default BottomTabBar;
