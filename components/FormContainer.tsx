import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { isWeb } from '../utils/platform';
import { getPadding } from '../utils/responsive';
import { palette, radii, shadows } from '../constants/theme';

interface FormContainerProps {
  children: React.ReactNode;
  title?: string;
}

export const FormContainer: React.FC<FormContainerProps> = ({ children, title }) => {
  if (isWeb) {
    return (
      <View style={styles.webFormContainer}>
        {title && <View style={styles.titleContainer}><View style={styles.titleBar} /></View>}
        <ScrollView 
          contentContainerStyle={styles.webFormContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.mobileFormContent}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  webFormContainer: {
    backgroundColor: palette.surface,
    borderRadius: isWeb ? radii.lg : 0,
    padding: isWeb ? getPadding(32) : getPadding(20),
    maxWidth: isWeb ? 720 : undefined,
    width: '100%',
    ...(isWeb ? {} : { marginHorizontal: 'auto' }),
    ...(isWeb ? shadows.md : {}),
    borderWidth: isWeb ? 1 : 0,
    borderColor: palette.border,
  },
  webFormContent: {
    padding: isWeb ? getPadding(8) : 0,
  },
  mobileFormContent: {
    padding: getPadding(20),
    paddingBottom: getPadding(40),
  },
  titleContainer: {
    marginBottom: getPadding(24),
  },
  titleBar: {
    height: 4,
    width: 60,
    backgroundColor: palette.primary,
    borderRadius: 2,
  },
});

