import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStyle } from './StyleContext';
import { useUser } from './UserContext';
import { api } from '../services/api';

const SettingsContext = createContext(null);

const STORAGE_KEY = '@siar_settings_v1';

// PALETAS DE COLOR AGRÍCOLAS
export const THEME_PALETTES = {
  emerald: {
    name: 'Esmeralda',
    primary: '#2E7D32',
    darkGreen: '#0F3818',
    accent: '#4CAF50',
    lightBg: '#F7F9F6',
    cardBg: '#FFFFFF',
  },
  forest: {
    name: 'Bosque',
    primary: '#1B5E20',
    darkGreen: '#0B290E',
    accent: '#388E3C',
    lightBg: '#F2F6F3',
    cardBg: '#FFFFFF',
  },
  mint: {
    name: 'Menta',
    primary: '#00796B',
    darkGreen: '#00332C',
    accent: '#009688',
    lightBg: '#F0F7F6',
    cardBg: '#FFFFFF',
  },
};

// Mapeo paleta -> accent preset del StyleContext global (aplica tema a toda la app)
const paletteToAccent = (key) =>
  key === 'mint' ? 'emerald' : key === 'forest' ? 'olive' : 'default';
const accentToPalette = (key) =>
  key === 'emerald' ? 'mint' : key === 'olive' ? 'forest' : 'emerald';

/**
 * SettingsContext / SettingsProvider
 * Estado GLOBAL y PERSISTENTE de configuración de S.I.A.R.:
 * - Tema claro/oscuro y paletas agrícolas (sincronizan StyleContext => toda la app)
 * - Tamaño de texto, notificaciones, vibración/sonido, unidades y Bluetooth
 * - Foto de perfil global (Home, Perfil y Ajustes)
 * - userName / userRole delegados a UserContext (fuente única de verdad)
 */
