import React from "react";
import { View } from "react-native";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Button, Text } from "@ui-kitten/components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Link } from "expo-router";

library.add(far);

export default function Index() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
          <Link href={"/automatic_tracking"}>Zum automatischen Tracking</Link>
      </View>
    </ApplicationProvider>
  );
}
