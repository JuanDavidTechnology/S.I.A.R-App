import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { Colors, Shadows } from '../constants/theme';
import { AppIcon } from '../components/Icons';
import { AuthHeader } from '../components/AuthHeader';
import { useNavigation } from '../navigation/NavigationContext';
import { useUser } from '../constants/UserContext';
import { useSettings } from '../constants/SettingsContext';

/**
 * LoginScreen Component
 * Pantalla de inicio de sesión S.I.A.R.
 * Cabecera curva con degradado verde (#0F3818 -> #2E7D32) con logo centrado,
 * formulario (email + contraseña), acceso social (Google/Facebook/Apple) y registro.
 */
export const LoginScreen = () => {
  const { goBack, canGoBack, navigate, reset } = useNavigation();
  const { login } = useUser();
  const { theme } = useSettings();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  // Validar formato de correo electrónico en tiempo real
  const validateEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (text.trim() === '') {
      setEmailError('El correo electrónico es obligatorio.');
    } else if (!emailRegex.test(text.trim())) {
      setEmailError('Ingresa un correo electrónico válido (ej. usuario@dominio.com).');
    } else {
      setEmailError('');
    }
  };

  // Calcular fortaleza de contraseña (0 a 4) según longitud, caja, números y símbolos
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '#CCCCCC' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score: 1, label: 'Débil', color: '#E53935' };
      case 2:
        return { score: 2, label: 'Media', color: '#FB8C00' };
      case 3:
      case 4:
        return { score: 3, label: 'Fuerte', color: theme.primary || '#2E7D32' };
      default:
        return { score: 0, label: 'Muy Débil', color: '#E53935' };
    }
  };

  const passwordStrength = getPasswordStrength(password);

  const handleLogin = async () => {
    if (emailError) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña.');
      return;
    }
    setProcessing(true);
    try {
      await login(email.trim(), password);
      setProcessing(false);
      setSuccessVisible(true);
    } catch (error) {
      setProcessing(false);
      Alert.alert(
        'Error de autenticación',
        error.message || 'No se pudo iniciar sesión. Verifica tus credenciales.'
      );
    }
  };

  const closeSuccess = () => {
    setSuccessVisible(false);
    reset('Home');
  };

  // Login social (listos para conectar el SDK de autenticación en producción)
  const onGoogleLogin = () => {
    Alert.alert('Google Auth', 'Iniciando sesión con Google...');
  };

  const onFacebookLogin = () => {
    Alert.alert('Facebook Auth', 'Iniciando sesión con Facebook...');
  };

  const handleSocial = (network) => {
    Alert.alert(
      `${network}`,
      `Iniciar sesión con ${network} estará disponible próximamente.`,
      [{ text: 'Entendido' }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0F3818" />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera curva con degradado verde (reutilizable) */}
        <AuthHeader
          onBack={canGoBack ? goBack : undefined}
          canBack={canGoBack}
          logoSize={120}
        />

        {/* Formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Inicio de Sesión</Text>

          {/* Campo Email */}
          <Text style={styles.label}>Email</Text>
          <View style={[styles.fieldBox, emailError && styles.fieldBoxError]}>
            <TextInputField
              placeholder="hola.saberp@gmail.com"
              value={email}
              onChangeText={validateEmail}
              keyboardType="email-address"
              iconName="mail"
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {/* Campo Contraseña */}
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.fieldBox}>
            <TextInputField
              placeholder="••••••••••••"
              value={password}
              onChangeText={setPassword}
              secure={!showPassword}
              iconName="lock"
              onToggleVisibility={() => setShowPassword(!showPassword)}
              showPassword={showPassword}
            />
          </View>

          {/* Medidor de seguridad de contraseña */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View
                style={[
                  styles.strengthBarBackground,
                  { backgroundColor: theme.isDarkMode ? '#2E4C30' : '#E0E0E0' },
                ]}
              >
                <View
                  style={[
                    styles.strengthBarFill,
                    {
                      width: `${(passwordStrength.score / 3) * 100}%`,
                      backgroundColor: passwordStrength.color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                Seguridad: {passwordStrength.label}
              </Text>
            </View>
          )}

          {/* Enlace Restablecer */}
          <TouchableOpacity
            style={styles.forgotRow}
            activeOpacity={0.7}
            onPress={() => navigate('ResetPassword')}
          >
            <Text style={styles.forgotText}>
              ¿Olvidaste tu contraseña? <Text style={styles.forgotLink}>Restablecer</Text>
            </Text>
          </TouchableOpacity>

          {/* Botón principal */}
          <TouchableOpacity
            style={[styles.primaryBtn, processing && { opacity: 0.7 }]}
            activeOpacity={0.88}
            onPress={handleLogin}
          >
            <Text style={styles.primaryBtnText}>
              {processing ? 'Iniciando…' : 'Iniciar Sesión'}
            </Text>
          </TouchableOpacity>

          {/* Social login */}
          <Text style={styles.dividerText}>O iniciar con</Text>
          <View style={styles.socialRow}>
            <SocialCircle icon="facebook" onPress={onFacebookLogin} />
            <SocialCircle icon="google" onPress={onGoogleLogin} />
            <SocialCircle icon="apple" onPress={() => handleSocial('Apple')} />
          </View>

          {/* Registro */}
          <TouchableOpacity
            style={styles.registerRow}
            activeOpacity={0.7}
            onPress={() => navigate('Register')}
          >
            <Text style={styles.registerPlain}>¿No tienes una cuenta? </Text>
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de éxito */}
      <Modal visible={successVisible} transparent animationType="fade" onRequestClose={closeSuccess}>
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successCheckCircle}>
              <AppIcon name="check" size={30} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>¡Sesión Iniciada!</Text>
            <Text style={styles.successText}>
              Bienvenido de nuevo a la plataforma S.I.A.R. Prepárate para monitorear tu campo.
            </Text>
            <TouchableOpacity style={styles.successBtn} activeOpacity={0.88} onPress={closeSuccess}>
              <Text style={styles.successBtnText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const shadowsStyle = {
  shadowColor: '#0F3818',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.16,
  shadowRadius: 14,
  elevation: 8,
};

const TextInputField = ({
  placeholder,
  value,
  onChangeText,
  secure = false,
  keyboardType = 'default',
  iconName,
  onToggleVisibility,
  showPassword,
}) => (
  <View style={styles.inputRow}>
    <AppIcon name={iconName} size={19} color="#2E7D32" />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#9AB09B"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secure}
      keyboardType={keyboardType}
      autoCapitalize="none"
      autoCorrect={false}
    />
    {onToggleVisibility && (
      <TouchableOpacity
        onPress={onToggleVisibility}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <AppIcon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#7A9E7F" />
      </TouchableOpacity>
    )}
  </View>
);

const SocialCircle = ({ icon, onPress }) => (
  <TouchableOpacity style={[styles.socialCircle, shadowsStyle]} onPress={onPress} activeOpacity={0.8}>
    <AppIcon name={icon} size={26} color={icon === 'google' ? '#DB4437' : icon === 'facebook' ? '#FFFFFF' : '#0F3818'} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 22,
    paddingTop: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F3818',
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 6,
  },
  fieldBox: {
    backgroundColor: '#F0F3F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 14,
  },
  fieldBoxError: {
    borderColor: '#E53935',
  },
  errorText: {
    color: '#E53935',
    fontSize: 11,
    fontWeight: '500',
    marginTop: -8,
    marginBottom: 10,
  },
  strengthContainer: {
    marginTop: -2,
    marginBottom: 14,
  },
  strengthBarBackground: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  forgotText: {
    fontSize: 12.5,
    color: '#2E7D32',
    fontWeight: '500',
  },
  forgotLink: {
    color: '#2E7D32',
    fontWeight: '700',
  },
  primaryBtn: {
    backgroundColor: '#0F3818',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowsStyle,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  dividerText: {
    textAlign: 'center',
    fontSize: 12.5,
    color: '#8E8E8E',
    fontWeight: '500',
    marginTop: 24,
    marginBottom: 16,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 22,
  },
  socialCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 26,
  },
  registerPlain: {
    fontSize: 13,
    color: '#555555',
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 30, 15, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    width: '100%',
    ...Shadows.strong,
  },
  successCheckCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Colors.brightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  successText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
  },
  successBtn: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 18,
    width: '100%',
    ...Shadows.medium,
  },
  successBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default LoginScreen;
