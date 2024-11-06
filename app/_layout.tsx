import { Stack } from "expo-router";
import * as TaskManager from "expo-task-manager";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
}
