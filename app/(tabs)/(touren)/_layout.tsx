import { Stack } from "expo-router";
import { foofLightTheme } from "@/constants/custom-theme";

export default function ReiseStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: foofLightTheme["color-basic-100"],
        headerShown: true,
        headerStyle: {
          backgroundColor: foofLightTheme["color-basic-500"],
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
    </Stack>
  );
}
