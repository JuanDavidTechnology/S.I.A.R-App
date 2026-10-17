import React, { useState, useEffect } from 'react';
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

/**
 * RegisterScreen Component
 * Pantalla de Registro / Crear Cuenta S.I.A.R.
 * Cabecera curva verde, formulario de registro, checkbox de términos y
 * modal de confirmación "Registro Completado" que redirige al Dashboard.
 */
export const RegisterScreen = () => {
  const { goBack, canGoBack, navigate } = useNavigation();
  const { register } = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Contraseña débil', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (!accepted) {
      Alert.alert('Términos y Condiciones', 'Debes aceptar los Términos y Condiciones y la Política de Privacidad.');
      return;
    }
    setProcessing(true);
    try {
      await register(name.trim(), email.trim(), password);
      setProcessing(false);
      setSuccessVisible(true);
    } catch (error) {
      setProcessing(false);
      Alert.alert(
        'Error de registro',
        error.message || 'No se pudo crear la cuenta. Inténtalo nuevamente.'
      );
    }
  };

  // Redirige automáticamente al Dashboard (~2s) cuando se muestra el modal
  const finishSuccess = () => {
    setSuccessVisible(false);
    navigate('Home');
  };

  useEffect(() => {
    if (!successVisible) return undefined;
    const timer = setTimeout(finishSuccess, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successVisible]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera curva verde */}
        <AuthHeader
          onBack={canGoBack ? goBack : undefined}
          canBack={canGoBack}
          logoSize={118}
        />

        {/* Formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Registrar</Text>

          {/* Campo 1: Nombre de Usuario */}
          <Text style={styles.label}>Nombre de Usuario</Text>
          <View style={styles.fieldBox}>
            <RightIconInput
              placeholder="Roberto01"
              value={name}
              onChangeText={setName}
              iconName="user"
            />
          </View>

          {/* Campo 2: Email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.fieldBox}>
            <RightIconInput
              placeholder="hola.saberp@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              iconName="mail"
            />
          </View>

          {/* Campo 3: Contraseña */}
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.fieldBox}>
            <RightIconInput
              placeholder="••••••••••••"
              value={password}
              onChangeText={setPassword}
              secure={!showPassword}
              iconName={showPassword ? 'lock' : 'lock'}
              onToggleVisibility={() => setShowPassword(!showPassword)}
              showPassword={showPassword}
            />
          </View>

          {/* Checkbox de términos */}
          <TouchableOpacity
            style={styles.termsRow}
            activeOpacity={0.8}
            onPress={() => setAccepted(!accepted)}
          >
            <View style={[styles.checkboxBox, accepted && styles.checkboxBoxActive]}>
              {accepted && <AppIcon name="check" size={13} color="#FFFFFF" />}
            </View>
            <Text style={styles.termsText}>
              Acepto los Términos y Condiciones y Política de Privacidad
            </Text>
          </TouchableOpacity>

          {/* Botón Registrar */}
          <TouchableOpacity
            style={[styles.primaryBtn, processing && { opacity: 0.7 }]}
            activeOpacity={0.88}
            onPress={handleRegister}
          >
            <Text style={styles.primaryBtnText}>
              {processing ? 'Registrando…' : 'Registrar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal de éxito: Registro Completado */}
      <Modal visible={successVisible} transparent animationType="fade" onRequestClose={finishSuccess}>
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successCheckCircle}>
              <AppIcon name="check" size={30} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Registro Completado</Text>
            <Text style={styles.successText}>
              Tu cuenta S.I.A.R. ha sido creada exitosamente. Te redirigimos a la plataforma.
            </Text>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const RightIconInput = ({
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
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#9AB09B"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secure}
      keyboardType={keyboardType}
      autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
      autoCorrect={false}
    />
    {onToggleVisibility ? (
      <TouchableOpacity
        onPress={onToggleVisibility}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <AppIcon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888888" />
      </TouchableOpacity>
    ) : (
      <AppIcon name={iconName} size={19} color="#888888" />
    )}
  </View>
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
    fontSize: 23,
    fontWeight: '800',
    color: '#0F3818',
    textAlign: 'center',
    marginBottom: 22,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },
  fieldBox: {
    backgroundColor: '#F0F3F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 14,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
    marginBottom: 22,
    gap: 10,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#888888',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxBoxActive: {
    backgroundColor: '#0F3818',
    borderColor: '#0F3818',
  },
  termsText: {
    flex: 1,
    fontSize: 12.5,
    color: '#333333',
    fontWeight: '500',
    lineHeight: 18,
  },
  primaryBtn: {
    backgroundColor: '#0F3818',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    ...Shadows.strong,
  },
  successCheckCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F3818',
    textAlign: 'center',
  },
  successText: {
    fontSize: 13,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
  },
});

export default RegisterScreen;
