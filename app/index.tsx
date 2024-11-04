import React from "react";
import { Button, Text, ScrollView, TextInput } from "react-native";
import {
  createJourney,
  allJourneys,
  deleteAllJourneys,
  createChain
} from "@/model/database_functions";
import JourneyList from "@/components/Journey/JourneyList";

let journeyText = "Journey";
export default function Index() {
  return (
    <ScrollView>
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
    </ScrollView>
  );
}
