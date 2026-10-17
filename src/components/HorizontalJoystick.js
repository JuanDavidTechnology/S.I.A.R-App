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
 * HorizontalJoystick Component
 * Joystick circular D-Pad horizontal S.I.A.R. — idéntico al vertical:
 * - Base circular externa en verde pastel (#D8E8D5)
 * - Flechas direccionales negras para maniobra lateral (Izquierda '<' / Derecha '>')
 * - Botón táctil central (Thumbstick) circular en verde brillante sólido (#4CAF50)
 */
export const HorizontalJoystick = ({
  size = 110,
  angle = 0,
  onValueChange,
  onStepLeft,
  onStepRight,
  onReset,
  style,
}) => {
  const [panX] = useState(() => new Animated.Value(0));
  const maxTravel = (size - 54) / 2;

  const [panResponder] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        panX.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        let dx = gestureState.dx;
        if (dx < -maxTravel) dx = -maxTravel;
        if (dx > maxTravel) dx = maxTravel;

        panX.setValue(dx);
        const normalized = Number((dx / maxTravel).toFixed(2));
        if (onValueChange) {
          onValueChange(normalized);
        }
      },
      onPanResponderRelease: () => {
        Animated.spring(panX, {
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
        {/* Flecha Izquierda Táctil '<' */}
        <TouchableOpacity
          style={styles.arrowLeftBtn}
          activeOpacity={0.7}
          onPress={() => onStepLeft && onStepLeft()}
        >
          <View style={styles.chevronLeft} />
        </TouchableOpacity>

        {/* Botón Circular Central Verde */}
        <Animated.View
          style={[
            styles.knobContainer,
            {
              transform: [{ translateX: panX }],
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

        {/* Flecha Derecha Táctil '>' */}
        <TouchableOpacity
          style={styles.arrowRightBtn}
          activeOpacity={0.7}
          onPress={() => onStepRight && onStepRight()}
        >
          <View style={styles.chevronRight} />
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
  arrowLeftBtn: {
    position: 'absolute',
    left: 8,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    zIndex: 15,
  },
  arrowRightBtn: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    zIndex: 15,
  },
  chevronLeft: {
    width: 14,
    height: 14,
    borderLeftWidth: 3.5,
    borderBottomWidth: 3.5,
    borderColor: '#111111',
    transform: [{ rotate: '45deg' }],
  },
  chevronRight: {
    width: 14,
    height: 14,
    borderRightWidth: 3.5,
    borderTopWidth: 3.5,
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

export default HorizontalJoystick;