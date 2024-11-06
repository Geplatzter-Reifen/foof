import { Stack } from "expo-router";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { SafeAreaView } from "react-native";

library.add(far, fas, fab);

export default function RootLayout() {
  return (
    <ApplicationProvider {...eva} theme={eva.dark}>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </ApplicationProvider>
  );
}
