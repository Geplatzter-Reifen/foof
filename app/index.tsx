import React from "react";
import { Button, StyleSheet, ScrollView, TextInput } from "react-native";
import {
  createJourney,
  allJourneys,
  deleteAllJourneys,
  createChain
} from "@/model/database_functions";
import JourneyList from "@/components/Journey/JourneyList";
import {Link} from "expo-router";

let journeyText = "Journey";
export default function Index() {
  return (
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
      </ScrollView>
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
