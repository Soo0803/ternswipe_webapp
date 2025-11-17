import { Stack } from 'expo-router';
import { StudentFormProvider } from '../../context/studentFormContext';
import { CompanyFormProvider } from '../../context/companyFormContext';

export default function OnboardingLayout() {
  return (
    <StudentFormProvider>
      <CompanyFormProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="student/index" />
          <Stack.Screen name="student/step2" />
          <Stack.Screen name="student/step3" />
          <Stack.Screen name="professor/index" />
          <Stack.Screen name="professor/step2" />
          <Stack.Screen name="professor/projects" />
        </Stack>
      </CompanyFormProvider>
    </StudentFormProvider>
  );
}

