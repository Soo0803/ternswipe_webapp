import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { isWeb } from '../utils/platform';
import { getPadding, getMaxWidth } from '../utils/responsive';

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
    backgroundColor: '#fff',
    borderRadius: isWeb ? 12 : 0,
    padding: isWeb ? getPadding(32) : getPadding(20),
    maxWidth: isWeb ? 800 : undefined,
    width: '100%',
    ...(isWeb ? {} : { marginHorizontal: 'auto' }),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: '#7da0ca',
    borderRadius: 2,
  },
});

