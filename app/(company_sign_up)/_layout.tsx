// app/(settings)/_layout.tsx
import { Stack } from "expo-router";
import { CompanyFormProvider } from "../../context/companyFormContext";

export default function SwipingPageLayout() {
  return(
    <CompanyFormProvider>
      <Stack screenOptions={{ headerShown: false, }} >
          <Stack.Screen name="index"/>
          <Stack.Screen name= "page_2"/> 
          <Stack.Screen name= "page_3"/>
      </Stack>
    </CompanyFormProvider>
  );
}
