import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';
import { AppIcon } from './Icons';

/**
 * FormInput Component
 * Campo de entrada reutilizable con icono opcional y acción accessory (ej. ojo de contraseña).
 */
export const FormInput = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secure,
  keyboardType = 'default',
  accessoryIcon,
  onAccessoryPress,
  autoCapitalize = 'none',
  autoCorrect = false,
  editable = true,
  ...rest
}) => (
  <View style={styles.wrapper}>
    <View style={styles.inputRow}>
      {icon && <AppIcon name={icon} size={18} color={Colors.mintSubtitle} />}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9AB09B"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        editable={editable}
        {...rest}
      />
      {accessoryIcon && (
        <TouchableOpacity onPress={onAccessoryPress} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <AppIcon name={accessoryIcon} size={20} color={Colors.mintSubtitle} />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    borderWidth: 1.4,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    ...({}),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
});

export default FormInput;
