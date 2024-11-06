import React from "react";
import { Button, ScrollView, TextInput } from "react-native";
import {
  createJourney,
  deleteAllJourneys,
  getAllJourneys,
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
      <Button onPress={deleteAllJourneys} title="Delete All Journeys" />
      <JourneyList journeys={getAllJourneys} />
    </ScrollView>
  );
}
