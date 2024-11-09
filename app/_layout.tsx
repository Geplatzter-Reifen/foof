import { Stack } from "expo-router";
import * as eva from "@eva-design/eva";
import { foofDarkTheme } from "@/constants/custom-theme";
import { ApplicationProvider } from "@ui-kitten/components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { SafeAreaView, Platform, StatusBar } from "react-native";

library.add(far, fas, fab);

export default function RootLayout() {
  return (
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...foofDarkTheme }}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </ApplicationProvider>
  );
}
