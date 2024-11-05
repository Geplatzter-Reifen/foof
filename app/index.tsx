import React from "react";
import {ScrollView, TextInput, StyleSheet} from "react-native";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Text, Button } from "@ui-kitten/components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  createJourney,
  allJourneys,
  deleteAllJourneys,
  createChain
} from "@/model/database_functions";
import JourneyList from "@/components/Journey/JourneyList";
import {Link} from "expo-router";

library.add(far);

let journeyText = "Journey";
export default function Index() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <ScrollView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder="Journey Title"
          onChangeText={(newText) => (journeyText = newText)}
        />
        <Button
          onPress={() => createJourney(journeyText)}
          title="Create Journey"
        />
        <Button onPress={() => createChain(journeyText)} title="Create Chain" />
        <Button onPress={deleteAllJourneys} title="Delete All Journeys" />
        <JourneyList journeys={allJourneys} />
        <Link href='/reise' style={styles.button}>
          zur Reiseübersicht
        </Link>
        <Button>BUTTON</Button>
        <FontAwesomeIcon icon="bicycle" />
      </ScrollView>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 17,
    textDecorationLine: 'underline',
    color: '#00f',
  },
});
