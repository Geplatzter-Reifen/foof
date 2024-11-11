import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { DATE, dateFormat } from "@/utils/dateUtil";
import {
  getAllTripsByJourneyIdQuery,
  getJourneyByJourneyId,
} from "@/model/database_functions";
import { useEffect, useState } from "react";
import { Journey } from "@/model/model";
import { Stack } from "expo-router";
import { Layout, Button, Card, Input, Modal } from "@ui-kitten/components";
import TripList from "@/components/Journey/TripList";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { createManualTrip } from "@/services/tracking";
import { CreateManualTripModal } from "@/components/Journey/CreateManualTripModal";

export default function Reiseuebersicht() {
  const { journeyId } = useLocalSearchParams<{ journeyId: string }>();
  const [journey, setJourney] = useState<Journey>();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      setJourney(await getJourneyByJourneyId(journeyId));
    })();
  }, [journeyId]);

  return (
    <Layout level="2" style={styles.page}>
      <Stack.Screen
        options={{
          title: journey?.title,
          headerTitle: journey?.title,
        }}
      />
      <Layout level="1" style={styles.overview}>
        <Text style={{ color: "white" }}>
          Start der Reise:{" "}
          {journey?.startedAt
            ? dateFormat(new Date(journey?.startedAt), DATE)
            : ""}
        </Text>
      </Layout>
      <View style={styles.content}>
        <TripList trips={getAllTripsByJourneyIdQuery(journeyId)} />
        <Button
          status="basic"
          onPress={() => setModalVisible(true)}
          accessoryLeft={<FontAwesomeIcon icon="add" />}
        >
          Neue Strecke
        </Button>
      </View>

      <CreateManualTripModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        journeyId={journeyId}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "flex-start",
  },
  content: {
    paddingHorizontal: "10%",
  },
  overview: {
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
