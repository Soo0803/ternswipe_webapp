// app/(settings)/_layout.tsx
import { Stack } from "expo-router";
import { StudentFormProvider } from "../../context/studentFormContext";


export default function SwipingPageLayout() {
  return(
    <StudentFormProvider>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="page_2" options={{ headerShown: false }} />
        <Stack.Screen name="page_4" options={{ headerShown: false }} />
        <Stack.Screen name="page_3" options={{ headerShown: false }} />
      </Stack>
    </StudentFormProvider>
  );
}
