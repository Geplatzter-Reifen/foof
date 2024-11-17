import React, { useState } from "react";
import {
  getAllToursQuery,
  createTour,
  deleteAllTours,
} from "@/model/database_functions";
import TourList from "@/components/Tour/TourList";
import { ScrollView, StyleSheet } from "react-native";
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

export default function MeineTouren() {
  const [modalVisible, setModalVisible] = useState(false);
  const [tourName, setTourName] = useState("Tourenname");
  const [startDate, setStartDate] = useState(new Date());
  return (
    <Layout style={styles.container} level="2">
      <ScrollView>
        <Layout level="1">
          <TourList tours={getAllToursQuery} />
        </Layout>
      </ScrollView>
      <Button
        status="basic"
        onPress={() => setModalVisible(true)}
        style={{ width: 400, marginVertical: 5 }}
        accessoryLeft={<FontAwesomeIcon icon="plus" />}
      >
        Neue Tour
      </Button>
      <Button
        status="basic"
        onPress={() => deleteAllTours()}
        accessoryLeft={<FontAwesomeIcon icon="trash" />}
        style={{ width: 400, marginBottom: 5 }}
      >
        Alle Touren löschen
      </Button>

      <Modal visible={modalVisible} backdropStyle={styles.backdrop}>
        <Card disabled={true}>
          <Text>Bitte geben Sie ihren Tourennamen ein:</Text>
          <Input
            status="primary"
            placeholder="Tourenname"
            value={tourName}
            onChangeText={(tourText) => setTourName(tourText)}
          />
          <Datepicker
            date={startDate}
            onSelect={(selectedDate) => setStartDate(selectedDate)}
          />
          <Button
            onPress={async () => {
              await createTour(tourName, startDate.getTime());
              setModalVisible(false);
              setTourName("Tourenname");
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
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
