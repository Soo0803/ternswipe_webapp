import React from 'react';
import { View, Text, StyleSheet, TextInputProps as RNTextInputProps } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { isWeb } from '../utils/platform';
import { getFontSize, getPadding } from '../utils/responsive';

interface FormFieldProps extends RNTextInputProps {
  label: string;
  required?: boolean;
  error?: string;
  fullWidth?: boolean;
  containerStyle?: any;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  fullWidth = false,
  containerStyle,
  ...textInputProps
}) => {
  const fieldContainerStyle = [
    styles.fieldContainer,
    fullWidth && styles.fullWidth,
    containerStyle,
  ];

  return (
    <View style={fieldContainerStyle}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          isWeb && styles.inputWeb,
        ]}
        placeholderTextColor="#999"
        {...textInputProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: getPadding(20),
    width: isWeb ? '48%' : '100%',
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: '#333',
    marginBottom: getPadding(8),
    fontFamily: 'Inter-Regular',
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: getPadding(16),
    paddingVertical: getPadding(12),
    fontSize: getFontSize(14),
    backgroundColor: '#f9f9f9',
    fontFamily: 'Inter-Regular',
    color: '#333',
    minHeight: isWeb ? 44 : 48,
  },
  inputWeb: {
    fontSize: getFontSize(16), // Prevent zoom on iOS
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: getFontSize(12),
    marginTop: getPadding(4),
    fontFamily: 'Inter-Regular',
  },
});