export const SettingsProvider = ({ children }) => {
  const { isDark: styleIsDark, setThemeMode, accentPreset, setAccentPreset } = useAppStyle();
  const { userName, updateUserName, userRole, setUserRole } = useUser();

  // ESTADOS DE USUARIO Y PERFIL
  const [profileImage, setProfileImage] = useState(null);

  // ESTADOS DE PERSONALIZACIÓN
  const [selectedPaletteKey, setSelectedPaletteKey] = useState(() => accentToPalette(accentPreset));
  const [isDarkMode, setIsDarkMode] = useState(styleIsDark);
  const [fontSizeScale, setFontSizeScale] = useState('medium'); // 'small' | 'medium' | 'large'

  // ESTADOS SISTEMA Y PREFERENCIAS
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [unitMetric, setUnitMetric] = useState(true); // true = Métrica (°C, km/h) | false = Imperial (°F, mph)
  const [autoConnectBluetooth, setAutoConnectBluetooth] = useState(false);

  // Idioma (reservado para futura traducción ES/EN)
  const [language, setLanguage] = useState('es');

  // Bandera que evita persistir antes de hidratar desde AsyncStorage
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Aplicar tema oscuro sincronizando el StyleContext global
  const applyDark = (value) => {
    setIsDarkMode(value);
    setThemeMode(value ? 'dark' : 'light');
  };

  // Cambiar paleta sincronizando el accent preset global
  const applyPalette = (key) => {
    setSelectedPaletteKey(key);
    setAccentPreset(paletteToAccent(key));
  };

  // HIDRATACIÓN: restaurar ajustes guardados al abrir la app
  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted || !raw) return;
        const data = JSON.parse(raw);
        if (data.profileImage) setProfileImage(data.profileImage);
        if (data.selectedPaletteKey) {
          setSelectedPaletteKey(data.selectedPaletteKey);
          setAccentPreset(paletteToAccent(data.selectedPaletteKey));
        }
        if (typeof data.isDarkMode === 'boolean') {
          setIsDarkMode(data.isDarkMode);
          setThemeMode(data.isDarkMode ? 'dark' : 'light');
        }
        if (data.fontSizeScale) setFontSizeScale(data.fontSizeScale);
        if (typeof data.notificationsEnabled === 'boolean') setNotificationsEnabled(data.notificationsEnabled);
        if (typeof data.hapticFeedback === 'boolean') setHapticFeedback(data.hapticFeedback);
        if (typeof data.soundEffects === 'boolean') setSoundEffects(data.soundEffects);
        if (typeof data.unitMetric === 'boolean') setUnitMetric(data.unitMetric);
        if (typeof data.autoConnectBluetooth === 'boolean') setAutoConnectBluetooth(data.autoConnectBluetooth);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setSettingsLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, [setAccentPreset, setThemeMode]);

  // PERSISTENCIA: guardar ajustes en cada cambio
  useEffect(() => {
    if (!settingsLoaded) return;
    const payload = JSON.stringify({
      profileImage,
      selectedPaletteKey,
      isDarkMode,
      fontSizeScale,
      notificationsEnabled,
      hapticFeedback,
      soundEffects,
      unitMetric,
      autoConnectBluetooth,
    });
    AsyncStorage.setItem(STORAGE_KEY, payload).catch(() => {});
  }, [
    settingsLoaded,
    profileImage,
    selectedPaletteKey,
    isDarkMode,
    fontSizeScale,
    notificationsEnabled,
    hapticFeedback,
    soundEffects,
    unitMetric,
    autoConnectBluetooth,
  ]);

  // SYNC REMOTO: envío de ajustes a MySQL (PUT /user/settings.php) cuando cambien.
  // AsyncStorage se mantiene como capa rápida de arranque offline.
  useEffect(() => {
    if (!settingsLoaded) return;
    api
      .put('/user/settings.php', {
        profileImage,
        selectedPaletteKey,
        isDarkMode,
        fontSizeScale,
        notificationsEnabled,
        hapticFeedback,
        soundEffects,
        unitMetric,
        autoConnectBluetooth,
      })
      .catch(() => {});
  }, [
    settingsLoaded,
    profileImage,
    selectedPaletteKey,
    isDarkMode,
    fontSizeScale,
    notificationsEnabled,
    hapticFeedback,
    soundEffects,
    unitMetric,
    autoConnectBluetooth,
  ]);

  // CÁLCULO DINÁMICO DE COLORES Y ESTILOS GLOBALES
  const activePalette = THEME_PALETTES[selectedPaletteKey] || THEME_PALETTES.emerald;

  const theme = {
    isDarkMode,
    bg: isDarkMode ? '#121E13' : activePalette.lightBg,
    cardBg: isDarkMode ? '#1B2E1D' : activePalette.cardBg,
    primary: activePalette.primary,
    darkGreen: activePalette.darkGreen,
    accent: activePalette.accent,
    textPrimary: isDarkMode ? '#E8F5E9' : '#0F3818',
    textSecondary: isDarkMode ? '#A5D6A7' : '#555555',
    border: isDarkMode ? '#2E4C30' : '#E0E0E0',
    // ESCALA DE TEXTO DINÁMICA
    fontSizes: {
      small: fontSizeScale === 'small' ? 11 : fontSizeScale === 'large' ? 14 : 12,
      body: fontSizeScale === 'small' ? 12 : fontSizeScale === 'large' ? 16 : 14,
      title: fontSizeScale === 'small' ? 16 : fontSizeScale === 'large' ? 20 : 18,
    },
  };

  const value = {
    profileImage,
    setProfileImage,
    userName,
    setUserName: updateUserName,
    userRole,
    setUserRole,
    selectedPaletteKey,
    setSelectedPaletteKey: applyPalette,
    isDarkMode,
    setIsDarkMode: applyDark,
    fontSizeScale,
    setFontSizeScale,
    notificationsEnabled,
    setNotificationsEnabled,
    hapticFeedback,
    setHapticFeedback,
    soundEffects,
    setSoundEffects,
    unitMetric,
    setUnitMetric,
    autoConnectBluetooth,
    setAutoConnectBluetooth,
    language,
    setLanguage,
    theme,
    toggleTheme: () => applyDark(!isDarkMode),
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;