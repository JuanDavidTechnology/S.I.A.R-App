import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Shadows } from '../constants/theme';

/**
 * BatteryGauge Component
 * Medidor de batería semicircular graduado con voltajes, corriente y colores dinámicos
 */
export const BatteryGauge = ({
  percentage = 87,
  voltage = 24.4,
  currentDraw = 3.2,
  isCharging = false,
  size = 140,
  style,
}) => {
  // Color determination based on battery level
  let gaugeColor = Colors.brightGreen;
  let statusLabel = 'ÓPTIMO';
  if (percentage <= 20) {
    gaugeColor = Colors.danger;
    statusLabel = 'CRÍTICO';
  } else if (percentage <= 35) {
    gaugeColor = Colors.warningOrange;
    statusLabel = 'BAJO';
  } else if (percentage <= 65) {
    gaugeColor = '#E6A100'; // Amber
    statusLabel = 'MEDIO';
  }

  // Calculate segments for the semicircular arc (10 segments)
  const totalSegments = 10;
  const activeSegments = Math.round((percentage / 100) * totalSegments);

  return (
    <View style={[styles.container, { width: size, minHeight: size * 0.9 }, style]}>
      {/* Semicircular Arc Container */}
      <View style={[styles.arcWrapper, { width: size, height: size * 0.58 }]}>
        {/* Render Arc Segment Ticks */}
        <View style={styles.segmentContainer}>
          {Array.from({ length: totalSegments }).map((_, index) => {
            const isActive = index < activeSegments;
            // Angle from -80deg to +80deg across semicircle
            const angle = -80 + (index * 160) / (totalSegments - 1);
            
            return (
              <View
                key={index}
                style={[
                  styles.segmentTick,
                  {
                    transform: [
                      { rotate: `${angle}deg` },
                      { translateY: -(size * 0.38) },
                    ],
                    backgroundColor: isActive ? gaugeColor : Colors.border,
                    opacity: isActive ? 1 : 0.4,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Center Display Card */}
        <View style={[styles.centerCard, { width: size * 0.72, height: size * 0.5 }]}>
          <View style={styles.percentageRow}>
            <Text style={[styles.percentageText, { color: gaugeColor }]}>{percentage}</Text>
            <Text style={[styles.percentageSymbol, { color: gaugeColor }]}>%</Text>
          </View>

          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: gaugeColor }]} />
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>
      </View>

      {/* Telemetry Sub-Metrics */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>VOLTAJE</Text>
          <Text style={styles.metricValue}>{voltage}V</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>CONSUMO</Text>
          <Text style={styles.metricValue}>{currentDraw}A</Text>
        </View>

        {isCharging && (
          <>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: Colors.brightGreen }]}>CARGA</Text>
              <Text style={[styles.metricValue, { color: Colors.brightGreen }]}>⚡ ON</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.pastelGreen,
    ...Shadows.soft,
  },
  arcWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 4,
  },
  segmentContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentTick: {
    position: 'absolute',
    width: 6,
    height: 14,
    borderRadius: 3,
  },
  centerCard: {
    backgroundColor: Colors.mintLight,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.pastelGreen,
    marginTop: 10,
  },
  percentageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  percentageSymbol: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
    marginLeft: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: -2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: 0.5,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginTop: 6,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 7.5,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.4,
  },
  metricValue: {
    fontSize: 10.5,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.border,
  },
});

export default BatteryGauge;
