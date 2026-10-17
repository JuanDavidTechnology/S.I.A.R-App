import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Shadows, Colors } from '../constants/theme';
import { OrganicBackground } from '../components/OrganicBackground';
import { useNavigation } from '../navigation/NavigationContext';
import { useNotifications } from '../constants/NotificationContext';
import { useSettings, THEME_PALETTES } from '../constants/SettingsContext';

/**
 * SettingsScreen Component
 * Módulo de Ajustes global y dinámico de S.I.A.R.
 * Conecta toda la app a SettingsContext: paletas, modo oscuro, tipografía,
 * notificaciones, háptico/sonido, unidades, Bluetooth y foto de perfil.
 */
export const SettingsScreen = () => {
  const { goBack, navigate, reset } = useNavigation();
  const { addNotification } = useNotifications();

  const {
    profileImage,
    setProfileImage,
    userName,
    userRole,
    selectedPaletteKey,
    setSelectedPaletteKey,
    isDarkMode,
    setIsDarkMode,
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
    theme,
  } = useSettings();

  // Modal de confirmación de Cerrar Sesión
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  /** SELECCIONAR FOTO DE PERFIL NATIVA (galería) */
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Permiso Requerido',
          'Se requiere acceso a la galería para cambiar la foto de perfil.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setProfileImage(uri);
        addNotification(
          'Foto de Perfil Actualizada',
          'La foto de perfil se aplicó en toda la aplicación.',
          'success'
        );
      }
    } catch (_error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  const handleNotificationsToggle = (value) => {
    setNotificationsEnabled(value);
    if (value) {
      addNotification(
        'Notificaciones Activadas',
        'El sistema S.I.A.R. volverá a notificarte los eventos importantes.',
        'info'
      );
    }
  };

  const handleLogout = () => {
    setLogoutModalVisible(false);
    Alert.alert('Sesión Cerrada', 'Has salido de la cuenta correctamente.', [
      { text: 'OK', onPress: () => reset('Login') },
    ]);
  };

  return (
    <OrganicBackground showTop={true} showBottom={true}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.bg}
        />

        <ScrollView
          style={[styles.container, { backgroundColor: theme.bg }]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* ENCABEZADO */}
          <View style={[styles.header, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <TouchableOpacity
              onPress={goBack}
              style={[styles.backBtn, { backgroundColor: theme.bg }]}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="chevron-left" size={22} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.textPrimary, fontSize: theme.fontSizes.title }]}>
              Ajustes & Personalización
            </Text>
          </View>

          {/* TARJETA DE PERFIL Y AVATAR */}
          <View style={[styles.profileCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarContainer} activeOpacity={0.85}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.bg }]}>
                  <MaterialCommunityIcons name="account" size={44} color={theme.primary} />
                </View>
              )}
              <View style={[styles.cameraBadge, { backgroundColor: theme.primary }]}>
                <MaterialCommunityIcons name="camera" size={14} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={[styles.userName, { color: theme.textPrimary, fontSize: theme.fontSizes.body + 2 }]}>
              {userName}
            </Text>
            <Text style={[styles.userRole, { color: theme.textSecondary, fontSize: theme.fontSizes.small }]}>
              {userRole}
            </Text>
          </View>

          {/* SECCIÓN 1: APARIENCIA Y TEMAS */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.primary, fontSize: theme.fontSizes.small }]}>
              APARIENCIA Y TEMA VISUAL
            </Text>

            {/* MODO OSCURO */}
            <View style={[styles.row, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <View style={styles.rowLeft}>
                <MaterialCommunityIcons name="weather-night" size={22} color={theme.primary} />
                <Text style={[styles.rowLabel, { color: theme.textPrimary, fontSize: theme.fontSizes.body }]}>
                  Modo Oscuro Agrícola
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: '#D0D0D0', true: theme.accent }}
                thumbColor={isDarkMode ? theme.primary : '#F4F3F4'}
              />
            </View>

            {/* PALETAS DE COLOR */}
            <View style={[styles.cardBlock, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <Text
                style={[
                  styles.rowLabel,
                  { color: theme.textPrimary, fontSize: theme.fontSizes.body, marginBottom: 10 },
                ]}
              >
                Paleta de Colores
              </Text>
              <View style={styles.paletteContainer}>
                {Object.keys(THEME_PALETTES).map((key) => {
                  const palette = THEME_PALETTES[key];
                  const isSelected = selectedPaletteKey === key;
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => setSelectedPaletteKey(key)}
                      style={[
                        styles.paletteOption,
                        { borderColor: isSelected ? theme.primary : 'transparent', borderWidth: 2 },
                      ]}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.colorCircle, { backgroundColor: palette.primary }]} />
                      <Text
                        style={[
                          styles.paletteName,
                          { color: theme.textPrimary, fontSize: theme.fontSizes.small },
                        ]}
                      >
                        {palette.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* TAMAÑO DE TEXTO */}
            <View style={[styles.cardBlock, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <Text
                style={[
                  styles.rowLabel,
                  { color: theme.textPrimary, fontSize: theme.fontSizes.body, marginBottom: 10 },
                ]}
              >
                Tamaño de Fuente
              </Text>
              <View style={styles.segmentedControl}>
                {['small', 'medium', 'large'].map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setFontSizeScale(size)}
                    style={[styles.segmentBtn, fontSizeScale === size && { backgroundColor: theme.primary }]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[styles.segmentText, { color: fontSizeScale === size ? '#FFFFFF' : theme.textPrimary }]}
                    >
                      {size === 'small' ? 'Pequeño' : size === 'large' ? 'Grande' : 'Normal'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* SECCIÓN 2: CONTROL Y SISTEMA */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.primary, fontSize: theme.fontSizes.small }]}>
              PREFERENCIAS DE SISTEMA
            </Text>

            <View style={[styles.row, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <View style={styles.rowLeft}>
                <MaterialCommunityIcons name="bell-outline" size={22} color={theme.primary} />
                <Text style={[styles.rowLabel, { color: theme.textPrimary, fontSize: theme.fontSizes.body }]}>
                  Notificaciones Activas
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                trackColor={{ false: '#D0D0D0', true: theme.accent }}
                thumbColor={notificationsEnabled ? theme.primary : '#F4F3F4'}
              />
            </View>

            <View style={[styles.row, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <View style={styles.rowLeft}>
                <MaterialCommunityIcons name="bluetooth-connect" size={22} color={theme.primary} />
                <Text style={[styles.rowLabel, { color: theme.textPrimary, fontSize: theme.fontSizes.body }]}>
                  Autoconectar Bluetooth
                </Text>
              </View>
              <Switch
                value={autoConnectBluetooth}
                onValueChange={setAutoConnectBluetooth}
                trackColor={{ false: '#D0D0D0', true: theme.accent }}
                thumbColor={autoConnectBluetooth ? theme.primary : '#F4F3F4'}
              />
            </View>

            <View style={[styles.row, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <View style={styles.rowLeft}>
                <MaterialCommunityIcons name="speedometer" size={22} color={theme.primary} />
                <Text style={[styles.rowLabel, { color: theme.textPrimary, fontSize: theme.fontSizes.body }]}>
                  Unidades Métricas (°C / km/h)
                </Text>
              </View>
              <Switch
                value={unitMetric}
                onValueChange={setUnitMetric}
                trackColor={{ false: '#D0D0D0', true: theme.accent }}
                thumbColor={unitMetric ? theme.primary : '#F4F3F4'}
              />
            </View>

            <View style={[styles.row, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <View style={styles.rowLeft}>
                <MaterialCommunityIcons name="vibrate" size={22} color={theme.primary} />
                <Text style={[styles.rowLabel, { color: theme.textPrimary, fontSize: theme.fontSizes.body }]}>
                  Vibración en Controles (Háptico)
                </Text>
              </View>
              <Switch
                value={hapticFeedback}
                onValueChange={setHapticFeedback}
                trackColor={{ false: '#D0D0D0', true: theme.accent }}
                thumbColor={hapticFeedback ? theme.primary : '#F4F3F4'}
              />
            </View>

            <View style={[styles.row, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <View style={styles.rowLeft}>
                <MaterialCommunityIcons name="volume-high" size={22} color={theme.primary} />
                <Text style={[styles.rowLabel, { color: theme.textPrimary, fontSize: theme.fontSizes.body }]}>
                  Sonido de la Interfaz
                </Text>
              </View>
              <Switch
                value={soundEffects}
                onValueChange={setSoundEffects}
                trackColor={{ false: '#D0D0D0', true: theme.accent }}
                thumbColor={soundEffects ? theme.primary : '#F4F3F4'}
              />
            </View>
          </View>

          {/* SECCIÓN 3: CUENTA & LEGAL */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.primary, fontSize: theme.fontSizes.small }]}>
              CUENTA & LEGAL
            </Text>

            <TouchableOpacity
              style={[styles.row, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
              onPress={() => navigate('Profile')}
              activeOpacity={0.75}
            >
              <View style={styles.rowLeft}>
                <MaterialCommunityIcons name="account-details" size={22} color={theme.primary} />
                <Text style={[styles.rowLabel, { color: theme.textPrimary, fontSize: theme.fontSizes.body }]}>
                  Perfil de Usuario
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={theme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.row, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
              onPress={() => navigate('Terms')}
              activeOpacity={0.75}
            >
              <View style={styles.rowLeft}>
                <MaterialCommunityIcons name="file-document-outline" size={22} color={theme.primary} />
                <Text style={[styles.rowLabel, { color: theme.textPrimary, fontSize: theme.fontSizes.body }]}>
                  Términos y Políticas S.I.A.R.
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={theme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.row, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
              onPress={() => navigate('Contact')}
              activeOpacity={0.75}
            >
              <View style={styles.rowLeft}>
                <MaterialCommunityIcons name="message-text-outline" size={22} color={theme.primary} />
                <Text style={[styles.rowLabel, { color: theme.textPrimary, fontSize: theme.fontSizes.body }]}>
                  Contáctanos
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={theme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={() => setLogoutModalVisible(true)} activeOpacity={0.8}>
              <MaterialCommunityIcons name="logout" size={20} color={Colors.warningOrange} />
              <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Modal: Confirmación de Cerrar Sesión */}
        <Modal
          visible={logoutModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setLogoutModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
              <View style={[styles.logoutIconBadge, { backgroundColor: Colors.warningOrange }]}>
                <MaterialCommunityIcons name="logout" size={24} color="#FFFFFF" />
              </View>

              <Text style={[styles.logoutModalTitle, { color: theme.textPrimary, fontSize: theme.fontSizes.body + 2 }]}>
                ¿Cerrar Sesión?
              </Text>
              <Text style={[styles.logoutModalDesc, { color: theme.textSecondary, fontSize: theme.fontSizes.small }]}>
                Se desconectará la sesión actual de la consola S.I.A.R. Los robots continuarán su
                patrullaje autónomo.
              </Text>

              <View style={styles.logoutModalActions}>
                <TouchableOpacity style={styles.cancelLogoutBtn} onPress={() => setLogoutModalVisible(false)}>
                  <Text style={styles.cancelLogoutText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmLogoutBtn} onPress={handleLogout}>
                  <Text style={styles.confirmLogoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </OrganicBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  profileCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    ...Shadows.soft,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  avatarPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 6,
    borderRadius: 12,
    ...Shadows.soft,
  },
  userName: {
    fontWeight: 'bold',
  },
  userRole: {
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  rowLabel: {
    fontWeight: '600',
    flexShrink: 1,
  },
  cardBlock: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  paletteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  paletteOption: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginBottom: 4,
  },
  paletteName: {
    fontWeight: 'bold',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    padding: 2,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF2EB',
    borderRadius: 16,
    paddingVertical: 13,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FFD9C6',
  },
  logoutBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: Colors.warningOrange,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...Shadows.strong,
  },
  logoutIconBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoutModalTitle: {
    fontWeight: '900',
    marginBottom: 6,
  },
  logoutModalDesc: {
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  logoutModalActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelLogoutBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  cancelLogoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  confirmLogoutBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.warningOrange,
    alignItems: 'center',
  },
  confirmLogoutText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default SettingsScreen;