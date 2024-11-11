import React from "react";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { DATE, dateFormat } from "@/utils/dateUtil";
import {
  getAllTripsByJourneyIdQuery,
  getJourneyByJourneyId,
  setJourneyActive,
  setJourneyInactive,
} from "@/model/database_functions";
import { useEffect, useState } from "react";
import { Journey } from "@/model/model";
import { Stack } from "expo-router";
import { Layout, Button, Text } from "@ui-kitten/components";
import TripList from "@/components/Journey/TripList";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { CreateManualTripModal } from "@/components/Journey/CreateManualTripModal";
import RNFadedScrollView from "rn-faded-scrollview";
import { foofDarkTheme } from "@/constants/custom-theme";
import { hexToRgba } from "@/utils/colorUtil";

export default function Reiseuebersicht() {
  const { journeyId } = useLocalSearchParams<{ journeyId: string }>();
  const [journey, setJourney] = useState<Journey>();
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const reloadScreen = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    (async () => {
      setJourney(await getJourneyByJourneyId(journeyId));
    })();
  }, [journeyId]);

  const toggleJourneyStatus = async () => {
    if (journey) {
      if (journey.isActive) {
        await setJourneyInactive(journeyId);
      } else {
        await setJourneyActive(journeyId);
      }
    }
    reloadScreen();
  };

  return (
    <Layout style={styles.container} level="3">
      <Stack.Screen
        options={{
          title: journey?.title,
          headerTitle: journey?.title,
        }}
      />
      <Layout level="1" style={styles.overview}>
        <Text>
          Start der Reise:{" "}
          {journey?.startedAt
            ? dateFormat(new Date(journey?.startedAt), DATE)
            : ""}
        </Text>
        <Text>{"Status: " + (journey?.isActive ? "aktiv" : "inaktiv")}</Text>
        {journey?.isActive ? (
          <Button status="basic" onPress={() => toggleJourneyStatus()}>
            deaktivieren
          </Button>
        ) : (
          <Button status="info" onPress={() => toggleJourneyStatus()}>
            Zur Aktiven Reise Machen
          </Button>
        )}
      </Layout>
      <RNFadedScrollView
        allowStartFade={true}
        horizontal={false}
        fadeSize={10}
        style={styles.scrollView}
        fadeColors={[
          hexToRgba(foofDarkTheme["color-basic-900"], 0.18),
          hexToRgba(foofDarkTheme["color-basic-900"], 0.9),
        ]}
        startFadeStyle={styles.fadeStyle}
        endFadeStyle={styles.fadeStyle}
      >
        <Layout>
          <TripList trips={getAllTripsByJourneyIdQuery(journeyId)} />
        </Layout>
      </RNFadedScrollView>
      <Button
        status="basic"
        onPress={() => setModalVisible(true)}
        accessoryLeft={<FontAwesomeIcon icon="add" />}
        style={styles.button}
      >
        Strecke Manuell Eintragen
      </Button>

      <CreateManualTripModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        journeyId={journeyId}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  overview: {
    padding: 15,
  },
  scrollView: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  fadeStyle: {
    color: foofDarkTheme["background-basic-color-3"],
    backgroundColor: foofDarkTheme["background-basic-color-3"],
  },
  button: {
    margin: 15,
  },
});
