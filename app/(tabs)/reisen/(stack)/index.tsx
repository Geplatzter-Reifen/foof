import React from "react";
import {
  allJourneys,
  createChain,
  createJourney,
  deleteAllJourneys,
} from "@/model/database_functions";
import JourneyList from "@/components/Journey/JourneyList";
import { Button, ScrollView, TextInput } from "react-native";
import { Journey } from "@/model/model";

let journeyText = "Journey";

export default function MeineReisen({ journeys }: { journeys: Journey[] }) {
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
