import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Colors as DefaultColors } from '../constants/theme';
import { useAppStyle } from '../constants/StyleContext';

const { width } = Dimensions.get('window');

/**
 * OrganicBackground Component
 * Renders smooth overlapping pastel green curved organic shapes:
 * 1. Top-Right Corner (behind S.I.A.R. brand logo)
 * 2. Bottom-Left Corner (behind devices grid and bottom tab bar)
 * Base Background: #F8F9F5
 */
export const OrganicBackground = ({ children, style, showBottom = true, showTop = true }) => {
  let colors = DefaultColors;
  let curvesIntensity = 'full';

  try {
    const appStyle = useAppStyle();
    if (appStyle) {
      colors = appStyle.colors;
      curvesIntensity = appStyle.curvesIntensity;
    }
  } catch (_) {
    // Fallback if outside provider
  }

  const isHidden = curvesIntensity === 'none';
  const isSubtle = curvesIntensity === 'subtle';
  const outerOpacity = isSubtle ? 0.35 : 0.65;
  const innerOpacity = isSubtle ? 0.45 : 0.85;

  return (
    <View style={[styles.container, { backgroundColor: colors.background || '#F8F9F5' }, style]}>
      {/* 1. Top Right Organic Blob (Behind S.I.A.R. logo) */}
      {showTop && !isHidden && (
        <View style={styles.topRightContainer} pointerEvents="none">
          {/* Outer larger pastel curve */}
          <View
            style={[
              styles.topRightBlobOuter,
              {
                backgroundColor: colors.pastelGreen || '#B8D0B3',
                opacity: outerOpacity,
              },
            ]}
          />
          {/* Inner accent curve */}
          <View
            style={[
              styles.topRightBlobInner,
              {
                backgroundColor: colors.lightPastelGreen || '#DCECC9',
                opacity: innerOpacity,
              },
            ]}
          />
          {/* Soft bubble */}
          <View
            style={[
              styles.topRightBubble,
              {
                backgroundColor: colors.mintLight || '#E2EFDA',
                opacity: outerOpacity,
              },
            ]}
          />
        </View>
      )}

      {/* 2. Bottom Left Organic Blob (Behind grid and bottom navigation) */}
      {showBottom && !isHidden && (
        <View style={styles.bottomLeftContainer} pointerEvents="none">
          {/* Outer base curve */}
          <View
            style={[
              styles.bottomLeftBlobOuter,
              {
                backgroundColor: colors.pastelGreen || '#B8D0B3',
                opacity: outerOpacity * 0.9,
              },
            ]}
          />
          {/* Inner pastel overlay */}
          <View
            style={[
              styles.bottomLeftBlobInner,
              {
                backgroundColor: colors.lightPastelGreen || '#DCECC9',
                opacity: innerOpacity * 0.95,
              },
            ]}
          />
          {/* Soft bubble */}
          <View
            style={[
              styles.bottomLeftBubble,
              {
                backgroundColor: colors.mintLight || '#E2EFDA',
                opacity: outerOpacity,
              },
            ]}
          />
        </View>
      )}

      {/* Screen Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9F5',
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  // Top-Right Organic Blobs
  topRightContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.7,
    height: 240,
    zIndex: 1,
  },
  topRightBlobOuter: {
    position: 'absolute',
    top: -85,
    right: -60,
    width: 250,
    height: 230,
    borderRadius: 120,
    transform: [{ scaleX: 1.25 }, { rotate: '25deg' }],
  },
  topRightBlobInner: {
    position: 'absolute',
    top: -55,
    right: -35,
    width: 180,
    height: 170,
    borderRadius: 90,
    transform: [{ rotate: '-15deg' }],
  },
  topRightBubble: {
    position: 'absolute',
    top: 75,
    right: 140,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  // Bottom-Left Organic Blobs
  bottomLeftContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width * 0.75,
    height: 250,
    zIndex: 1,
  },
  bottomLeftBlobOuter: {
    position: 'absolute',
    bottom: -100,
    left: -70,
    width: 280,
    height: 260,
    borderRadius: 135,
    transform: [{ scaleX: 1.2 }, { rotate: '-20deg' }],
  },
  bottomLeftBlobInner: {
    position: 'absolute',
    bottom: -65,
    left: -45,
    width: 200,
    height: 190,
    borderRadius: 100,
    transform: [{ rotate: '20deg' }],
  },
  bottomLeftBubble: {
    position: 'absolute',
    bottom: 90,
    left: 145,
    width: 38,
    height: 38,
    borderRadius: 19,
  },
});

export default OrganicBackground;
