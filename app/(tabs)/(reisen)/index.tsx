import React from "react";
import {
  getAllJourneysQuery,
  createJourney,
  deleteAllJourneys,
} from "@/model/database_functions";
import JourneyList from "@/components/Journey/JourneyList";
import { Button, ScrollView, TextInput } from "react-native";

let journeyText = "Journey";

export default function MeineReisen() {
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
      <JourneyList journeys={getAllJourneysQuery} />
    </ScrollView>
  );
}
