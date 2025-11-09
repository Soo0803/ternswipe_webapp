import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { isWeb } from '../utils/platform';
import { getFontSize, getPadding } from '../utils/responsive';

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
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#7da0ca'} />
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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: '#7da0ca',
  },
  secondary: {
    backgroundColor: '#6c757d',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#7da0ca',
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
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
  outlineText: {
    color: '#7da0ca',
  },
});

// Helper to get button text color based on background
const getButtonTextColor = (variant: string, style: any): string => {
  if (style?.backgroundColor === '#fff' || style?.backgroundColor === 'white') {
    return '#7da0ca';
  }
  if (variant === 'primary') {
    return '#fff';
  }
  if (variant === 'secondary') {
    return '#fff';
  }
  return '#7da0ca';
};

