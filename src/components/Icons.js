import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

/**
 * Custom Icon Component for S.I.A.R. Design System
 * Styled with soft mint green backgrounds (#E2EFDA) and dark green stroke/shapes (#0F3818 / #1B3E2B)
 */
export const IconBadge = ({ children, size = 38, bg = Colors.mintLight, border = false, style }) => (
  <View
    style={[
      styles.badgeBase,
      {
        width: size,
        height: size,
        borderRadius: size / 2.4,
        backgroundColor: bg,
        borderColor: border ? Colors.pastelGreen : 'transparent',
        borderWidth: border ? 1 : 0,
      },
      style,
    ]}
  >
    {children}
  </View>
);

export const AppIcon = ({ name, size = 20, color = Colors.darkGreen, style }) => {
  switch (name) {
    // 1. Inicio -> Casa Outline
    case 'home':
    case 'home-outline':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          {/* Roof */}
          <View
            style={{
              width: size * 0.72,
              height: size * 0.5,
              borderTopWidth: 2,
              borderLeftWidth: 2,
              borderColor: color,
              transform: [{ rotate: '45deg' }],
              position: 'absolute',
              top: 1,
            }}
          />
          {/* Base */}
          <View
            style={{
              width: size * 0.65,
              height: size * 0.52,
              borderWidth: 2,
              borderTopWidth: 0,
              borderColor: color,
              borderRadius: 2,
              position: 'absolute',
              bottom: 2,
            }}
          />
        </View>
      );

    // 2. Informes -> Gráfica de barras rectangulares
    case 'bar-chart':
    case 'chart':
    case 'report':
    case 'document':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2.5, height: size * 0.75 }}>
            <View style={{ width: size * 0.22, height: '45%', backgroundColor: color, borderRadius: 1.5 }} />
            <View style={{ width: size * 0.22, height: '90%', backgroundColor: color, borderRadius: 1.5 }} />
            <View style={{ width: size * 0.22, height: '65%', backgroundColor: color, borderRadius: 1.5 }} />
          </View>
          <View style={{ width: size * 0.85, height: 1.8, backgroundColor: color, borderRadius: 1, marginTop: 1 }} />
        </View>
      );

    // 3. Notificaciones -> Campana
    case 'bell':
    case 'notification':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.65,
              height: size * 0.6,
              borderWidth: 2,
              borderBottomWidth: 0,
              borderColor: color,
              borderTopLeftRadius: size * 0.35,
              borderTopRightRadius: size * 0.35,
            }}
          />
          <View style={{ width: size * 0.85, height: 2, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: size * 0.25, height: 2.5, backgroundColor: color, borderRadius: 1.5, marginTop: 1 }} />
        </View>
      );

    // 4. Configuración -> Engranaje / Tuerca
    case 'settings':
    case 'gear':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.75,
              height: size * 0.75,
              borderRadius: size * 0.375,
              borderWidth: 2.2,
              borderStyle: 'dashed',
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: size * 0.25, height: size * 0.25, borderRadius: size * 0.125, backgroundColor: color }} />
          </View>
        </View>
      );

    // Ícono de Vehículo / Carro Robótico Estilizado
    case 'car':
    case 'robot':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          {/* Car Cab / Body Top */}
          <View
            style={{
              width: size * 0.55,
              height: size * 0.35,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              borderWidth: 2,
              borderBottomWidth: 0,
              borderColor: color,
              position: 'absolute',
              top: 1,
            }}
          />
          {/* Main Chassis */}
          <View
            style={{
              width: size * 0.88,
              height: size * 0.38,
              borderRadius: 3.5,
              backgroundColor: color,
              position: 'absolute',
              top: size * 0.32,
            }}
          />
          {/* Wheels */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: size * 0.75, position: 'absolute', bottom: 0 }}>
            <View style={{ width: size * 0.25, height: size * 0.25, borderRadius: size * 0.125, backgroundColor: color, borderWidth: 1.5, borderColor: '#FFFFFF' }} />
            <View style={{ width: size * 0.25, height: size * 0.25, borderRadius: size * 0.125, backgroundColor: color, borderWidth: 1.5, borderColor: '#FFFFFF' }} />
          </View>
        </View>
      );

    // Bluetooth Icon
    case 'bluetooth':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          {/* Main Spine */}
          <View style={{ width: 2.4, height: size * 0.85, backgroundColor: color, borderRadius: 1.2 }} />
          {/* Top Diamond Angles */}
          <View
            style={{
              position: 'absolute',
              width: size * 0.45,
              height: size * 0.45,
              borderTopWidth: 2.4,
              borderRightWidth: 2.4,
              borderColor: color,
              transform: [{ rotate: '45deg' }],
              top: 2,
            }}
          />
          {/* Bottom Diamond Angles */}
          <View
            style={{
              position: 'absolute',
              width: size * 0.45,
              height: size * 0.45,
              borderBottomWidth: 2.4,
              borderRightWidth: 2.4,
              borderColor: color,
              transform: [{ rotate: '-45deg' }],
              bottom: 2,
            }}
          />
        </View>
      );

    // Refresh / Scanner Spinner
    case 'refresh':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.75,
              height: size * 0.75,
              borderRadius: size * 0.375,
              borderWidth: 2,
              borderColor: color,
              borderTopColor: 'transparent',
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 0,
              height: 0,
              borderLeftWidth: 4,
              borderRightWidth: 4,
              borderBottomWidth: 6,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
              transform: [{ rotate: '45deg' }],
            }}
          />
        </View>
      );

    case 'plus':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View style={{ width: size * 0.65, height: 2.2, backgroundColor: color, borderRadius: 1.1 }} />
          <View style={{ height: size * 0.65, width: 2.2, backgroundColor: color, borderRadius: 1.1, position: 'absolute' }} />
        </View>
      );

    case 'plus-circle':
      return (
        <View
          style={[
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: 1.8,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            },
            style,
          ]}
        >
          <View style={{ width: size * 0.5, height: 2, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ height: size * 0.5, width: 2, backgroundColor: color, borderRadius: 1, position: 'absolute' }} />
        </View>
      );

    case 'chevron-left':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.45,
              height: size * 0.45,
              borderLeftWidth: 2.6,
              borderBottomWidth: 2.6,
              borderColor: color,
              transform: [{ rotate: '45deg' }],
              marginLeft: size * 0.15,
            }}
          />
        </View>
      );

    case 'chevron-right':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.45,
              height: size * 0.45,
              borderRightWidth: 2.6,
              borderTopWidth: 2.6,
              borderColor: color,
              transform: [{ rotate: '45deg' }],
              marginRight: size * 0.15,
            }}
          />
        </View>
      );

    case 'plant':
    case 'leaf':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.7,
              height: size * 0.7,
              borderWidth: 2,
              borderColor: color,
              borderTopLeftRadius: size * 0.65,
              borderBottomRightRadius: size * 0.65,
              transform: [{ rotate: '45deg' }],
            }}
          />
        </View>
      );

    case 'battery':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.8,
              height: size * 0.45,
              borderWidth: 2,
              borderColor: color,
              borderRadius: 3,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 2,
            }}
          >
            <View style={{ width: '60%', height: '60%', backgroundColor: color, borderRadius: 1 }} />
          </View>
          <View style={{ position: 'absolute', right: 0, width: 2, height: size * 0.2, backgroundColor: color, borderRadius: 1 }} />
        </View>
      );

    case 'search':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.55,
              height: size * 0.55,
              borderRadius: size * 0.275,
              borderWidth: 2,
              borderColor: color,
              position: 'absolute',
              top: 1,
              left: 1,
            }}
          />
          <View
            style={{
              width: size * 0.35,
              height: 2.2,
              backgroundColor: color,
              borderRadius: 1,
              transform: [{ rotate: '45deg' }],
              position: 'absolute',
              bottom: 3,
              right: 1,
            }}
          />
        </View>
      );

    case 'download':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View style={{ width: 2, height: size * 0.55, backgroundColor: color, position: 'absolute', top: 2 }} />
          <View
            style={{
              width: size * 0.35,
              height: size * 0.35,
              borderBottomWidth: 2,
              borderRightWidth: 2,
              borderColor: color,
              transform: [{ rotate: '45deg' }],
              position: 'absolute',
              top: size * 0.25,
            }}
          />
          <View style={{ width: size * 0.7, height: 2, backgroundColor: color, position: 'absolute', bottom: 2, borderRadius: 1 }} />
        </View>
      );

    case 'bookmark':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.6,
              height: size * 0.8,
              borderWidth: 2,
              borderColor: color,
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
            }}
          />
        </View>
      );

    case 'arrow-left':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View style={{ width: size * 0.65, height: 2, backgroundColor: color, borderRadius: 1 }} />
          <View
            style={{
              width: size * 0.35,
              height: size * 0.35,
              borderTopWidth: 2,
              borderLeftWidth: 2,
              borderColor: color,
              transform: [{ rotate: '-45deg' }],
              position: 'absolute',
              left: 2,
            }}
          />
        </View>
      );

    case 'arrow-right':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View style={{ width: size * 0.65, height: 2, backgroundColor: color, borderRadius: 1 }} />
          <View
            style={{
              width: size * 0.35,
              height: size * 0.35,
              borderTopWidth: 2,
              borderRightWidth: 2,
              borderColor: color,
              transform: [{ rotate: '45deg' }],
              position: 'absolute',
              right: 2,
            }}
          />
        </View>
      );

    case 'camera':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.85,
              height: size * 0.65,
              borderWidth: 2,
              borderColor: color,
              borderRadius: 4,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 2,
            }}
          >
            <View style={{ width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14, borderWidth: 1.8, borderColor: color }} />
          </View>
          <View style={{ width: size * 0.3, height: 3, backgroundColor: color, borderTopLeftRadius: 2, borderTopRightRadius: 2, position: 'absolute', top: 1 }} />
        </View>
      );

    case 'edit':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.65,
              height: 2.2,
              backgroundColor: color,
              borderRadius: 1,
              transform: [{ rotate: '45deg' }],
            }}
          />
          <View
            style={{
              width: 4,
              height: 4,
              backgroundColor: color,
              position: 'absolute',
              bottom: 2,
              left: 2,
            }}
          />
        </View>
      );

    case 'check':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.6,
              height: size * 0.35,
              borderBottomWidth: 2.4,
              borderLeftWidth: 2.4,
              borderColor: color,
              transform: [{ rotate: '-45deg' }],
              marginTop: -2,
            }}
          />
        </View>
      );

    case 'user':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.38,
              height: size * 0.38,
              borderRadius: size * 0.19,
              borderWidth: 2,
              borderColor: color,
              position: 'absolute',
              top: 2,
            }}
          />
          <View
            style={{
              width: size * 0.75,
              height: size * 0.45,
              borderTopLeftRadius: size * 0.35,
              borderTopRightRadius: size * 0.35,
              borderWidth: 2,
              borderBottomWidth: 0,
              borderColor: color,
              position: 'absolute',
              bottom: 1,
            }}
          />
        </View>
      );

    case 'lock':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.45,
              height: size * 0.45,
              borderTopLeftRadius: size * 0.25,
              borderTopRightRadius: size * 0.25,
              borderWidth: 2,
              borderBottomWidth: 0,
              borderColor: color,
              position: 'absolute',
              top: 1,
            }}
          />
          <View
            style={{
              width: size * 0.7,
              height: size * 0.5,
              borderRadius: 3,
              backgroundColor: color,
              position: 'absolute',
              bottom: 2,
            }}
          />
        </View>
      );

    case 'wifi':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.7,
              height: size * 0.7,
              borderRadius: size * 0.35,
              borderTopWidth: 2,
              borderColor: color,
              position: 'absolute',
              top: 2,
            }}
          />
          <View
            style={{
              width: size * 0.45,
              height: size * 0.45,
              borderRadius: size * 0.225,
              borderTopWidth: 2,
              borderColor: color,
              position: 'absolute',
              top: 6,
            }}
          />
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color, position: 'absolute', bottom: 3 }} />
        </View>
      );

    case 'power':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.75,
              height: size * 0.75,
              borderRadius: size * 0.375,
              borderWidth: 2,
              borderColor: color,
              borderTopColor: 'transparent',
            }}
          />
          <View style={{ width: 2, height: size * 0.4, backgroundColor: color, position: 'absolute', top: 1 }} />
        </View>
      );

    case 'joystick':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View style={{ width: size * 0.75, height: size * 0.75, borderRadius: size * 0.375, borderWidth: 2, borderColor: color }} />
          <View style={{ width: size * 0.3, height: size * 0.3, borderRadius: size * 0.15, backgroundColor: color }} />
        </View>
      );

    case 'eye':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.95,
              height: size * 0.58,
              borderRadius: (size * 0.58) / 2,
              borderWidth: 2,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: size * 0.24, height: size * 0.24, borderRadius: size * 0.12, backgroundColor: color }} />
          </View>
        </View>
      );

    case 'eye-off':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.95,
              height: size * 0.58,
              borderRadius: (size * 0.58) / 2,
              borderWidth: 2,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.55,
            }}
          >
            <View style={{ width: size * 0.24, height: size * 0.24, borderRadius: size * 0.12, backgroundColor: color }} />
          </View>
          <View
            style={{
              width: size * 1.25,
              height: 2,
              backgroundColor: color,
              position: 'absolute',
              transform: [{ rotate: '-45deg' }],
            }}
          />
        </View>
      );

    case 'mail':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.9,
              height: size * 0.65,
              borderWidth: 2,
              borderColor: color,
              borderRadius: 3,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: size * 0.65,
                height: size * 0.4,
                borderTopWidth: 2,
                borderLeftWidth: 2,
                borderColor: color,
                transform: [{ rotate: '45deg' }],
                position: 'absolute',
                top: 2,
              }}
            />
          </View>
        </View>
      );

    case 'phone':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.5,
              height: size * 0.8,
              borderWidth: 2,
              borderColor: color,
              borderBottomLeftRadius: size * 0.2,
              borderBottomRightRadius: size * 0.2,
              borderTopLeftRadius: size * 0.14,
              borderTopRightRadius: size * 0.14,
            }}
          />
        </View>
      );

    case 'message':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <View
            style={{
              width: size * 0.85,
              height: size * 0.7,
              borderWidth: 2,
              borderColor: color,
              borderRadius: size * 0.18,
            }}
          />
          <View
            style={{
              width: size * 0.3,
              height: size * 0.3,
              backgroundColor: Colors.cardBackground,
              borderWidth: 2,
              borderColor: color,
              position: 'absolute',
              bottom: 1,
              left: size * 0.3,
              transform: [{ rotate: '45deg' }],
            }}
          />
          <View style={{ position: 'absolute', flexDirection: 'column', gap: size * 0.12 }}>
            <View style={{ width: size * 0.4, height: 2, backgroundColor: color, borderRadius: 1 }} />
            <View style={{ width: size * 0.4, height: 2, backgroundColor: color, borderRadius: 1 }} />
          </View>
        </View>
      );

    case 'google':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <Text style={{ fontSize: size * 0.85, fontWeight: '800', color }}>G</Text>
        </View>
      );

    case 'facebook':
      return (
        <View
          style={[
            {
              width: size,
              height: size,
              borderRadius: size * 0.28,
              backgroundColor: '#1877F2',
              alignItems: 'center',
              justifyContent: 'center',
            },
            style,
          ]}
        >
          <Text style={{ fontSize: size * 0.8, fontWeight: '800', color: '#fff' }}>f</Text>
        </View>
      );

    case 'apple':
      return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
          <Text style={{ fontSize: size * 0.85, fontWeight: '800', color }}></Text>
        </View>
      );

    case 'whatsapp':
      return (
        <View
          style={[
            {
              width: size,
              height: size,
              borderRadius: size * 0.28,
              backgroundColor: '#25D366',
              alignItems: 'center',
              justifyContent: 'center',
            },
            style,
          ]}
        >
          <Text style={{ fontSize: size * 0.72, fontWeight: '800', color: '#fff' }}>WA</Text>
        </View>
      );

    default:
      return <Text style={{ color, fontSize: size * 0.6, fontWeight: '700' }}>●</Text>;
  }
};

const styles = StyleSheet.create({
  badgeBase: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppIcon;
