import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';

/**
 * ArcBatteryGauge Component
 * Medidor de batería semicircular hacia arriba (∩), sin rotación ni dependencia
 * del sweep-flag: el arco se genera muestreando el semicírculo SUPERIOR, por lo
 * que siempre dibuja la curva con la panza hacia arriba (nunca en forma de U).
 *
 * Estructura FlexBox vertical (columna, centrada):
 *  - SVG con el arco en la parte superior
 *  - Bloque de texto justo en el espacio inferior del arco, por lo que el valor
 *    "75 %" y la leyenda "Porcentaje de Batería" NUNCA se superponen.
 *
 * Geometría: viewBox 160x64, centro del semicírculo (80,48), radio 40, stroke 9.
 * El progreso se calcula a partir del nivel (level/percentage, 0-100) con
 * strokeDasharray + strokeDashoffset.
 */
const SVG_W = 160;
const SVG_H = 64;
const CX = 80;
const CY = 48;
const R = 40;
const STROKE = 9;
const ARC_LENGTH = Math.PI * R;

const domePoint = (deg) => {
  const a = (deg * Math.PI) / 180;
  return { x: CX + R * Math.cos(a), y: CY - R * Math.sin(a) };
};

// Semicírculo superior muestreado (180° -> 0°): garantiza la curva ∩
const domePath = (() => {
  const steps = [];
  for (let deg = 180; deg >= 0; deg -= 10) {
    const p = domePoint(deg);
    steps.push(`${steps.length ? 'L' : 'M'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }
  return steps.join(' ');
})();

export const ArcBatteryGauge = ({
  percentage = 75,
  level,
  size = 160,
  style,
}) => {
  const value = level !== undefined ? level : percentage;
  const fraction = Math.min(1, Math.max(0, value / 100));
  const showSeparator = fraction > 0 && fraction < 1;

  // Progreso dinámico: qué porción del arco (izquierda -> derecha) está activa
  const dashOffset = ARC_LENGTH * (1 - fraction);

  // Borde de la porción activa (línea divisoria)
  const sepDeg = 180 - fraction * 180;
  const a = (sepDeg * Math.PI) / 180;
  const sepInner = {
    x: CX + (R - STROKE / 2 - 1) * Math.cos(a),
    y: CY - (R - STROKE / 2 - 1) * Math.sin(a),
  };
  const sepOuter = {
    x: CX + (R + STROKE / 2 + 1) * Math.cos(a),
    y: CY - (R + STROKE / 2 + 1) * Math.sin(a),
  };

  return (
    <View style={[styles.container, style]}>
      <Svg
        width={size}
        height={size * (SVG_H / SVG_W)}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        overflow="visible"
      >
        {/* Track gris completo (arco hacia arriba) */}
        <Path d={domePath} stroke="#CCCCCC" strokeWidth={STROKE} strokeLinecap="round" fill="none" />

        {/* Barra activa verde (progreso por strokeDashoffset) */}
        {fraction > 0 && (
          <Path
            d={domePath}
            stroke="#388E3C"
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${ARC_LENGTH}`}
            strokeDashoffset={dashOffset}
          />
        )}

        {/* Línea divisoria negra en el borde activo */}
        {showSeparator && (
          <Line
            x1={sepInner.x}
            y1={sepInner.y}
            x2={sepOuter.x}
            y2={sepOuter.y}
            stroke="#000000"
            strokeWidth={2}
            strokeLinecap="round"
          />
        )}
      </Svg>

      {/* Bloque de texto justo debajo del arco (nunca se superpone) */}
      <View style={styles.textBlock}>
        <Text style={styles.valueText}>{value} %</Text>
        <Text style={styles.labelText}>Porcentaje de Batería</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 2,
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  labelText: {
    fontSize: 11,
    color: '#555555',
    marginTop: 4,
  },
});

export default ArcBatteryGauge;