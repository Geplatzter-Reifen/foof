import { Stack } from "expo-router";
import { foofDarkTheme } from "@/constants/custom-theme";

export default function ReiseStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: foofDarkTheme["color-basic-500"],
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Meine Reisen",
        }}
      />
      <Stack.Screen name="[journeyId]" options={{ headerShown: true }} />
    </Stack>
  );
}
