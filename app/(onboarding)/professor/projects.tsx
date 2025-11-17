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
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebsiteLayout } from '../../../components/WebsiteLayout';
import { FormField } from '../../../components/FormField';
import { Button } from '../../../components/Button';
import SkillSelector from '../../../component/SkillSelector';
import { useCompanyForm } from '../../../context/companyFormContext';
import { getCurrentUser, completeProfessorOnboarding } from '../../../services/supabaseAuth';
import { storage } from '../../../utils/storage';
import { getFontSize, getPadding } from '../../../utils/responsive';
import { palette, radii } from '../../../constants/theme';
import { isWeb } from '../../../utils/platform';
import { Ionicons } from '@expo/vector-icons';

type ProjectDraft = {
  title: string;
  description: string;
  modality: string;
  location: string;
  required_skills: string[];
  hrs_per_week: string;
  start_date: string;
  end_date: string;
  capacity: string;
};

const EMPTY_PROJECT: ProjectDraft = {
  title: '',
  description: '',
  modality: '',
  location: '',
  required_skills: [],
  hrs_per_week: '',
  start_date: '',
  end_date: '',
  capacity: '1',
};

export default function ProfessorOnboardingProjects() {
  const router = useRouter();
  const { formData, setFormData } = useCompanyForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const projects = formData.projects && formData.projects.length > 0
    ? formData.projects
    : [{ ...EMPTY_PROJECT }];

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

  const updateProject = (index: number, updater: (draft: ProjectDraft) => ProjectDraft) => {
    const next = [...projects];
    if (!next[index]) next[index] = { ...EMPTY_PROJECT };
    next[index] = updater({ ...next[index] });
    setFormData({ ...formData, projects: next });
  };

  const handleAddProject = () => {
    if (projects.length >= 5) return;
    setFormData({ ...formData, projects: [...projects, { ...EMPTY_PROJECT }] });
  };

  const handleRemoveProject = (index: number) => {
    const next = [...projects];
    next.splice(index, 1);
    setFormData({ ...formData, projects: next });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const user = await getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'Please sign in again.');
        router.replace('/(auth)/signup');
        return;
      }

      await completeProfessorOnboarding(user.id, {
        professor_name: formData.professor_name,
        university: formData.university,
        description: formData.description,
        website: formData.website,
        position_description: formData.position_description,
        team_image: formData.team_image,
        lab_first_image: formData.lab_first_image,
        lab_second_image: formData.lab_second_image,
        lab_third_image: formData.lab_third_image,
      }, projects);

      // Update user in storage
      const updatedUser = await getCurrentUser();
      if (updatedUser) {
        await storage.setItem('auth_user', JSON.stringify({
          id: parseInt(updatedUser.id) || 0,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
        }));
      }

      router.replace('/(dashboard)/professor');
    } catch (error: any) {
      console.error('Submission error:', error);
      Alert.alert('Submission failed', error.message || 'Please check your input and try again.');
    } finally {
      setSubmitting(false);
    }
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

  const renderProject = (project: ProjectDraft, idx: number) => (
    <View key={`project-${idx}`} style={styles.projectSection}>
      <View style={styles.projectHeader}>
        <Text style={styles.projectTitle}>Project {idx + 1}</Text>
        {projects.length > 1 && (
          <TouchableOpacity onPress={() => handleRemoveProject(idx)}>
            <Text style={styles.removeLink}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      <FormField
        label="Project title"
        placeholder="Project title"
        value={project.title}
        onChangeText={(text) => updateProject(idx, (draft) => ({ ...draft, title: text }))}
        required
        fullWidth
      />

      <FormField
        label="Description"
        placeholder="Project description"
        value={project.description}
        onChangeText={(text) => updateProject(idx, (draft) => ({ ...draft, description: text }))}
        multiline
        numberOfLines={4}
        fullWidth
        style={styles.textArea}
      />

      <View style={styles.modalitySection}>
        <Text style={styles.modalityLabel}>Modality</Text>
        <View style={styles.modalityButtons}>
          {['Remote', 'On-site', 'Hybrid'].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => updateProject(idx, (draft) => ({ ...draft, modality: option }))}
              style={[
                styles.modalityButton,
                project.modality === option && styles.modalityButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.modalityButtonText,
                  project.modality === option && styles.modalityButtonTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FormField
        label="Location"
        placeholder="Location"
        value={project.location}
        onChangeText={(text) => updateProject(idx, (draft) => ({ ...draft, location: text }))}
        fullWidth
      />

      <SkillSelector
        selectedSkills={project.required_skills || []}
        onSkillsChange={(skills) =>
          updateProject(idx, (draft) => ({
            ...draft,
            required_skills: skills,
          }))
        }
        label="Required skills"
      />

      <FormField
        label="Hours/week"
        placeholder="Hours"
        value={project.hrs_per_week}
        onChangeText={(text) => updateProject(idx, (draft) => ({ ...draft, hrs_per_week: text }))}
        keyboardType="numeric"
        fullWidth
      />
      <FormField
        label="Positions"
        placeholder="Capacity"
        value={project.capacity}
        onChangeText={(text) =>
          updateProject(idx, (draft) => ({ ...draft, capacity: text || '1' }))
        }
        keyboardType="numeric"
        fullWidth
      />

      <FormField
        label="Start date"
        placeholder="YYYY-MM-DD"
        value={project.start_date}
        onChangeText={(text) => updateProject(idx, (draft) => ({ ...draft, start_date: text }))}
        fullWidth
      />
      <FormField
        label="End date"
        placeholder="YYYY-MM-DD"
        value={project.end_date}
        onChangeText={(text) => updateProject(idx, (draft) => ({ ...draft, end_date: text }))}
        fullWidth
      />
    </View>
  );

  const formContent = (
    <ScrollView
      contentContainerStyle={styles.formScrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Projects</Text>
        <Text style={styles.subtitle}>Step 3 of 3</Text>
      </View>

      {projects.map((project, idx) => renderProject(project, idx))}
      {projects.length < 5 && (
        <TouchableOpacity onPress={handleAddProject} style={styles.addProjectButton}>
          <Ionicons name="add-circle-outline" size={20} color={palette.primary} />
          <Text style={styles.addProjectText}>Add another project</Text>
        </TouchableOpacity>
      )}

      <View style={styles.buttonRow}>
        <Button
          title="Back"
          variant="outline"
          onPress={handleBack}
          style={styles.backButton}
        />
        <Button
          title={submitting ? 'Completing...' : 'Complete Registration'}
          onPress={handleSubmit}
          disabled={submitting}
          style={styles.submitButton}
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
  projectSection: {
    gap: getPadding(20),
    marginBottom: getPadding(32),
    paddingBottom: getPadding(32),
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectTitle: {
    fontSize: getFontSize(20),
    fontWeight: '600',
    color: palette.text,
  },
  removeLink: {
    fontSize: getFontSize(13),
    color: palette.danger,
    textDecorationLine: 'underline',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  modalitySection: {
    marginBottom: getPadding(20),
  },
  modalityLabel: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: palette.text,
    marginBottom: getPadding(10),
    fontFamily: 'Inter-Regular',
  },
  modalityButtons: {
    flexDirection: 'row',
    gap: getPadding(12),
    flexWrap: 'wrap',
  },
  modalityButton: {
    paddingVertical: getPadding(12),
    paddingHorizontal: getPadding(24),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceMuted,
  },
  modalityButtonActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  modalityButtonText: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    color: palette.textMuted,
    fontFamily: 'Inter-Regular',
  },
  modalityButtonTextActive: {
    color: palette.textOnPrimary,
  },
  addProjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getPadding(8),
    alignSelf: 'flex-start',
    paddingVertical: getPadding(8),
    paddingHorizontal: getPadding(12),
    marginBottom: getPadding(16),
  },
  addProjectText: {
    fontSize: getFontSize(16),
    color: palette.primary,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: getPadding(12),
    marginTop: getPadding(24),
  },
  backButton: {
    flex: 1,
  },
  submitButton: {
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

