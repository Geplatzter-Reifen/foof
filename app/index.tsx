import React from "react";
import { Button, Text, ScrollView, TextInput } from "react-native";
import {
  createJourney,
  journeyQuery,
  deleteAllJourneys,
} from "@/model/database_functions";
import JourneyList from "@/components/Journey/JourneyList";
let journeyText = "Journey";
export default function Index() {
  return (
    <ScrollView>
      <Text>Games:</Text>
      <JourneyList journeys={journeyQuery} />
      <TextInput
        placeholder="Game Title"
        onChangeText={(newText) => (journeyText = newText)}
      />
      <Button onPress={() => createJourney(journeyText)} title="Create Game" />
      <Button onPress={deleteAllJourneys} title="Delete All Games" />
    </ScrollView>
  );
}
