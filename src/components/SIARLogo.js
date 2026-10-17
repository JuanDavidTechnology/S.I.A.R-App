import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

/**
 * Official S.I.A.R. Logo Component
 * Sistema de Información Agrícola con Robótica
 */
export const SIARLogo = ({ size = 'medium', showSubtitle = true, style }) => {
  const isSmall = size === 'small';
  const isLarge = size === 'large';
  const isHeader = size === 'header';

  const emblemSize = isHeader ? 50 : isSmall ? 32 : isLarge ? 58 : 42;
  const titleSize = isSmall ? 16 : isLarge ? 26 : 20;

  return (
    <View style={[styles.container, style]}>
      {/* Emblem: Robot Wheel + Plant Sprout Fusion */}
      <View
        style={[
          styles.emblemContainer,
          {
            width: emblemSize,
            height: emblemSize,
            borderRadius: emblemSize * 0.35,
          },
        ]}
      >
        {/* Outer Ring / Gear accent */}
        <View
          style={[
            styles.emblemInner,
            {
              width: emblemSize * 0.76,
              height: emblemSize * 0.76,
              borderRadius: (emblemSize * 0.76) / 2,
            },
          ]}
        >
          {/* Leaf Sprout */}
          <View style={styles.sproutWrapper}>
            <View style={styles.leftLeaf} />
            <View style={styles.rightLeaf} />
            <View style={styles.stem} />
          </View>
        </View>
        {/* Robotics signal dot accent */}
        <View style={styles.roboticsDot} />
      </View>

      {/* Brand Text (Only if not header emblem mode and subtitle/title desired) */}
      {!isHeader && (
        <View style={styles.textWrapper}>
          <View style={styles.titleRow}>
            <Text style={[styles.brandTitle, { fontSize: titleSize }]}>S.I.A.R.</Text>
            <View style={styles.livePulseDot} />
          </View>
          {showSubtitle && !isSmall && (
            <Text style={styles.brandSubtitle}>
              Sistema de Información Agrícola con Robótica
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emblemContainer: {
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  emblemInner: {
    backgroundColor: Colors.leafGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.mintLight,
  },
  sproutWrapper: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftLeaf: {
    width: 9,
    height: 9,
    backgroundColor: Colors.mintLight,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    position: 'absolute',
    left: 3,
    top: 3,
    transform: [{ rotate: '-20deg' }],
  },
  rightLeaf: {
    width: 9,
    height: 9,
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    position: 'absolute',
    right: 3,
    top: 3,
    transform: [{ rotate: '20deg' }],
  },
  stem: {
    width: 2.2,
    height: 11,
    backgroundColor: Colors.mintLight,
    position: 'absolute',
    bottom: 2,
    borderRadius: 1,
  },
  roboticsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.warningOrange,
    position: 'absolute',
    top: 3,
    right: 3,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  textWrapper: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: 1.2,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brightGreen,
    marginLeft: 6,
  },
  brandSubtitle: {
    fontSize: 9.5,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
    maxWidth: 200,
  },
});

export default SIARLogo;
