import React from "react";
import {
  getAllJourneysQuery,
  createJourney,
  deleteAllJourneys,
} from "@/model/database_functions";
import JourneyList from "@/components/Journey/JourneyList";
import { StyleSheet } from "react-native";
import { Layout, Input, Button } from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

let journeyText = "Journey";

export default function MeineReisen() {
  return (
    <Layout style={styles.container}>
      <Input
        placeholder="Journey Title"
        onChangeText={(newText) => (journeyText = newText)}
      />
      <Button onPress={() => createJourney(journeyText)}>Create Journey</Button>
      <Button onPress={deleteAllJourneys}>Delete All Journeys</Button>
      <JourneyList style={{ flex: 1 }} journeys={getAllJourneysQuery} />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});