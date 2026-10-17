import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { AgroLogoImage } from '../components/AgroLogoImage';
import { useNavigation } from '../navigation/NavigationContext';

/**
 * OnboardingScreen Component
 * Pantalla de bienvenida de S.I.A.R.
 * Logo centrado en la parte superior media, título "Explora nuestra APP",
 * descripción y dos botones apilados en forma de píldora (pill shape).
 */
export const OnboardingScreen = () => {
  const { navigate } = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Cabecera superior: Logo centrado en la parte superior media */}
      <View style={styles.headerArea}>
        <AgroLogoImage size={160} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Sección central */}
        <View style={styles.heroSection}>
          <Text style={styles.title}>Explora nuestra APP</Text>
          <Text style={styles.description}>
            plataforma móvil que te permite la gestión completa de tus cultivos
          </Text>
        </View>

        {/* Sección inferior: botones apilados pill shape */}
        <View style={styles.buttonsSection}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.88}
            onPress={() => navigate('Login')}
          >
            <Text style={styles.primaryBtnText}>Inicio de Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.88}
            onPress={() => navigate('Register')}
          >
            <Text style={styles.secondaryBtnText}>Crear Cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerArea: {
    alignItems: 'center',
    paddingTop: 60,
    marginBottom: 20,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F3818',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 300,
  },
  buttonsSection: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 40,
  },
  primaryBtn: {
    backgroundColor: '#0F3818',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1.6,
    borderColor: '#0F3818',
  },
  secondaryBtnText: {
    color: '#0F3818',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});

export default OnboardingScreen;
