import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { FormField } from '../../components/FormField';
import { Button } from '../../components/Button';
import { signIn } from '../../services/supabaseAuth';
import { storage } from '../../utils/storage';
import { getFontSize, getPadding } from '../../utils/responsive';
import { palette, radii, shadows } from '../../constants/theme';
import { isWeb } from '../../utils/platform';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrUsername || !password) {
      alert('Please enter both email/username and password');
      return;
    }

    try {
      setLoading(true);
      const { user, session } = await signIn(emailOrUsername, password);

      await storage.multiSet([
        ['auth_token', session.access_token],
        ['auth_user', JSON.stringify(user)],
      ]);

      // Navigate to role-specific dashboard
      if (user.role === 'STUDENT') {
        router.replace('/(dashboard)/student');
      } else if (user.role === 'PROFESSOR') {
        router.replace('/(dashboard)/professor');
      } else {
        router.replace('/(dashboard)');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert(`Login failed: ${error.message || 'Invalid credentials. Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <ScrollView
      contentContainerStyle={styles.formScrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formHeader}>
        <Text style={styles.title}>Sign in to TernSwipe</Text>
        <Text style={styles.subtitle}>
          Continue your conversations, review matches, and update project preferences.
        </Text>
      </View>

      <View style={styles.form}>
        <FormField
          label="Email or Username"
          placeholder="Enter your email or username"
          value={emailOrUsername}
          onChangeText={setEmailOrUsername}
          keyboardType="email-address"
          autoCapitalize="none"
          required
          fullWidth
        />

        <View style={styles.passwordContainer}>
          <FormField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            required
            fullWidth
            containerStyle={styles.passwordField}
          />
          <Pressable
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={passwordVisible ? 'eye-off' : 'eye'}
              size={18}
              color={palette.textSubtle}
            />
          </Pressable>
        </View>

        <Button
          title={loading ? 'Signing in...' : 'Sign in'}
          onPress={handleLogin}
          disabled={loading}
          fullWidth
          style={styles.loginButton}
        />

        <View style={styles.signupLink}>
          <Text style={styles.signupLinkText}>Don't have an account? </Text>
          <Pressable onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.signupLinkButton}>Sign up</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );

  const webView = (
    <View style={styles.page}>
      <View style={styles.content}>
        <View style={styles.formWrapper}>{formContent}</View>
      </View>
    </View>
  );

  const mobileView = (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.mobileFlex}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.mobileSafe}>
          <StatusBar barStyle="light-content" />
          {formContent}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

  return (
    <WebsiteLayout showHeader={isWeb}>
      {isWeb ? webView : mobileView}
    </WebsiteLayout>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    ...(isWeb ? { minHeight: '100vh' as any } : { flex: 1 }),
    paddingVertical: isWeb ? getPadding(96) : getPadding(20),
    paddingHorizontal: isWeb ? getPadding(56) : getPadding(20),
  },
  content: {
    width: '100%',
    maxWidth: 600,
    marginHorizontal: 'auto',
  },
  formWrapper: {
    width: '100%',
    backgroundColor: palette.surface,
    borderRadius: radii.xl,
    padding: getPadding(40),
    borderWidth: 1,
    borderColor: palette.border,
    ...(shadows.md as any),
  },
  formScrollContent: {
    paddingBottom: getPadding(12),
    gap: getPadding(20),
  },
  formHeader: {
    marginBottom: getPadding(24),
    gap: getPadding(12),
  },
  title: {
    fontSize: getFontSize(36),
    fontWeight: '700',
    color: palette.text,
    fontFamily: 'Inter-Regular',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: getFontSize(16),
    color: palette.textMuted,
    fontFamily: 'Inter-Regular',
    lineHeight: getFontSize(26),
  },
  form: {
    width: '100%',
    gap: getPadding(20),
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordField: {
    width: '100%',
  },
  eyeButton: {
    position: 'absolute',
    right: getPadding(16),
    top: getFontSize(40),
    zIndex: 10,
  },
  loginButton: {
    marginTop: getPadding(8),
  },
  signupLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getPadding(16),
  },
  signupLinkText: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    fontFamily: 'Inter-Regular',
  },
  signupLinkButton: {
    fontSize: getFontSize(14),
    color: palette.primary,
    fontWeight: '600',
    fontFamily: 'Inter-Regular',
  },
  mobileFlex: {
    flex: 1,
  },
  mobileSafe: {
    flex: 1,
    backgroundColor: palette.background,
  },
});

