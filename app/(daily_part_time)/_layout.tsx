// app/(settings)/_layout.tsx
import { Stack } from "expo-router";

export default function PartTimePageLayout() {
  return(
    <Stack screenOptions={{ 
      headerShown: true, 
      title: 'Daily Part - Time Page' 
    }} 
    />
  );
}
