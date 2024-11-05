import React from "react";
import { View } from "react-native";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(far, fas, fab);

export default function Index() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <View></View>
    </ApplicationProvider>
  );
}
