import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Colors, Shadows } from '../constants/theme';
import { SIARLogo } from '../components/SIARLogo';
import { AppIcon, IconBadge } from '../components/Icons';
import { useNavigation } from '../navigation/NavigationContext';

/**
 * TermsScreen Component
 * Términos, Políticas y Marco de Seguridad Robótica Agrícola S.I.A.R.
 */
export const TermsScreen = () => {
  const { goBack } = useNavigation();
  const [accepted, setAccepted] = useState(true);

  const handleAcceptAndContinue = () => {
    if (!accepted) {
      Alert.alert('Aviso', 'Debes marcar la casilla para aceptar los términos.');
      return;
    }
    Alert.alert('Términos Aceptados', 'Has confirmado las políticas de S.I.A.R.', [
      { text: 'Aceptar', onPress: goBack },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Top Curved Dark Green Header */}
      <View style={styles.curvedHeader}>
        <SafeAreaView>
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={goBack}
              activeOpacity={0.8}
            >
              <IconBadge size={36} bg="rgba(255, 255, 255, 0.15)">
                <AppIcon name="arrow-left" size={16} color="#FFFFFF" />
              </IconBadge>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Términos y Políticas</Text>
            <View style={{ width: 36 }} />
          </View>

          <View style={styles.headerHeroTextContainer}>
            <Text style={styles.heroTitle}>Marco Operativo y Legal</Text>
            <Text style={styles.heroSubtitle}>
              Protocolos de seguridad robótica, privacidad de datos agrícolas y telemetría
            </Text>
          </View>
        </SafeAreaView>
      </View>

      {/* Main Content Area with S.I.A.R. Watermark */}
      <View style={styles.contentContainer}>
        {/* Subtle Brand Watermark */}
        <View style={styles.watermarkContainer} pointerEvents="none">
          <SIARLogo size="large" showSubtitle={false} style={{ opacity: 0.06, transform: [{ scale: 2.2 }] }} />
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Section 1: Seguridad Operativa */}
          <View style={styles.policyCard}>
            <View style={styles.policyCardHeader}>
              <IconBadge size={28} bg={Colors.mintLight}>
                <Text style={styles.policyNumber}>1</Text>
              </IconBadge>
              <Text style={styles.policyTitle}>Seguridad Operativa en Campo</Text>
            </View>
            <Text style={styles.policyText}>
              El operador debe mantener siempre línea visual con los robots autónomos durante maniobras de control manual. Las paradas de emergencia deben activarse inmediatamente ante cualquier detección de personas o animales en los surcos.
            </Text>
          </View>

          {/* Section 2: Propiedad y Confidencialidad Agronómica */}
          <View style={styles.policyCard}>
            <View style={styles.policyCardHeader}>
              <IconBadge size={28} bg={Colors.mintLight}>
                <Text style={styles.policyNumber}>2</Text>
              </IconBadge>
              <Text style={styles.policyTitle}>Propiedad de Datos Agrícolas</Text>
            </View>
            <Text style={styles.policyText}>
              Todos los mapas de maleza, índices de estrés vegetal NDVI y reportes de producción generados por la plataforma S.I.A.R. pertenecen exclusivamente al propietario de la finca y no son compartidos con terceros sin consentimiento explícito.
            </Text>
          </View>

          {/* Section 3: Uso de IA y Modelos de Detección */}
          <View style={styles.policyCard}>
            <View style={styles.policyCardHeader}>
              <IconBadge size={28} bg={Colors.mintLight}>
                <Text style={styles.policyNumber}>3</Text>
              </IconBadge>
              <Text style={styles.policyTitle}>Modelos de Detección e Inferencia IA</Text>
            </View>
            <Text style={styles.policyText}>
              Los diagnósticos automatizados provistos por el módulo de visión artificial son herramientas de soporte a la decisión agronómica. Las decisiones fitosanitarias críticas deben ser validadas por el ingeniero agrónomo responsable.
            </Text>
          </View>

          {/* Section 4: Mantenimiento y Baterías */}
          <View style={styles.policyCard}>
            <View style={styles.policyCardHeader}>
              <IconBadge size={28} bg={Colors.mintLight}>
                <Text style={styles.policyNumber}>4</Text>
              </IconBadge>
              <Text style={styles.policyTitle}>Manejo de Paquetes de Batería LiFePO4</Text>
            </View>
            <Text style={styles.policyText}>
              Queda estrictamente prohibido operar unidades robóticas con niveles de carga inferiores al 10% para preservar la integridad química de las celdas y evitar detenciones en surcos distantes.
            </Text>
          </View>

          {/* Interactive Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            activeOpacity={0.8}
            onPress={() => setAccepted(!accepted)}
          >
            <View style={[styles.checkboxBox, accepted && styles.checkboxBoxActive]}>
              {accepted && <AppIcon name="check" size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxLabel}>
              He leído y acepto los Términos de Servicio y la Política de Seguridad Robótica de S.I.A.R.
            </Text>
          </TouchableOpacity>

          {/* Bottom Accept Button */}
          <TouchableOpacity
            style={[styles.acceptBtn, !accepted && { opacity: 0.5 }]}
            activeOpacity={0.88}
            onPress={handleAcceptAndContinue}
          >
            <Text style={styles.acceptBtnText}>Aceptar y Continuar</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  curvedHeader: {
    backgroundColor: Colors.primaryDark,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    ...Shadows.strong,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerHeroTextContainer: {
    marginTop: 14,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 11.5,
    color: '#C7DAC0',
    marginTop: 4,
    lineHeight: 16,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  watermarkContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
  },
  policyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.2,
    borderColor: Colors.border,
    ...Shadows.soft,
    marginBottom: 12,
  },
  policyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  policyNumber: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  policyTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: Colors.primaryDark,
    flex: 1,
  },
  policyText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: Colors.pastelGreen,
    gap: 10,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.pastelGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxBoxActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 12,
    color: Colors.primaryDark,
    fontWeight: '600',
    lineHeight: 17,
  },
  acceptBtn: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

export default TermsScreen;
