import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import AppLogo from '../../assets/app_icon/in_app_logo.svg';
import ProgressBar from '../../component/ProgressBar';
import UploadFileButton from '../../component/UploadFileButton';
import { useStudentForm } from '../../context/studentFormContext';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { FormField } from '../../components/FormField';
import { Button } from '../../components/Button';
import { palette, radii, shadows } from '../../constants/theme';
import { getFontSize, getPadding } from '../../utils/responsive';
import { isWeb } from '../../utils/platform';

const documentHighlights = [
  'Clarify where you can collaborate so we match you with suitable labs.',
  'Provide a phone number to simplify coordinating interviews and meetings.',
  'Upload supporting documents so professors can review your academic readiness quickly.',
];

export default function page_2() {
  const router = useRouter();
  const { formData, setFormData } = useStudentForm();

  const renderUploadRow = (
    label: string,
    description: string,
    key: 'transcript' | 'resume',
    buttonLabel?: string
  ) => (
    <View style={styles.uploadRow}>
      <View style={styles.uploadCopy}>
        <Text style={styles.uploadLabel}>{label}</Text>
        <Text style={styles.uploadDescription}>{description}</Text>
        {formData[key] && (
          <Text style={styles.uploadFileName}>
            {(formData[key] as any)?.name ?? 'File attached'}
          </Text>
        )}
      </View>
      <UploadFileButton
        onFileSelected={(file) => setFormData({ ...formData, [key]: file ?? undefined })}
        label={buttonLabel ?? (formData[key] ? 'Replace file' : 'Upload file')}
      />
    </View>
  );

  const formFields = (
    <>
      <View style={styles.formRow}>
        <FormField
          label="Location preference"
          placeholder="Where would you like to collaborate from?"
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text || '' })}
          fullWidth
        />
      </View>

      <View style={styles.formRow}>
        <FormField
          label="Phone number"
          placeholder="Include country code if applicable"
          value={formData.phone_number}
          onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
          keyboardType="phone-pad"
          fullWidth
        />
      </View>

      <View style={styles.sectionDivider} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Supporting documents</Text>
        <Text style={styles.sectionSubtitle}>
          These files stay secure and help professors understand your academic foundation.
        </Text>
      </View>

      {renderUploadRow(
        'Current transcript',
        'PDF preferred. Unofficial transcripts are accepted.',
        'transcript'
      )}

      {renderUploadRow(
        'Resume or CV',
        'Highlight projects, campus involvement, and prior experience.',
        'resume'
      )}

      <View style={styles.buttonGroup}>
        <Button
          title="Back to personal info"
          variant="outline"
          onPress={() => router.push('/(student_sign_up)')}
          style={styles.backButton}
        />
        <Button
          title="Continue to profile details"
          onPress={() => router.push('/(student_sign_up)/page_4')}
          style={styles.nextButton}
        />
      </View>
    </>
  );

  const webView = (
    <View style={styles.page}>
      <View style={styles.shell}>
        <View style={styles.introPanel}>
          <View style={styles.introBadge}>
            <Text style={styles.introBadgeText}>Student onboarding</Text>
          </View>
          <Text style={styles.introTitle}>Add practical details and documents.</Text>
          <Text style={styles.introSubtitle}>
            Completing this information makes it easier for faculty to respond quickly when they see a
            great match.
          </Text>
          <View style={styles.introList}>
            {documentHighlights.map((item) => (
              <View key={item} style={styles.introListItem}>
                <Text style={styles.introBullet}>•</Text>
                <Text style={styles.introListText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.progressHeader}>
            <View style={styles.progressTopRow}>
              <Text style={styles.progressTitle}>Student Registration</Text>
              <Text style={styles.progressStep}>Step 2 of 4</Text>
            </View>
            <Text style={styles.progressSubtitle}>Documents & contact details</Text>
            <ProgressBar process={0.5} />
          </View>
          <ScrollView
            contentContainerStyle={styles.formScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {formFields}
          </ScrollView>
        </View>
      </View>
    </View>
  );

  const mobileView = (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={hp(3)}
      style={{ flex: 1, width: '100%' }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.mobileSafeArea}>
          <StatusBar barStyle="dark-content" />
          <ScrollView contentContainerStyle={styles.mobileContent} showsVerticalScrollIndicator={false}>
            <View style={styles.mobileHeader}>
              <AppLogo width={65} height={65} />
              <ProgressBar process={0.5} />
              <Text style={[styles.progressTitle, styles.mobileTitle]}>Student Registration</Text>
              <Text style={[styles.progressSubtitle, styles.mobileSubtitle]}>Step 2 of 4</Text>
            </View>
            {formFields}
          </ScrollView>
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
    paddingVertical: getPadding(96),
    paddingHorizontal: getPadding(56),
  },
  shell: {
    width: '100%',
    maxWidth: 1440,
    marginHorizontal: 'auto',
    flexDirection: isWeb ? 'row' : 'column',
    gap: getPadding(64),
    alignItems: 'flex-start',
  },
  introPanel: {
    flex: 1,
    maxWidth: 520,
    gap: getPadding(24),
  },
  introBadge: {
    alignSelf: 'flex-start',
    paddingVertical: getPadding(6),
    paddingHorizontal: getPadding(14),
    backgroundColor: palette.primarySoft,
    borderRadius: radii.pill,
  },
  introBadgeText: {
    fontSize: getFontSize(12),
    fontWeight: '600',
    color: palette.primary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  introTitle: {
    fontSize: getFontSize(38),
    fontWeight: '700',
    color: palette.text,
    lineHeight: getFontSize(46),
    fontFamily: 'Inter-Regular',
  },
  introSubtitle: {
    fontSize: getFontSize(18),
    color: palette.textMuted,
    lineHeight: getFontSize(28),
    fontFamily: 'Inter-Regular',
  },
  introList: {
    gap: getPadding(14),
  },
  introListItem: {
    flexDirection: 'row',
    gap: getPadding(12),
    alignItems: 'flex-start',
  },
  introBullet: {
    fontSize: getFontSize(18),
    color: palette.primary,
    marginTop: -2,
  },
  introListText: {
    flex: 1,
    fontSize: getFontSize(15),
    color: palette.textMuted,
    lineHeight: getFontSize(24),
    fontFamily: 'Inter-Regular',
  },
  formCard: {
    flex: 1,
    maxWidth: 640,
    width: '100%',
    backgroundColor: palette.surface,
    borderRadius: radii.xl,
    padding: getPadding(40),
    borderWidth: 1,
    borderColor: palette.border,
    ...(shadows.md as any),
  },
  progressHeader: {
    gap: getPadding(12),
    marginBottom: getPadding(24),
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: getFontSize(28),
    fontWeight: '700',
    color: palette.text,
    fontFamily: 'Inter-Regular',
  },
  progressStep: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: palette.textSubtle,
  },
  progressSubtitle: {
    fontSize: getFontSize(16),
    color: palette.textMuted,
    fontFamily: 'Inter-Regular',
  },
  formScrollContent: {
    paddingBottom: getPadding(16),
    gap: getPadding(20),
  },
  formRow: {
    width: '100%',
  },
  sectionDivider: {
    height: 1,
    width: '100%',
    backgroundColor: palette.border,
    marginVertical: getPadding(12),
  },
  sectionHeader: {
    gap: getPadding(8),
  },
  sectionTitle: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: palette.text,
    fontFamily: 'Inter-Regular',
  },
  sectionSubtitle: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    lineHeight: getFontSize(22),
    fontFamily: 'Inter-Regular',
  },
  uploadRow: {
    width: '100%',
    gap: getPadding(16),
    paddingVertical: getPadding(16),
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  uploadCopy: {
    gap: getPadding(8),
  },
  uploadLabel: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    color: palette.text,
  },
  uploadDescription: {
    fontSize: getFontSize(14),
    color: palette.textMuted,
    lineHeight: getFontSize(22),
  },
  uploadFileName: {
    fontSize: getFontSize(13),
    color: palette.textSubtle,
    fontStyle: 'italic',
  },
  buttonGroup: {
    flexDirection: isWeb ? 'row' : 'column',
    gap: getPadding(12),
    marginTop: getPadding(12),
  },
  backButton: {
    flex: isWeb ? 1 : undefined,
  },
  nextButton: {
    flex: isWeb ? 1 : undefined,
  },
  mobileSafeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  mobileContent: {
    padding: getPadding(24),
    paddingBottom: getPadding(48),
    gap: getPadding(24),
  },
  mobileHeader: {
    alignItems: 'center',
    gap: getPadding(12),
  },
  mobileTitle: {
    textAlign: 'center',
  },
  mobileSubtitle: {
    textAlign: 'center',
  },
});

