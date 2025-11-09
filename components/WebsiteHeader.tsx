import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { isWeb } from '../utils/platform';
import { getFontSize, getPadding } from '../utils/responsive';
import AppLogo from '../assets/app_icon/in_app_logo.svg';

export const WebsiteHeader: React.FC = () => {
  const router = useRouter();

  if (!isWeb) {
    return null; // Don't show on mobile
  }

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Pressable onPress={() => router.push('/')} style={styles.logoContainer}>
          <AppLogo width={120} height={40} />
        </Pressable>
        
        <View style={styles.nav}>
          <TouchableOpacity 
            onPress={() => router.push('/')}
            style={styles.navItem}
          >
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => router.push('/log_in_page')}
            style={styles.navItem}
          >
            <Text style={styles.navText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => router.push('/(student_sign_up)')}
            style={styles.navButton}
          >
            <Text style={styles.navButtonText}>Register as Student</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => router.push('/(company_sign_up)')}
            style={[styles.navButton, styles.navButtonPrimary]}
          >
            <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>Register as Professor</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: getPadding(16),
    position: 'sticky' as any,
    top: 0,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: getPadding(24),
  },
  logoContainer: {
    cursor: 'pointer',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getPadding(24),
  },
  navItem: {
    paddingVertical: getPadding(8),
    paddingHorizontal: getPadding(12),
  },
  navText: {
    fontSize: getFontSize(14),
    color: '#666',
    fontFamily: 'Inter-Regular',
    fontWeight: '500',
  },
  navButton: {
    paddingVertical: getPadding(8),
    paddingHorizontal: getPadding(16),
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#7da0ca',
  },
  navButtonPrimary: {
    backgroundColor: '#7da0ca',
    borderColor: '#7da0ca',
  },
  navButtonText: {
    fontSize: getFontSize(14),
    color: '#7da0ca',
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
  },
  navButtonTextPrimary: {
    color: '#fff',
  },
});

