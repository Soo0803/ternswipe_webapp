import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { isWeb } from '../utils/platform';
import { getFontSize, getPadding } from '../utils/responsive';
import { palette, radii, shadows } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    style,
  ];

  // Determine text color - use custom if style has backgroundColor
  const textColor = style?.backgroundColor 
    ? getButtonTextColor(variant, style)
    : undefined;
  
  const buttonTextStyle = [
    styles.buttonText,
    styles[`${variant}Text`],
    textColor ? { color: textColor } : {},
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? palette.textOnPrimary : palette.primary} />
      ) : (
        <Text style={buttonTextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: getPadding(14),
    paddingHorizontal: getPadding(24),
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...(isWeb ? shadows.sm : {}),
  },
  primary: {
    backgroundColor: palette.primary,
  },
  secondary: {
    backgroundColor: palette.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: palette.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    fontFamily: 'Inter-Regular',
  },
  primaryText: {
    color: palette.textOnPrimary,
  },
  secondaryText: {
    color: palette.textOnPrimary,
  },
  outlineText: {
    color: palette.primary,
  },
});

// Helper to get button text color based on background
const getButtonTextColor = (variant: string, style: any): string => {
  if (style?.backgroundColor === '#fff' || style?.backgroundColor === 'white') {
    return palette.primary;
  }
  if (variant === 'primary') {
    return palette.textOnPrimary;
  }
  if (variant === 'secondary') {
    return palette.textOnPrimary;
  }
  return palette.primary;
};

