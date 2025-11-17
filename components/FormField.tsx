import React from 'react';
import { View, Text, StyleSheet, TextInputProps as RNTextInputProps } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { isWeb } from '../utils/platform';
import { getFontSize, getPadding } from '../utils/responsive';
import { palette, radii } from '../constants/theme';

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
  const { style: inputStyleProp, multiline, ...restInputProps } = textInputProps as any;

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
          multiline && styles.inputMultiline,
          error && styles.inputError,
          isWeb && styles.inputWeb,
          inputStyleProp,
        ]}
        multiline={multiline}
        placeholderTextColor={palette.textSubtle}
        {...restInputProps}
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
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: palette.text,
    marginBottom: getPadding(10),
    fontFamily: 'Inter-Regular',
  },
  required: {
    color: palette.danger,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radii.md,
    paddingHorizontal: getPadding(18),
    paddingVertical: getPadding(14),
    fontSize: getFontSize(16),
    backgroundColor: palette.surfaceMuted,
    fontFamily: 'Inter-Regular',
    color: palette.text,
    minHeight: isWeb ? 52 : 56,
  },
  inputMultiline: {
    minHeight: 120,
    paddingTop: getPadding(12),
    textAlignVertical: 'top',
  },
  inputWeb: {
    fontSize: getFontSize(18), // Prevent zoom on iOS
  },
  inputError: {
    borderColor: palette.danger,
    backgroundColor: palette.dangerSoft,
  },
  errorText: {
    color: palette.danger,
    fontSize: getFontSize(12),
    marginTop: getPadding(4),
    fontFamily: 'Inter-Regular',
  },
});

