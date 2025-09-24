// app/(settings)/_layout.tsx
import { Stack } from "expo-router";

export default function SwipingPageLayout() {
  return(
    <Stack screenOptions={{ 
      headerShown: true, 
      title: 'Swiping Page' 
    }} 
    />
  );
}
