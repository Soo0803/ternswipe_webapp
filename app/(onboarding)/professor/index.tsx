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
import { Button } from '../../../components/Button';
import UploadFileButton from '../../../component/UploadFileButton';
import { useCompanyForm } from '../../../context/companyFormContext';
import { getCurrentUser } from '../../../services/supabaseAuth';
import { getFontSize, getPadding } from '../../../utils/responsive';
import { palette } from '../../../constants/theme';
import { isWeb } from '../../../utils/platform';

export default function ProfessorOnboardingStep1() {
  const router = useRouter();
  const { formData, setFormData } = useCompanyForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'PROFESSOR') {
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
    if (!formData.professor_name || !formData.university) {
      Alert.alert('Missing fields', 'Please enter professor name and university.');
      return;
    }
    router.push('/(onboarding)/professor/step2');
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
        <Text style={styles.title}>Lab Information</Text>
        <Text style={styles.subtitle}>Step 1 of 3</Text>
      </View>

      <Text style={styles.sectionTitle}>Profile</Text>
      <FormField
        label="Professor or Lab Name"
        placeholder="Name"
        value={formData.professor_name || ''}
        onChangeText={(text) => setFormData({ ...formData, professor_name: text })}
        required
        fullWidth
      />
      <FormField
        label="University"
        placeholder="University"
        value={formData.university || ''}
        onChangeText={(text) => setFormData({ ...formData, university: text })}
        required
        fullWidth
      />
      <FormField
        label="About your research"
        placeholder="Research description"
        value={formData.description || ''}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        multiline
        numberOfLines={6}
        fullWidth
        style={styles.textArea}
      />

      <Text style={styles.sectionTitle}>Lab Images</Text>
      <View style={styles.uploadRow}>
        <Text style={styles.uploadLabel}>Team image</Text>
        <UploadFileButton
          onFileSelected={(file) => setFormData({ ...formData, team_image: file })}
          label={formData.team_image ? 'Replace' : 'Upload'}
        />
      </View>
      <View style={styles.uploadRow}>
        <Text style={styles.uploadLabel}>Lab image 1</Text>
        <UploadFileButton
          onFileSelected={(file) => setFormData({ ...formData, lab_first_image: file })}
          label={formData.lab_first_image ? 'Replace' : 'Upload'}
        />
      </View>
      <View style={styles.uploadRow}>
        <Text style={styles.uploadLabel}>Lab image 2</Text>
        <UploadFileButton
          onFileSelected={(file) => setFormData({ ...formData, lab_second_image: file })}
          label={formData.lab_second_image ? 'Replace' : 'Upload'}
        />
      </View>
      <View style={styles.uploadRow}>
        <Text style={styles.uploadLabel}>Lab image 3</Text>
        <UploadFileButton
          onFileSelected={(file) => setFormData({ ...formData, lab_third_image: file })}
          label={formData.lab_third_image ? 'Replace' : 'Upload'}
        />
      </View>

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
  sectionTitle: {
    fontSize: getFontSize(24),
    fontWeight: '600',
    color: palette.primary,
    marginTop: getPadding(24),
    marginBottom: getPadding(16),
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
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

