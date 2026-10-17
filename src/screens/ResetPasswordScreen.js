import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { Colors, Shadows } from '../constants/theme';
import { OrganicBackground } from '../components/OrganicBackground';
import { AppIcon } from '../components/Icons';
import { useNavigation } from '../navigation/NavigationContext';

/**
 * ResetPasswordScreen Component
 * Restablecimiento de contraseña S.I.A.R.
 * Cabecera minimalista con formas orgánicas verdes, código OTP de 4 dígitos
 * con temporizador (00:59) y reenvío, y restablecimiento de contraseña.
 */
export const ResetPasswordScreen = () => {
  const { goBack } = useNavigation();

  // 4-Digit OTP Boxes State
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // 59 Seconds Interactive Countdown Timer
  const [timer, setTimer] = useState(59);
  const canResend = timer <= 0;

  // New Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (timer <= 0) return undefined;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (text, index) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanText;
    setOtp(newOtp);

    // Auto-advance focus
    if (cleanText && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setTimer(59);
    setOtp(['', '', '', '']);
    inputRefs[0].current?.focus();
    Alert.alert('Código Reenviado', 'Se ha enviado un nuevo código de verificación a tu correo.');
  };

  const handleResetPassword = () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      Alert.alert('Código Incompleto', 'Por favor ingresa los 4 dígitos del código de verificación.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Contraseña Débil', 'La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      Alert.alert('Contraseña Actualizada', 'Tu contraseña ha sido restablecida exitosamente.', [
        { text: 'Iniciar Sesión', onPress: goBack },
      ]);
    }, 600);
  };

  const formattedTimer = `00:${timer < 10 ? `0${timer}` : timer}s`;

  return (
    <OrganicBackground showTop={true} showBottom={true}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

        {/* Cabecera minimalista */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={goBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Título + instrucciones */}
          <Text style={styles.title}>Restablecer contraseña</Text>
          <Text style={styles.instruction}>Enviaremos un código a su correo electrónico.</Text>
          <Text style={styles.timerText}>
            El código expira en <Text style={styles.timerHighlight}>{formattedTimer}</Text>
          </Text>

          {/* 4-Digit OTP */}
          <View style={styles.otpBoxesRow}>
            {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={[styles.otpBox, otp[index] ? styles.otpBoxFilled : null]}
                keyboardType="numeric"
                maxLength={1}
                value={otp[index]}
                onChangeText={(val) => handleOtpChange(val, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Reenvío */}
          <TouchableOpacity onPress={handleResendOtp} disabled={!canResend} activeOpacity={0.8}>
            <Text
              style={[
                styles.resendText,
                canResend && styles.resendTextActive,
              ]}
            >
              ¿No recibiste ningún código?{' '}
              <Text style={[styles.resendLink, canResend && styles.resendLinkActive]}>
                Enviar nuevamente
              </Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Nueva contraseña */}
          <Text style={styles.sectionLabel}>NUEVA CONTRASEÑA</Text>
          <View style={styles.inputWrapper}>
            <AppIcon name="lock" size={18} color="#888888" />
            <TextInput
              style={styles.textInput}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#9AB09B"
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
              <Text style={styles.showPassText}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 12 }]}>CONFIRMAR CONTRASEÑA</Text>
          <View style={styles.inputWrapper}>
            <AppIcon name="lock" size={18} color="#888888" />
            <TextInput
              style={styles.textInput}
              placeholder="Repite tu nueva contraseña"
              placeholderTextColor="#9AB09B"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Botón Restablecer */}
          <TouchableOpacity
            style={styles.submitBtn}
            activeOpacity={0.88}
            onPress={handleResetPassword}
          >
            <Text style={styles.submitBtnText}>
              {isSuccess ? 'Actualizando…' : 'Restablecer'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 60 }} />
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
  },
  backBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  instruction: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 8,
    lineHeight: 19,
  },
  timerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  timerHighlight: {
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  otpBox: {
    width: 62,
    height: 62,
    borderRadius: 14,
    borderWidth: 1.4,
    borderColor: '#E0E0E0',
    backgroundColor: '#F2F4F2',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  otpBoxFilled: {
    borderColor: Colors.brightGreen,
    backgroundColor: '#FFFFFF',
  },
  resendText: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  resendTextActive: {
    color: Colors.primaryDark,
  },
  resendLink: {
    fontWeight: '700',
    color: Colors.warningOrange,
  },
  resendLinkActive: {
    color: Colors.leafGreen,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 22,
  },
  sectionLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F4F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 14,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    paddingVertical: 14,
  },
  showPassText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.leafGreen,
  },
  submitBtn: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    ...Shadows.medium,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});

export default ResetPasswordScreen;
