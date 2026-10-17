import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Colors, Shadows } from '../constants/theme';
import { AppIcon, IconBadge } from '../components/Icons';
import { useNavigation } from '../navigation/NavigationContext';

/**
 * ContactScreen Component
 * Módulo de contacto: WhatsApp, Google, Facebook y correo de S.I.A.R.
 */
export const ContactScreen = () => {
  const { goBack } = useNavigation();

  const openLink = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }
        Alert.alert('No disponible', 'La aplicación no está disponible en este dispositivo.');
        return null;
      })
      .catch(() => Alert.alert('Error', 'No se pudo abrir el enlace.'));
  };

  const whatsapp = () => openLink('https://wa.me/573001234567');
  const email = () => openLink('mailto:soporte@siar-agro.com');
  const facebook = () => openLink('https://www.facebook.com/siaragro');
  const google = () => openLink('https://mail.google.com/mail/?view=cm&fs=1&to=soporte@siar-agro.com');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Curved Green Header */}
      <View style={styles.curvedHeader}>
        <SafeAreaView>
          <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.backBtn} onPress={goBack} activeOpacity={0.8}>
              <IconBadge size={36} bg="rgba(255, 255, 255, 0.15)">
                <AppIcon name="arrow-left" size={16} color="#FFFFFF" />
              </IconBadge>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Contáctanos</Text>
            <View style={{ width: 36 }} />
          </View>
          <Text style={styles.headerSubtitle}>
            Estamos aquí para ayudarte con tu campo y tus dispositivos
          </Text>
        </SafeAreaView>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* WhatsApp card */}
        <TouchableOpacity style={styles.channelCard} activeOpacity={0.85} onPress={whatsapp}>
          <View style={[styles.channelIcon, { backgroundColor: '#E6F9EE' }]}>
            <AppIcon name="whatsapp" size={24} color="#25D366" />
          </View>
          <View style={styles.channelInfo}>
            <Text style={styles.channelTitle}>WhatsApp</Text>
            <Text style={styles.channelDesc}>Atención inmediata en chat</Text>
          </View>
          <AppIcon name="chevron-right" size={18} color={Colors.mintSubtitle} />
        </TouchableOpacity>

        {/* Email card */}
        <TouchableOpacity style={styles.channelCard} activeOpacity={0.85} onPress={email}>
          <View style={[styles.channelIcon, { backgroundColor: '#E4EDF7' }]}>
            <AppIcon name="mail" size={24} color="#1877F2" />
          </View>
          <View style={styles.channelInfo}>
            <Text style={styles.channelTitle}>Correo Electrónico</Text>
            <Text style={styles.channelDesc}>soporte@siar-agro.com</Text>
          </View>
          <AppIcon name="chevron-right" size={18} color={Colors.mintSubtitle} />
        </TouchableOpacity>

        {/* Google card */}
        <TouchableOpacity style={styles.channelCard} activeOpacity={0.85} onPress={google}>
          <View style={[styles.channelIcon, { backgroundColor: '#FDEBEB' }]}>
            <AppIcon name="google" size={24} color="#DB4437" />
          </View>
          <View style={styles.channelInfo}>
            <Text style={styles.channelTitle}>Google</Text>
            <Text style={styles.channelDesc}>Contacto a través de Gmail</Text>
          </View>
          <AppIcon name="chevron-right" size={18} color={Colors.mintSubtitle} />
        </TouchableOpacity>

        {/* Facebook card */}
        <TouchableOpacity style={styles.channelCard} activeOpacity={0.85} onPress={facebook}>
          <View style={[styles.channelIcon, { backgroundColor: '#E4EDF7' }]}>
            <AppIcon name="facebook" size={24} color="#1877F2" />
          </View>
          <View style={styles.channelInfo}>
            <Text style={styles.channelTitle}>Facebook</Text>
            <Text style={styles.channelDesc}>Síguenos y mándanos mensaje</Text>
          </View>
          <AppIcon name="chevron-right" size={18} color={Colors.mintSubtitle} />
        </TouchableOpacity>

        {/* Info card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <IconBadge size={32} bg={Colors.mintLight}>
              <AppIcon name="phone" size={16} color={Colors.primaryDark} />
            </IconBadge>
            <Text style={styles.infoTitle}>Atención al cliente</Text>
          </View>
          <Text style={styles.infoRow}>Horario: Lunes a Sábado, 7:00 am - 6:00 pm</Text>
          <Text style={styles.infoRow}>Línea directa: +57 300 123 4567</Text>
          <Text style={styles.infoRow}>Correo: soporte@siar-agro.com</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
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
    paddingBottom: 26,
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
  headerSubtitle: {
    color: '#C7DAC0',
    fontSize: 12,
    marginTop: 14,
    lineHeight: 17,
    fontWeight: '600',
    maxWidth: 300,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingTop: 22,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
    ...Shadows.soft,
  },
  channelIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelInfo: {
    flex: 1,
  },
  channelTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  channelDesc: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.pastelGreen,
    ...Shadows.soft,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  infoRow: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default ContactScreen;
