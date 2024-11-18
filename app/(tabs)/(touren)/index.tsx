import React, { useState } from "react";
import {
  getAllToursQuery,
  createTour,
  deleteAllTours,
} from "@/model/database_functions";
import TourList from "@/components/Tour/TourList";
import {
  ImageProps,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import {
  Layout,
  Button,
  Modal,
  Input,
  Text,
  Card,
  Datepicker,
  Icon,
  IconElement,
  Divider,
} from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export default function MeineTouren() {
  const [modalVisible, setModalVisible] = useState(false);
  const [tourName, setTourName] = useState("Tourname");
  const [startDate, setStartDate] = useState(new Date());
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={styles.container} level="2">
        <Layout style={styles.header} level="2">
          <MapIcon />
          <Text category="h3" style={styles.headerText}>
            Meine Touren
          </Text>
          <EditIcon />
        </Layout>
        <Divider />
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
            <Text>Bitte geben Sie ihren Tournamen ein:</Text>
            <Input
              status="primary"
              placeholder="Tourname"
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
                setTourName("Tourname");
              }}
            >
              Speichern
            </Button>
          </Card>
        </Modal>
      </Layout>
    </SafeAreaView>
  );
}

const MapIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="map" style={{ height: 24 }} />
);

const EditIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="edit" style={{ height: 24 }} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingHorizontal: 16,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
  },
});
