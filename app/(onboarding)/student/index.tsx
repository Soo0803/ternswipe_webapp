import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebsiteLayout } from '../../../components/WebsiteLayout';
import { FormField } from '../../../components/FormField';
import { FormRow } from '../../../components/FormRow';
import { Button } from '../../../components/Button';
import ProfileImage from '../../../component/ProfileImagePicker';
import { useStudentForm } from '../../../context/studentFormContext';
import { getCurrentUser, completeStudentOnboarding } from '../../../services/supabaseAuth';
import { storage } from '../../../utils/storage';
import { getFontSize, getPadding } from '../../../utils/responsive';
import { palette, radii, shadows } from '../../../constants/theme';
import { isWeb } from '../../../utils/platform';
import { Ionicons } from '@expo/vector-icons';

export default function StudentOnboardingStep1() {
  const router = useRouter();
  const { formData, setFormData } = useStudentForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    async function checkAuth() {
      try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'STUDENT') {
          router.replace('/(auth)/signup');
          return;
        }
        setLoading(false);
      } catch (error) {
        router.replace('/(auth)/signup');
      }
    }
    checkAuth();
  }, []);

  const handleNext = () => {
    if (!formData.given_name || !formData.last_name) {
      Alert.alert('Missing fields', 'Please enter your name.');
      return;
    }
    router.push('/(onboarding)/student/step2');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const formContent = (
    <ScrollView
      contentContainerStyle={styles.formScrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Personal Information</Text>
        <Text style={styles.subtitle}>Step 1 of 3</Text>
      </View>

      <View style={styles.profileSection}>
        <ProfileImage
          onImageSelected={(file) => setFormData({ ...formData, profile_image: file })}
        />
      </View>

      <FormRow>
        <FormField
          label="Given Name"
          placeholder="Enter your given name"
          value={formData.given_name || ''}
          onChangeText={(text) => setFormData({ ...formData, given_name: text })}
          required
        />
        <FormField
          label="Last Name"
          placeholder="Enter your last name"
          value={formData.last_name || ''}
          onChangeText={(text) => setFormData({ ...formData, last_name: text })}
          required
        />
      </FormRow>

      <FormRow>
        <FormField
          label="Middle Name"
          placeholder="(Optional)"
          value={formData.middle_name || ''}
          onChangeText={(text) => setFormData({ ...formData, middle_name: text })}
        />
        <FormField
          label="Age"
          placeholder="Your age"
          value={formData.age || ''}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
          keyboardType="numeric"
        />
      </FormRow>

      <FormRow>
        <FormField
          label="Nationality"
          placeholder="Your nationality"
          value={formData.nationality || ''}
          onChangeText={(text) => setFormData({ ...formData, nationality: text })}
        />
        <FormField
          label="Languages"
          placeholder="Languages you speak"
          value={formData.language || ''}
          onChangeText={(text) => setFormData({ ...formData, language: text })}
        />
      </FormRow>

      <Button
        title="Next"
        onPress={handleNext}
        fullWidth
        style={styles.nextButton}
      />
    </ScrollView>
  );

  const webView = (
    <View style={styles.page}>
      <View style={styles.content}>{formContent}</View>
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
    paddingVertical: isWeb ? getPadding(48) : getPadding(20),
    paddingHorizontal: isWeb ? getPadding(80) : getPadding(24),
  },
  content: {
    width: '100%',
    maxWidth: 1200,
    marginHorizontal: 'auto',
  },
  formScrollContent: {
    paddingBottom: getPadding(12),
    gap: getPadding(20),
  },
  header: {
    marginBottom: getPadding(24),
  },
  title: {
    fontSize: getFontSize(42),
    fontWeight: '700',
    color: palette.text,
    fontFamily: 'Inter-Regular',
    marginBottom: getPadding(8),
  },
  subtitle: {
    fontSize: getFontSize(18),
    color: palette.textMuted,
    fontFamily: 'Inter-Regular',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: getPadding(8),
  },
  nextButton: {
    marginTop: getPadding(24),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.background,
  },
  loadingText: {
    fontSize: getFontSize(16),
    color: palette.textMuted,
  },
  mobileFlex: {
    flex: 1,
  },
  mobileSafe: {
    flex: 1,
    backgroundColor: palette.background,
  },
});

