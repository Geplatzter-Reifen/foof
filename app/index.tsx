import React, { useState, useEffect } from "react";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  Button,
  Layout,
  Text,
} from "@ui-kitten/components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as SplashScreen from "expo-splash-screen";

library.add(fas);

export default function Index() {
  const [layoutLoaded, setLayoutLoaded] = useState(false);

  useEffect(() => {
    if (layoutLoaded) {
      SplashScreen.hideAsync();
    }
  }, [layoutLoaded]);
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layout
        onLayout={() => setLayoutLoaded(true)}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Edit app/index.tsx to edit this screen.</Text>
        <Button>BUTTON</Button>
        <FontAwesomeIcon icon="bicycle" />
      </Layout>
    </ApplicationProvider>
  );
}
