import { Stack } from "expo-router";
import { foofLightTheme } from "@/constants/custom-theme";

export default function ReiseStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: foofLightTheme["color-primary-500"],
        headerShown: true,
        headerStyle: {
          backgroundColor: foofLightTheme["color-basic-100"],
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Meine Touren",
        }}
      />
      <Stack.Screen
        name="createManualStage"
        options={{
          headerShown: true,
          title: "Stage",
        }}
      />
    </Stack>
  );
}
