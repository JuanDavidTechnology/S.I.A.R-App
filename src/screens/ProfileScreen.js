import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Shadows } from '../constants/theme';
import { OrganicBackground } from '../components/OrganicBackground';
import { AppIcon, IconBadge } from '../components/Icons';
import { useNavigation } from '../navigation/NavigationContext';
import { useUser } from '../constants/UserContext';
import { useSettings } from '../constants/SettingsContext';

/**
 * ProfileScreen Component
 * Perfil de usuario agrónomo con avatar circular y edición de datos
 */
export const ProfileScreen = () => {
  const { goBack, navigate } = useNavigation();
  const {
    userName,
    updateUserName,
    userEmail,
    setUserEmail,
    userRole,
    setUserRole,
    farmZone,
    setFarmZone,
  } = useUser();
  const { profileImage, setProfileImage } = useSettings();

  // Profile Form States
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [role] = useState(userRole);
  const [joinDate, setJoinDate] = useState('12 de Marzo, 2024');
  const [phone, setPhone] = useState('+57 312 456 7890');
  const [farmLocation, setFarmLocation] = useState(farmZone);

  // Edit active field states
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateUserName(name);
    setUserEmail(email);
    setUserRole(role);
    setFarmZone(farmLocation);

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      Alert.alert('Perfil Actualizado', 'Los cambios se han guardado exitosamente en toda la aplicación.');
    }, 600);
  };

  const getInitials = (n) => {
    if (!n) return 'RM';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const pickProfileImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permiso Necesario',
          'Para cambiar la foto de perfil se requiere acceso a la galería de fotos.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
        Alert.alert('Foto Actualizada', 'La foto de perfil cambió en toda la aplicación.');
      }
    } catch (_error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  return (
    <OrganicBackground showTop={true} showBottom={true}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={goBack}
            activeOpacity={0.8}
          >
            <IconBadge size={36} bg={Colors.mintLight}>
              <AppIcon name="arrow-left" size={16} color={Colors.primaryDark} />
            </IconBadge>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <TouchableOpacity
            style={styles.resetPassHeaderBtn}
            onPress={() => navigate('ResetPassword')}
          >
            <IconBadge size={36} bg={Colors.mintLight}>
              <AppIcon name="lock" size={16} color={Colors.primaryDark} />
            </IconBadge>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section with Floating Camera Button */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {/* Outer Pastel Ring */}
              <View style={styles.avatarOuterRing}>
                {/* Inner Avatar Graphic */}
                <View style={styles.avatarCircle}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
                  )}
                </View>
              </View>

              {/* Floating Camera Button */}
              <TouchableOpacity
                style={styles.cameraFloatingBtn}
                activeOpacity={0.85}
                onPress={pickProfileImage}
              >
                <AppIcon name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.profileName}>{name}</Text>
            <View style={styles.roleBadge}>
              <View style={styles.roleDot} />
              <Text style={styles.roleText}>{role}</Text>
            </View>
          </View>

          {/* Quick Agronomy Stats Row */}
          <View style={styles.statsCard}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>48</Text>
              <Text style={styles.statLabel}>Reportes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: Colors.leafGreen }]}>120h</Text>
              <Text style={styles.statLabel}>Operación</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: Colors.primaryDark }]}>350 ha</Text>
              <Text style={styles.statLabel}>Monitoreo</Text>
            </View>
          </View>

          {/* Form Fields with Rounded Corners and Edit Icons */}
          <View style={styles.formSection}>
            <Text style={styles.sectionHeaderTitle}>Información Personal</Text>

            {/* Field: Nombre de Usuario */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Nombre Completo / Apelativo</Text>
              <View style={styles.inputWrapper}>
                <IconBadge size={32} bg={Colors.mintLight}>
                  <AppIcon name="user" size={15} color={Colors.primaryDark} />
                </IconBadge>
                <TextInput
                  style={styles.textInputField}
                  value={name}
                  onChangeText={setName}
                  placeholder="Tu nombre completo"
                />
                <AppIcon name="edit" size={14} color={Colors.textMuted} />
              </View>
            </View>

            {/* Field: Correo Electrónico */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Correo Electrónico Corporativo</Text>
              <View style={styles.inputWrapper}>
                <IconBadge size={32} bg={Colors.mintLight}>
                  <AppIcon name="document" size={15} color={Colors.primaryDark} />
                </IconBadge>
                <TextInput
                  style={styles.textInputField}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="correo@siar-agro.com"
                />
                <AppIcon name="edit" size={14} color={Colors.textMuted} />
              </View>
            </View>

            {/* Field: Teléfono */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Teléfono de Contacto</Text>
              <View style={styles.inputWrapper}>
                <IconBadge size={32} bg={Colors.mintLight}>
                  <AppIcon name="wifi" size={15} color={Colors.primaryDark} />
                </IconBadge>
                <TextInput
                  style={styles.textInputField}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
                <AppIcon name="edit" size={14} color={Colors.textMuted} />
              </View>
            </View>

            {/* Field: Fecha de Ingreso */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Fecha de Ingreso al Sistema</Text>
              <View style={styles.inputWrapper}>
                <IconBadge size={32} bg={Colors.mintLight}>
                  <AppIcon name="bookmark" size={15} color={Colors.primaryDark} />
                </IconBadge>
                <TextInput
                  style={styles.textInputField}
                  value={joinDate}
                  onChangeText={setJoinDate}
                />
                <AppIcon name="check" size={14} color={Colors.brightGreen} />
              </View>
            </View>

            {/* Field: Ubicación de Finca */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Finca / Zona Asignada</Text>
              <View style={styles.inputWrapper}>
                <IconBadge size={32} bg={Colors.mintLight}>
                  <AppIcon name="plant" size={15} color={Colors.primaryDark} />
                </IconBadge>
                <TextInput
                  style={styles.textInputField}
                  value={farmLocation}
                  onChangeText={setFarmLocation}
                />
                <AppIcon name="edit" size={14} color={Colors.textMuted} />
              </View>
            </View>
          </View>

          {/* Primary Bottom Dark Green Button */}
          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.88}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {isSaved ? 'Guardando...' : 'Guardar Cambios'}
            </Text>
            <AppIcon name="check" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </OrganicBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  backBtn: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primaryDark,
    letterSpacing: -0.2,
  },
  resetPassHeaderBtn: {
    padding: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 14,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarOuterRing: {
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor: Colors.pastelGreen,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  avatarCircle: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 94,
    height: 94,
    borderRadius: 47,
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.mintLight,
    letterSpacing: 1,
  },
  cameraFloatingBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.leafGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    ...Shadows.soft,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.mintLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    marginTop: 4,
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brightGreen,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.darkGreen,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.2,
    borderColor: Colors.border,
    ...Shadows.soft,
    marginVertical: 12,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  statLabel: {
    fontSize: 10.5,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 26,
    backgroundColor: Colors.border,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.2,
    borderColor: Colors.border,
    ...Shadows.soft,
    marginTop: 6,
    marginBottom: 18,
  },
  sectionHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textInputField: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginLeft: 10,
    marginRight: 6,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryDark,
    borderRadius: 16,
    paddingVertical: 15,
    gap: 8,
    ...Shadows.medium,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

export default ProfileScreen;
