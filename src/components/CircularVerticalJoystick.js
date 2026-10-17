import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Shadows } from '../constants/theme';

/**
 * CircularVerticalJoystick Component
 * Joystick circular D-Pad vertical S.I.A.R.:
 * - Base circular externa en verde pastel (#D8E8D5)
 * - Flechas direccionales negras para maniobra vertical (Arriba / Abajo)
 * - Botón táctil central (Thumbstick) circular en verde brillante sólido (#4CAF50)
 */
export const CircularVerticalJoystick = ({
  size = 110,
  value = 0,
  onValueChange,
  onStepUp,
  onStepDown,
  onReset,
  style,
}) => {
  const [panY] = useState(() => new Animated.Value(0));
  const maxTravel = (size - 54) / 2;

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
        const normalized = -Number((dy / maxTravel).toFixed(2));
        if (onValueChange) {
          onValueChange(normalized);
        }
      },
      onPanResponderRelease: () => {
        Animated.spring(panY, {
          toValue: 0,
          friction: 6,
          tension: 75,
          useNativeDriver: false,
        }).start(() => {
          if (onValueChange) {
            onValueChange(0);
          }
        });
      },
    })
  );

  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.outerCircularPad, { width: size, height: size, borderRadius: size / 2 }]}>
        {/* Flecha Superior Táctil '^' */}
        <TouchableOpacity
          style={styles.arrowTopBtn}
          activeOpacity={0.7}
          onPress={() => onStepUp && onStepUp()}
        >
          <View style={styles.chevronUp} />
        </TouchableOpacity>

        {/* Botón Circular Central Verde */}
        <Animated.View
          style={[
            styles.knobContainer,
            {
              transform: [{ translateY: panY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            style={styles.circularKnobOuter}
            activeOpacity={0.9}
            onPress={() => onReset && onReset()}
          />
        </Animated.View>

        {/* Flecha Inferior Táctil 'v' */}
        <TouchableOpacity
          style={styles.arrowBottomBtn}
          activeOpacity={0.7}
          onPress={() => onStepDown && onStepDown()}
        >
          <View style={styles.chevronDown} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircularPad: {
    backgroundColor: '#D8E8D5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Shadows.medium,
    borderWidth: 2,
    borderColor: '#B8CFB4',
  },
  arrowTopBtn: {
    position: 'absolute',
    top: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 30,
    zIndex: 15,
  },
  arrowBottomBtn: {
    position: 'absolute',
    bottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 30,
    zIndex: 15,
  },
  chevronUp: {
    width: 14,
    height: 14,
    borderTopWidth: 3.5,
    borderLeftWidth: 3.5,
    borderColor: '#111111',
    transform: [{ rotate: '45deg' }],
  },
  chevronDown: {
    width: 14,
    height: 14,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderColor: '#111111',
    transform: [{ rotate: '45deg' }],
  },
  knobContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  circularKnobOuter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#6DCB73',
    ...Shadows.medium,
  },
});

export default CircularVerticalJoystick;
