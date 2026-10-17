import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, StatusBar } from 'react-native';
import { AgroLogoImage } from '../components/AgroLogoImage';
import { useNavigation } from '../navigation/NavigationContext';

const { width } = Dimensions.get('window');

/**
 * SplashScreen Component
 * Pantalla de espera / carga de S.I.A.R.
 * Fondo blanco, logo protagonista (~45% ancho) y redirección automática a Bienvenida.
 */
export const SplashScreen = () => {
  const { reset } = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      reset('Onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, [reset]);

  const logoSize = width * 0.45;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Elemento central: Logo S.I.A.R. (45% del ancho) */}
      <View style={styles.center}>
        <AgroLogoImage size={logoSize} />
      </View>

      {/* Bloque inferior: subtítulo + ActivityIndicator verde */}
      <View style={styles.bottomBlock}>
        <Text style={styles.subtitle}>Sistema de Información Agrícola con Robótica</Text>
        <ActivityIndicator size="small" color="#0F3818" style={{ marginTop: 18 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  bottomBlock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '400',
    letterSpacing: 0.3,
  },
});

export default SplashScreen;
