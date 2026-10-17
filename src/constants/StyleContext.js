import React, { createContext, useContext, useState } from 'react';
import { Colors as DefaultColors } from './theme';

const StyleContext = createContext(null);

export const AccentPresets = {
  default: {
    id: 'default',
    name: 'Verde S.I.A.R.',
    primaryDark: '#0F3818',
    darkGreen: '#1B3E2B',
    leafGreen: '#3A8E38',
    brightGreen: '#4CAF50',
    pastelGreen: '#B8D0B3',
    lightPastelGreen: '#DCECC9',
    mintLight: '#E2EFDA',
    background: '#F8F6F0',
  },
  emerald: {
    id: 'emerald',
    name: 'Esmeralda Vivo',
    primaryDark: '#004D40',
    darkGreen: '#00695C',
    leafGreen: '#00897B',
    brightGreen: '#00BFA5',
    pastelGreen: '#B2DFDB',
    lightPastelGreen: '#E0F2F1',
    mintLight: '#E0F7F4',
    background: '#F4FBF9',
  },
  olive: {
    id: 'olive',
    name: 'Oliva Cosecha',
    primaryDark: '#33691E',
    darkGreen: '#558B2F',
    leafGreen: '#689F38',
    brightGreen: '#7CB342',
    pastelGreen: '#DCEDC8',
    lightPastelGreen: '#F1F8E9',
    mintLight: '#ECF6E4',
    background: '#FBFDF8',
  },
  solar: {
    id: 'solar',
    name: 'Ámbar Solar',
    primaryDark: '#4E342E',
    darkGreen: '#3E2723',
    leafGreen: '#E65100',
    brightGreen: '#FB8C00',
    pastelGreen: '#FFE0B2',
    lightPastelGreen: '#FFF3E0',
    mintLight: '#FFF8E1',
    background: '#FDFBF7',
  },
};

export const StyleProvider = ({ children }) => {
  // Theme mode: 'light' | 'dark' | 'sunlight'
  const [themeMode, setThemeMode] = useState('light');
  // Accent Preset
  const [accentPreset, setAccentPreset] = useState('default');
  // Font scale: 'normal' (1.0) | 'large' (1.15) | 'xlarge' (1.3)
  const [fontScale, setFontScale] = useState('normal');
  // Organic background curves intensity: 'full' | 'subtle' | 'none'
  const [curvesIntensity, setCurvesIntensity] = useState('full');
  // Corner Roundness: 'organic' (24px) | 'smooth' (14px) | 'compact' (6px)
  const [borderStyle, setBorderStyle] = useState('organic');

  // Compute active colors based on themeMode and accentPreset
  const activePreset = AccentPresets[accentPreset] || AccentPresets.default;

  let computedColors = {
    ...DefaultColors,
    ...activePreset,
  };

  if (themeMode === 'dark') {
    computedColors = {
      ...computedColors,
      background: '#0B180E',
      cardBackground: '#132819',
      textPrimary: '#FFFFFF',
      textSecondary: '#A2BAA5',
      textMuted: '#6D8B71',
      border: '#1E3B27',
      borderLight: '#193320',
      mintLight: '#183420',
      pastelGreen: '#234C2F',
      lightPastelGreen: '#1A3923',
      shadow: '#000000',
    };
  } else if (themeMode === 'sunlight') {
    // High contrast for extreme direct sunlight in field
    computedColors = {
      ...computedColors,
      background: '#FFFFFF',
      cardBackground: '#FFFFFF',
      textPrimary: '#000000',
      textSecondary: '#222222',
      border: '#000000',
      borderLight: '#444444',
      primaryDark: '#000000',
      leafGreen: '#006600',
      mintLight: '#E8F5E9',
      pastelGreen: '#A5D6A7',
    };
  }

  const fontMultiplier = fontScale === 'large' ? 1.15 : fontScale === 'xlarge' ? 1.3 : 1.0;
  const radiusMultiplier = borderStyle === 'smooth' ? 0.65 : borderStyle === 'compact' ? 0.35 : 1.0;

  return (
    <StyleContext.Provider
      value={{
        themeMode,
        setThemeMode,
        accentPreset,
        setAccentPreset,
        fontScale,
        setFontScale,
        curvesIntensity,
        setCurvesIntensity,
        borderStyle,
        setBorderStyle,
        colors: computedColors,
        fontMultiplier,
        radiusMultiplier,
        isDark: themeMode === 'dark',
      }}
    >
      {children}
    </StyleContext.Provider>
  );
};

export const useAppStyle = () => {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error('useAppStyle must be used within a StyleProvider');
  }
  return context;
};

export default StyleContext;
