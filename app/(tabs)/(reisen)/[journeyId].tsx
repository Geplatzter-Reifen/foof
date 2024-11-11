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
import {
  Layout,
  Button,
  Card,
  Input,
  Modal,
  Datepicker,
} from "@ui-kitten/components";
import TripList from "@/components/Journey/TripList";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { createManualTrip } from "@/services/tracking";

export default function Reiseuebersicht() {
  const { journeyId } = useLocalSearchParams<{ journeyId: string }>();
  const [journey, setJourney] = useState<Journey>();
  const [modalVisible, setModalVisible] = useState(false);
  const [tripName, setTripName] = useState("");
  const [startCoords, setStartCoords] = useState("");
  const [endCoords, setEndCoords] = useState("");

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
      <Modal visible={modalVisible} backdropStyle={styles.backdrop}>
        <Card disabled={true}>
          <Input
            placeholder="Streckenname"
            value={tripName}
            onChangeText={(tripText) => setTripName(tripText)}
          />
          <Input
            placeholder="Startkoordinaten"
            value={startCoords}
            onChangeText={(coordsText) => setStartCoords(coordsText)}
          />
          <Input
            placeholder="Endkoordinaten"
            value={endCoords}
            onChangeText={(coordsText) => setEndCoords(coordsText)}
          />
          <Button
            status="basic"
            onPress={() => {
              setModalVisible(false);
              setTripName("");
              setStartCoords("");
              setEndCoords("");
            }}
          >
            Abbrechen
          </Button>
          <Button
            onPress={async () => {
              await createManualTrip(
                tripName,
                startCoords,
                endCoords,
                journeyId,
              );
              setModalVisible(false);
              setTripName("");
            }}
          >
            Speichern
          </Button>
        </Card>
      </Modal>
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
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
