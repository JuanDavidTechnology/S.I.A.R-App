import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native';
import { Colors, Shadows } from '../constants/theme';

/**
 * VerticalJoystick Component
 * Desplazamiento exclusivo en el Eje Y (Adelante / Atrás / Detenido)
 * Retorno automático con resorte al soltar.
 */
export const VerticalJoystick = ({
  height = 220,
  width = 72,
  onValueChange,
  label = 'AVANCE / REVERSO',
  style,
}) => {
  const [value, setValue] = useState(0); // -1.0 to +1.0
  const [panY] = useState(() => new Animated.Value(0));
  const maxTravel = (height - 60) / 2;

  const [panResponder] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        panY.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        let dy = gestureState.dy;
        if (dy < -maxTravel) dy = -maxTravel;
        if (dy > maxTravel) dy = maxTravel;

        panY.setValue(dy);
        // Normalized: -1 (Reverse / bottom) to +1 (Forward / top)
        // In screen coordinates, negative dy is UP (Forward)
        const normalized = -Number((dy / maxTravel).toFixed(2));
        setValue(normalized);
        if (onValueChange) {
          onValueChange(normalized);
        }
      },
      onPanResponderRelease: () => {
        Animated.spring(panY, {
          toValue: 0,
          friction: 5,
          tension: 80,
          useNativeDriver: false,
        }).start(() => {
          setValue(0);
          if (onValueChange) {
            onValueChange(0);
          }
        });
      },
    })
  );

  // Percentage for display
  const percentage = Math.round(Math.abs(value) * 100);
  const isForward = value > 0.05;
  const isReverse = value < -0.05;
  const stateText = isForward ? `ADELANTE ${percentage}%` : isReverse ? `REVERSO ${percentage}%` : 'STOP';
  const stateColor = isForward ? Colors.brightGreen : isReverse ? Colors.warningOrange : Colors.textMuted;

  return (
    <View style={[styles.wrapper, style]}>
      {/* Label and Live Status */}
      <View style={styles.headerRow}>
        <Text style={styles.labelText}>{label}</Text>
        <View style={[styles.statusBadge, { borderColor: stateColor }]}>
          <Text style={[styles.statusText, { color: stateColor }]}>{stateText}</Text>
        </View>
      </View>

      {/* Joystick Track */}
      <View style={[styles.track, { height, width }]}>
        {/* Forward Arrow Indicator */}
        <View style={[styles.arrowTop, isForward && styles.activeArrow]}>
          <View style={[styles.arrowTriangleUp, isForward && { borderBottomColor: Colors.brightGreen }]} />
          <Text style={[styles.markText, isForward && { color: Colors.brightGreen }]}>MAX</Text>
        </View>

        {/* Center Zero Line */}
        <View style={styles.centerMarker}>
          <View style={styles.markerLine} />
          <Text style={styles.centerZeroText}>0</Text>
          <View style={styles.markerLine} />
        </View>

        {/* Reverse Arrow Indicator */}
        <View style={[styles.arrowBottom, isReverse && styles.activeArrow]}>
          <Text style={[styles.markText, isReverse && { color: Colors.warningOrange }]}>REV</Text>
          <View style={[styles.arrowTriangleDown, isReverse && { borderTopColor: Colors.warningOrange }]} />
        </View>

        {/* Graduated Scale Ticks */}
        <View style={styles.ticksContainer}>
          <View style={styles.tick} />
          <View style={[styles.tick, styles.tickLong]} />
          <View style={styles.tick} />
          <View style={{ height: 20 }} />
          <View style={styles.tick} />
          <View style={[styles.tick, styles.tickLong]} />
          <View style={styles.tick} />
        </View>

        {/* Draggable Knob / Thumb */}
        <Animated.View
          style={[
            styles.knob,
            {
              transform: [{ translateY: panY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.knobOuter}>
            <View style={styles.knobInner}>
              {/* Grip lines */}
              <View style={styles.gripLine} />
              <View style={styles.gripLine} />
              <View style={styles.gripLine} />
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  headerRow: {
    alignItems: 'center',
    marginBottom: 8,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  track: {
    backgroundColor: '#E5EFE3',
    borderRadius: 36,
    borderWidth: 2,
    borderColor: Colors.pastelGreen,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Shadows.soft,
  },
  arrowTop: {
    position: 'absolute',
    top: 8,
    alignItems: 'center',
  },
  arrowBottom: {
    position: 'absolute',
    bottom: 8,
    alignItems: 'center',
  },
  activeArrow: {
    transform: [{ scale: 1.15 }],
  },
  arrowTriangleUp: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.darkGreen,
    marginBottom: 2,
  },
  arrowTriangleDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.darkGreen,
    marginTop: 2,
  },
  markText: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  centerMarker: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '85%',
  },
  markerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: Colors.pastelGreen,
  },
  centerZeroText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    marginHorizontal: 4,
  },
  ticksContainer: {
    position: 'absolute',
    right: 8,
    height: '70%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  tick: {
    width: 6,
    height: 1.5,
    backgroundColor: Colors.pastelGreen,
    borderRadius: 1,
  },
  tickLong: {
    width: 11,
    backgroundColor: Colors.darkGreen,
  },
  knob: {
    width: 58,
    height: 58,
    borderRadius: 29,
    position: 'absolute',
    zIndex: 10,
  },
  knobOuter: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2.5,
    borderColor: Colors.mintLight,
  },
  knobInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  gripLine: {
    width: 20,
    height: 2.5,
    borderRadius: 1.2,
    backgroundColor: Colors.mintLight,
  },
});

export default VerticalJoystick;
