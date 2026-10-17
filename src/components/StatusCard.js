import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useSettings } from '../constants/SettingsContext';

/**
 * StatusCard Component
 * Cuadrícula 2x2 de tarjetas cuadradas (aspectRatio 1):
 * - Sin carrito vinculado o carrito apagado (disconnected / device null):
 *   la tarjeta se reemplaza por completo con el placeholder "+ conectar nuevo dispositivo".
 * - Con carrito conectado: imagen carrito, zona, velocidad en vivo (km/h) y botón Desconectar.
 */
export const StatusCard = ({
  device,
  isEmpty = false,
  disconnected = false,
  onPress,
  onConnectNew,
  onDisconnect,
  style,
}) => {
  const { theme, unitMetric } = useSettings();
  // Tarjeta del mockup: conectar nuevo dispositivo (+ en círculo)
  const renderConnectCard = (onPressAction) => (
    <TouchableOpacity
      style={[
        styles.card,
        styles.cardAdd,
        { backgroundColor: theme.cardBg, borderColor: theme.border, borderWidth: 1 },
        style,
      ]}
      activeOpacity={0.7}
      onPress={onPressAction}
    >
      <View style={styles.circlePlusIcon}>
        <Svg width={44} height={44} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={10} stroke={theme.textPrimary} strokeWidth={1.8} />
          <Path
            d="M12 8V16M8 12H16"
            stroke={theme.textPrimary}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <Text style={[styles.addText, { color: theme.textSecondary }]}>conectar nuevo</Text>
      <Text style={[styles.addText, { color: theme.textSecondary }]}>dispositivo</Text>
    </TouchableOpacity>
  );

  // Ranura vacía o carrito apagado: mostrar únicamente el placeholder "+"
  if (isEmpty || !device || disconnected) {
    return renderConnectCard(onConnectNew);
  }

  const { id, zona = 'Zona 1', velocidad = 0 } = device;

  // Convertir km/h -> mph cuando las unidades del sistema son imperiales
  const velocidadMostrada = unitMetric ? velocidad.toFixed(1) : (velocidad * 0.621371).toFixed(1);
  const unidadVelocidad = unitMetric ? 'km/h' : 'mph';

  // Carrito conectado: telemetría en vivo + botón Desconectar
  return (
    <TouchableOpacity
      style={[
        styles.card,
        styles.cardActive,
        { backgroundColor: theme.cardBg, borderColor: theme.border, borderWidth: 1 },
        style,
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.activeHeader}>
        <Image
          source={require('../../assets/images/carrito_logo.png')}
          style={styles.carritoLogoImg}
          resizeMode="contain"
        />
        <View style={[styles.statusDot, { backgroundColor: theme.primary }]} />
      </View>

      <Text style={[styles.zoneText, { color: theme.textPrimary }]}>{zona}</Text>
      <Text style={[styles.speedText, { color: theme.textPrimary }]}>
        {velocidadMostrada} {unidadVelocidad}
      </Text>

      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: '#FFEBEE' }]}
        activeOpacity={0.8}
        onPress={() => onDisconnect && onDisconnect(id)}
      >
        <Text style={[styles.actionBtnText, { color: '#D32F2F' }]}>Desconectar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
  },
  // Tarjeta de Agregar / Conectar (Mockup)
  cardAdd: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  circlePlusIcon: {
    marginBottom: 8,
  },
  addText: {
    fontSize: 12,
    color: '#2E3532',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 15,
  },
  // Tarjeta Activa
  cardActive: {
    flex: 1,
    aspectRatio: 1,
    padding: 14,
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carritoLogoImg: {
    width: 34,
    height: 34,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  zoneText: {
    fontSize: 13,
    color: '#0F3818',
    fontWeight: '600',
  },
  speedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  actionBtn: {
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default StatusCard;