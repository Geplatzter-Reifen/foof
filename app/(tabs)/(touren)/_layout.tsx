import { Stack } from "expo-router";
import { foofLightTheme, foofDarkTheme } from "@/constants/custom-theme";
import CreateManualStage from "./createManualStage";

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
