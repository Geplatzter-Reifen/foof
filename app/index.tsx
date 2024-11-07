import React from "react";
import { View } from "react-native";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Button, Text } from "@ui-kitten/components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {Link} from "expo-router";

library.add(fas);

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
        <Text>Edit app/index.tsx to edit this screen.</Text>
        <Button>BUTTON</Button>
        <Link href={"/automatic_tracking"}>Go to automatic tracking screen.</Link>
        <Link href={"/manual_tracking"}>Go to manual tracking screen.</Link>
        <Link href={"/database_testsite"}>Go to database testsite.</Link>
        <FontAwesomeIcon icon="bicycle" />
      </View>
    </ApplicationProvider>
  );
}
