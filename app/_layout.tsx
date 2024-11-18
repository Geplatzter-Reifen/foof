import { Stack, SplashScreen } from "expo-router";
import * as eva from "@eva-design/eva";
import { foofDarkTheme } from "@/constants/custom-theme";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import { initializeDatabase } from "@/model/database_functions";
import { FontAwesomeIconsPack } from "@/app/fontAwesome";

library.add(far, fas, fab);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [LayoutLoaded, setLayoutLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await initializeDatabase();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (LayoutLoaded) {
      SplashScreen.hideAsync();
    }
  }, [LayoutLoaded]);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <IconRegistry icons={FontAwesomeIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...foofDarkTheme }}>
        <SafeAreaView
          onLayout={() => setLayoutLoaded(true)}
          style={{
            flex: 1,
          }}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaView>
      </ApplicationProvider>
    </>
  );
}
