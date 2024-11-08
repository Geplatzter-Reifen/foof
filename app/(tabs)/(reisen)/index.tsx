import React, { useState } from "react";
import {
  getAllJourneysQuery,
  createJourney,
  deleteAllJourneys,
} from "@/model/database_functions";
import JourneyList from "@/components/Journey/JourneyList";
import { StyleSheet } from "react-native";
import {
  Layout,
  Button,
  Modal,
  Input,
  Text,
  Card,
  Datepicker,
} from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export default function MeineReisen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [journeyName, setJourneyName] = useState("Meine Reise");
  const [startDate, setStartDate] = useState(new Date());
  return (
    <Layout style={styles.container}>
      <Layout level="2">
        <JourneyList journeys={getAllJourneysQuery} />
        <Button
          status="basic"
          onPress={() => setModalVisible(true)}
          style={{}}
          accessoryLeft={<FontAwesomeIcon icon="plus" />}
        >
          Neue Reise
        </Button>
        <Button
          status="basic"
          onPress={() => deleteAllJourneys()}
          accessoryLeft={<FontAwesomeIcon icon="trash" />}
        >
          Alle Reisen löschen
        </Button>
      </Layout>

      <Modal visible={modalVisible} backdropStyle={styles.backdrop}>
        <Card disabled={true}>
          <Text>Bitte geben Sie ihren Reisenamen ein:</Text>
          <Input
            status="primary"
            placeholder="Reisename"
            value={journeyName}
            onChangeText={(journeyText) => setJourneyName(journeyText)}
          />
          <Datepicker
            date={startDate}
            onSelect={(selectedDate) => setStartDate(selectedDate)}
          />
          <Button
            onPress={() => {
              createJourney(journeyName, startDate.getTime());
              setModalVisible(false);
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
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
