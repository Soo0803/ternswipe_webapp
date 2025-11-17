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
  Alert,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { FormField } from '../../components/FormField';
import { Button } from '../../components/Button';
import { signUpUser } from '../../services/supabaseAuth';
import { storage } from '../../utils/storage';
import { getFontSize, getPadding } from '../../utils/responsive';
import { palette, radii, shadows } from '../../constants/theme';
import { isWeb } from '../../utils/platform';
import { Ionicons } from '@expo/vector-icons';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [role, setRole] = useState<'STUDENT' | 'PROFESSOR'>('STUDENT');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || !username || !password) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }

    if (password.length < 3) {
      Alert.alert('Invalid password', 'Password must be at least 3 characters long.');
      return;
    }

    try {
      setSubmitting(true);

      const { user, session } = await signUpUser({
        email,
        username,
        password,
        role,
      });

      if (!session) {
        Alert.alert(
          'Account Created',
          'Your account has been created, but you may need to confirm your email. Please check your inbox.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(auth)/login'),
            },
          ]
        );
        return;
      }

      // Store session
      await storage.multiSet([
        ['auth_token', session.access_token],
        ['auth_user', JSON.stringify(user)],
      ]);

      console.log('User created successfully:', user);
      console.log('Session stored:', !!session);

      // Navigate to role-specific onboarding
      if (role === 'STUDENT') {
        router.replace('/(onboarding)/student');
      } else {
        router.replace('/(onboarding)/professor');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      Alert.alert('Sign up failed', error.message || 'Please check your input and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formContent = (
    <ScrollView
      contentContainerStyle={styles.formScrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formHeader}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Choose your role and provide basic information to get started.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.roleSelector}>
          <Text style={styles.roleLabel}>I am a:</Text>
          <View style={styles.roleButtons}>
            <Pressable
              onPress={() => setRole('STUDENT')}
              style={[styles.roleButton, role === 'STUDENT' && styles.roleButtonActive]}
            >
              <Ionicons
                name="school-outline"
                size={24}
                color={role === 'STUDENT' ? palette.textOnPrimary : palette.textMuted}
              />
              <Text
                style={[
                  styles.roleButtonText,
                  role === 'STUDENT' && styles.roleButtonTextActive,
                ]}
              >
                Student
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setRole('PROFESSOR')}
              style={[styles.roleButton, role === 'PROFESSOR' && styles.roleButtonActive]}
            >
              <Ionicons
                name="person-outline"
                size={24}
                color={role === 'PROFESSOR' ? palette.textOnPrimary : palette.textMuted}
              />
              <Text
                style={[
                  styles.roleButtonText,
                  role === 'PROFESSOR' && styles.roleButtonTextActive,
                ]}
              >
                Professor
              </Text>
            </Pressable>
          </View>
        </View>

        <FormField
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          required
          fullWidth
        />

        <FormField
          label="Username"
          placeholder="Choose a username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          required
          fullWidth
        />

        <View style={styles.passwordContainer}>
          <FormField
            label="Password"
            placeholder="Create a password (min. 3 characters)"
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
          title={submitting ? 'Creating account...' : 'Continue'}
          onPress={handleSubmit}
          disabled={submitting}
          fullWidth
          style={styles.submitButton}
        />

        <View style={styles.loginLink}>
          <Text style={styles.loginLinkText}>Already have an account? </Text>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginLinkButton}>Sign in</Text>
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
  roleSelector: {
    marginBottom: getPadding(8),
  },
  roleLabel: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: palette.text,
    marginBottom: getPadding(12),
    fontFamily: 'Inter-Regular',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: getPadding(12),
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: getPadding(8),
    paddingVertical: getPadding(16),
    paddingHorizontal: getPadding(20),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceMuted,
  },
  roleButtonActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  roleButtonText: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    color: palette.textMuted,
    fontFamily: 'Inter-Regular',
  },
  roleButtonTextActive: {
    color: palette.textOnPrimary,
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
  submitButton: {
    marginTop: getPadding(8),
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getPadding(16),
  },
  loginLinkText: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    fontFamily: 'Inter-Regular',
  },
  loginLinkButton: {
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

