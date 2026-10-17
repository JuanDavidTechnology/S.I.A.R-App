import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AgroLogoImage } from './AgroLogoImage';

/**
 * AuthHeader Component
 * Cabecera reutilizable de autenticación S.I.A.R.
 * Manta curva con degradado verde (#0F3818 -> #2E7D32), botón de retorno blanco
 * a la izquierda y logo S.I.A.R. centrado en el área curva.
 */
export const AuthHeader = ({
  height = 300,
  onBack,
  canBack = true,
  title,
  showLogo = true,
  logoSize = 120,
  children,
}) => (
  <LinearGradient
    colors={['#0F3818', '#2E7D32']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.header, { height }, headerShadow]}
  >
    <SafeAreaView>
      <View style={styles.topRow}>
        {canBack ? (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 32 }} />
        )}
        {title ? <Text style={styles.title}>{title}</Text> : <View style={{ width: 32 }} />}
        <View style={{ width: 32 }} />
      </View>

      {showLogo && (
        <View style={styles.logoWrap}>
          <AgroLogoImage size={logoSize} onDark />
        </View>
      )}

      {children}
    </SafeAreaView>
  </LinearGradient>
);

const headerShadow = {
  shadowColor: '#0F3818',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.16,
  shadowRadius: 14,
  elevation: 8,
};

const styles = StyleSheet.create({
  header: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  logoWrap: {
    alignItems: 'center',
    marginTop: 12,
  },
});

export default AuthHeader;
