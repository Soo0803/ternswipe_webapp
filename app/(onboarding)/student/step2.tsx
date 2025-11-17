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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WebsiteLayout } from '../../../components/WebsiteLayout';
import { FormField } from '../../../components/FormField';
import { FormRow } from '../../../components/FormRow';
import { Button } from '../../../components/Button';
import UploadFileButton from '../../../component/UploadFileButton';
import { useStudentForm } from '../../../context/studentFormContext';
import { getCurrentUser } from '../../../services/supabaseAuth';
import { getFontSize, getPadding } from '../../../utils/responsive';
import { palette } from '../../../constants/theme';
import { isWeb } from '../../../utils/platform';

export default function StudentOnboardingStep2() {
  const router = useRouter();
  const { formData, setFormData } = useStudentForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    router.push('/(onboarding)/student/step3');
  };

  const handleBack = () => {
    router.back();
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
        <Text style={styles.title}>Education & Documents</Text>
        <Text style={styles.subtitle}>Step 2 of 3</Text>
      </View>

      <Text style={styles.sectionTitle}>Education</Text>
      <FormRow>
        <FormField
          label="Graduation Year"
          placeholder="Expected graduation year"
          value={formData.graduation_year || ''}
          onChangeText={(text) => setFormData({ ...formData, graduation_year: text })}
          keyboardType="numeric"
        />
        <FormField
          label="Major"
          placeholder="Your major"
          value={formData.major_chosen || ''}
          onChangeText={(text) => setFormData({ ...formData, major_chosen: text })}
        />
      </FormRow>

      <Text style={styles.sectionTitle}>Contact</Text>
      <FormRow>
        <FormField
          label="Location preference"
          placeholder="Where would you like to collaborate from?"
          value={formData.location || ''}
          onChangeText={(text) => setFormData({ ...formData, location: text || '' })}
          fullWidth
        />
      </FormRow>
      <FormRow>
        <FormField
          label="Phone number"
          placeholder="Include country code if applicable"
          value={formData.phone_number || ''}
          onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
          keyboardType="phone-pad"
          fullWidth
        />
      </FormRow>

      <Text style={styles.sectionTitle}>Documents</Text>
      <View style={styles.uploadRow}>
        <Text style={styles.uploadLabel}>Current transcript</Text>
        <UploadFileButton
          onFileSelected={(file) => setFormData({ ...formData, transcript: file })}
          label={formData.transcript ? 'Replace' : 'Upload'}
        />
      </View>
      <View style={styles.uploadRow}>
        <Text style={styles.uploadLabel}>Resume</Text>
        <UploadFileButton
          onFileSelected={(file) => setFormData({ ...formData, resume: file })}
          label={formData.resume ? 'Replace' : 'Upload'}
        />
      </View>

      <View style={styles.buttonRow}>
        <Button
          title="Back"
          variant="outline"
          onPress={handleBack}
          style={styles.backButton}
        />
        <Button
          title="Next"
          onPress={handleNext}
          style={styles.nextButton}
        />
      </View>
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
  sectionTitle: {
    fontSize: getFontSize(24),
    fontWeight: '600',
    color: palette.primary,
    marginTop: getPadding(24),
    marginBottom: getPadding(16),
    fontFamily: 'Inter-Regular',
  },
  uploadRow: {
    marginBottom: getPadding(16),
  },
  uploadLabel: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: palette.text,
    marginBottom: getPadding(12),
    fontFamily: 'Inter-Regular',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: getPadding(12),
    marginTop: getPadding(24),
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
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

