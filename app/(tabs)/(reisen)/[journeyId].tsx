import React from "react";
import { StyleSheet, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { DATE, dateFormat } from "@/utils/dateUtil";
import {
  createTrip,
  getAllTripsByJourneyIdQuery,
  getJourneyByJourneyId,
} from "@/model/database_functions";
import { useEffect, useState } from "react";
import { Journey } from "@/model/model";
import { Stack } from "expo-router";
import { Layout, Button } from "@ui-kitten/components";
import TripList from "@/components/Journey/TripList";

export default function Reiseuebersicht() {
  const { journeyId } = useLocalSearchParams<{ journeyId: string }>();
  const [journey, setJourney] = useState<Journey>();

  useEffect(() => {
    (async () => {
      setJourney(await getJourneyByJourneyId(journeyId));
    })();
  }, [journey, journeyId]);

  return (
    <Layout style={styles.page}>
      <Stack.Screen
        options={{
          title: journey?.title,
          headerTitle: journey?.title,
        }}
      />
      <Layout style={styles.overview}>
        <Text>
          Start der Reise:{" "}
          {journey?.startedAt
            ? dateFormat(new Date(journey?.startedAt), DATE)
            : ""}
        </Text>
      </Layout>
      <TripList trips={getAllTripsByJourneyIdQuery(journeyId)} />
      <Button onPress={async () => await createTrip(journeyId, "Neue Strecke")}>
        +
      </Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  overview: {
    backgroundColor: "#f5f5f5",
    width: "100%",
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
