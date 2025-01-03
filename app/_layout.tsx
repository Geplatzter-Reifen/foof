import { Stack, SplashScreen } from "expo-router";
import * as eva from "@eva-design/eva";
import { foofDarkTheme, foofLightTheme } from "@/constants/custom-theme";
import {
  ApplicationProvider,
  IconRegistry,
  ModalService,
} from "@ui-kitten/components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { initializeDatabase } from "@/database/model/database_functions";
import { FontAwesomeIconsPack } from "@/components/Font/fontAwesome";
import * as Font from "expo-font";
import Icon from "@expo/vector-icons/FontAwesome6";
import { default as mapping } from "@/mapping.json";
import { View } from "react-native";

library.add(far, fas, fab);

// enables additional status bar offset for UI Kitten measurable elements like Modal and Popover
ModalService.setShouldUseTopInsets = true;

const USE_DARK_THEME = false;

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [layoutLoaded, setLayoutLoaded] = useState(false);

  const theme = USE_DARK_THEME
    ? { ...eva.dark, ...foofDarkTheme }
    : { ...eva.light, ...foofLightTheme };

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        const dbPromise = initializeDatabase();
        const fontPromise = Font.loadAsync({
          ...Icon.font,
        });

        await Promise.allSettled([dbPromise, fontPromise]);
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
    if (layoutLoaded) {
      SplashScreen.hideAsync();
    }
  }, [layoutLoaded]);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <IconRegistry icons={FontAwesomeIconsPack} />
      <ApplicationProvider {...eva} customMapping={mapping} theme={theme}>
        <SafeAreaProvider>
          <View
            onLayout={() => setLayoutLoaded(true)}
            style={{
              flex: 1,
            }}
          >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </View>
        </SafeAreaProvider>
      </ApplicationProvider>
    </>
  );
}
