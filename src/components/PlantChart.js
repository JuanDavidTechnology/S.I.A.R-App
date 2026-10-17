import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { Colors, Shadows } from '../constants/theme';
import { useSettings } from '../constants/SettingsContext';

// Color dinámico de la barra: gris si está desconectado, semáforo si transmite
const obtenerColorBarra = (valor, estaConectado) => {
  if (!estaConectado) return '#E0E0E0'; // Inactivo / sin transmisión
  if (valor >= 160) return '#2E7D32'; // Verde oscuro (Alto)
  if (valor >= 120) return '#7CB342'; // Verde claro (Medio-alto)
  if (valor >= 80) return '#FBC02D'; // Amarillo (Medio)
  if (valor >= 40) return '#FB8C00'; // Naranja (Bajo)
  return '#E53935'; // Rojo (Muy bajo / Crítico)
};

// Datos por defecto (fallback): carr 1..4
const DEFAULT_DATA = [
  { id: 'carr1', label: 'carr 1', value: 180, conectado: true },
  { id: 'carr2', label: 'carr 2', value: 130, conectado: true },
  { id: 'carr3', label: 'carr 3', value: 75, conectado: true },
  { id: 'carr4', label: 'carr 4', value: 30, conectado: true },
];

/**
 * PlantChart Component
 * Gráfica de Barras "Cantidad de plantas revisadas" sincronizada con los carritos:
 * - Barra conectada: color semáforo según plantas (verde claro/oscuro, amarillo, naranja, rojo).
 * - Barra desconectada: altura 0 y color gris (#E0E0E0).
 * - Eje Y: 200 p/m, 150 p/m, 100 p/m, 50 p/m, 0 · Eje X: carr 1..carr 4.
 */
export const PlantChart = ({
  isLive = true,
  onToggleLive,
  data = DEFAULT_DATA,
  style,
}) => {
  const { theme } = useSettings();

  // Y-Axis scale marks
  const yAxisTicks = ['200 p/m', '150 p/m', '100 p/m', '50 p/m', '0'];

  // Chart Dimensions
  const plotHeight = 140;
  const plotWidth = 200;

  // Build bars
  const maxY = 200;
  const padTop = 8;
  const padBottom = 6;
  const baseY = plotHeight - padBottom;
  const xMin = 24;
  const xMax = 176;
  const step = data.length > 1 ? (xMax - xMin) / (data.length - 1) : 0;
  const barWidth = 30;
  const yFor = (v) => padTop + (1 - v / maxY) * (plotHeight - padTop - padBottom);

  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: theme.cardBg, borderColor: theme.border },
        style,
      ]}
    >
      {/* Header Row: Title & Live Indicator */}
      <View style={styles.headerRow}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Cantidad de plantas revisadas</Text>

        <TouchableOpacity
          style={styles.statusButton}
          activeOpacity={0.8}
          onPress={onToggleLive}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isLive ? Colors.brightGreen : Colors.dangerRed },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: isLive ? Colors.liveGreen : Colors.dangerRed },
            ]}
          >
            • {isLive ? 'En vivo' : 'Desconectado'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chart Canvas Area */}
      <View style={styles.chartWrapper}>
        {/* Y-Axis Column */}
        <View style={styles.yAxisColumn}>
          {yAxisTicks.map((tick, index) => (
            <View key={index} style={styles.yTickWrapper}>
              <Text style={[styles.yAxisText, { color: theme.textSecondary }]}>{tick}</Text>
            </View>
          ))}
        </View>

        {/* SVG Bar Plot Area with Horizontal Grid Lines */}
        <View style={styles.plotArea}>
          <Svg
            width="100%"
            height={plotHeight + 26}
            viewBox={`0 0 ${plotWidth} ${plotHeight + 26}`}
          >
            {/* Horizontal Grid Lines */}
            {yAxisTicks.map((tick, index) => {
              const y = yFor(200 - index * 50);
              return (
                <Line
                  key={`grid-${index}`}
                  x1={0}
                  y1={y}
                  x2={plotWidth}
                  y2={y}
                  stroke={theme.isDarkMode ? '#223A2B' : '#F0F3EE'}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              );
            })}

            {/* Barras: plantas por carril (color según conexión y rendimiento) */}
            {data.map((lane, i) => {
              const x = xMin + i * step - barWidth / 2;
              const barTop = yFor(lane.conectado ? lane.value : 0);
              const barHeight = Math.max(0, baseY - barTop);
              const barColor = obtenerColorBarra(lane.value, lane.conectado);
              return (
                barHeight > 0 && (
                  <Rect
                    key={lane.id}
                    x={x}
                    y={barTop}
                    width={barWidth}
                    height={barHeight}
                    rx={8}
                    fill={barColor}
                  />
                )
              );
            })}

            {/* X-Axis Labels: carr 1..carr 4 */}
            {data.map((lane, i) => (
              <SvgText
                key={`label-${lane.id}`}
                x={xMin + i * step}
                y={plotHeight + 18}
                fontSize={10}
                fill={lane.conectado ? theme.textSecondary : theme.isDarkMode ? '#3A5540' : '#B0BEC5'}
                fontWeight="700"
                textAnchor="middle"
              >
                {lane.label}
              </SvgText>
            ))}
          </Svg>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDF2EB',
    ...Shadows.soft,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    letterSpacing: 0.1,
    flex: 1,
    paddingRight: 8,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chartWrapper: {
    flexDirection: 'row',
    height: 170,
    marginTop: 4,
  },
  yAxisColumn: {
    width: 56,
    justifyContent: 'space-between',
    paddingBottom: 22,
    alignItems: 'flex-start',
  },
  yTickWrapper: {
    height: 18,
    justifyContent: 'center',
  },
  yAxisText: {
    fontSize: 10,
    color: '#A2A2A2',
    fontWeight: '600',
  },
  plotArea: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
  },
});

export default PlantChart;