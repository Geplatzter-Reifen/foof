import React from "react";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { DATE, dateFormat } from "@/utils/dateUtil";
import {
  getAllStagesByTourIdQuery,
  getTourByTourId,
  setTourActive,
  setTourInactive,
} from "@/model/database_functions";
import { useEffect, useState } from "react";
import { Tour } from "@/model/model";
import { Stack } from "expo-router";
import { Layout, Button, Text } from "@ui-kitten/components";
import StageList from "@/components/Tour/StageList";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { CreateManualStageModal } from "@/components/Tour/CreateManualStageModal";
import RNFadedScrollView from "rn-faded-scrollview";
import { foofTheme } from "@/constants/custom-theme";
import { hexToRgba } from "@/utils/colorUtil";
import { useRouter } from "expo-router";


export default function Reiseuebersicht() {
    const router = useRouter();
  const { journeyId, journeysAmount } = useLocalSearchParams<{ journeyId: string; journeysAmount: string }>();
  const [journey, setJourney] = useState<Journey>();
  // const [modalVisible, setModalVisible] = useState(false);
export default function Touruebersicht() {
  const { tourId } = useLocalSearchParams<{ tourId: string }>();
  const [tour, setTour] = useState<Tour>();
  const [modalVisible, setModalVisible] = useState(false);
  const [, setRefreshTrigger] = useState(0);

  const reloadScreen = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    (async () => {
      setTour(await getTourByTourId(tourId));
    })();
  }, [tourId]);

  const toggleTourStatus = async () => {
    if (tour) {
      if (tour.isActive) {
        await setTourInactive(tourId);
      } else {
        await setTourActive(tourId);
      }
    }
    reloadScreen();
  };

  return (
    <Layout style={styles.container} level="2">
      <Stack.Screen
        options={{
          title: tour?.title,
          headerTitle: tour?.title,
        }}
      />
      <Layout level="1" style={styles.overview}>
        <Text>
          Start der Tour:{" "}
          {tour?.startedAt ? dateFormat(new Date(tour?.startedAt), DATE) : ""}
        </Text>
        <Text>{"Status: " + (tour?.isActive ? "aktiv" : "inaktiv")}</Text>
        {tour?.isActive ? (
          <Button status="basic" onPress={toggleTourStatus}>
            deaktivieren
          </Button>
        ) : (
          <Button status="info" onPress={toggleTourStatus}>
            Zur Aktiven Tour Machen
          </Button>
        )}
      </Layout>
      <RNFadedScrollView
        allowStartFade={true}
        horizontal={false}
        fadeSize={10}
        style={styles.scrollView}
        fadeColors={[
          hexToRgba(foofTheme["color-basic-200"], 0.18),
          hexToRgba(foofTheme["color-basic-200"], 0.9),
        ]}
        // startFadeStyle={styles.fadeStyle}
        // endFadeStyle={styles.fadeStyle}
      >
        <Layout level="2">
          <StageList stages={getAllStagesByTourIdQuery(tourId)} />
        </Layout>
      </RNFadedScrollView>
      <Button
        status="basic"
        accessoryLeft={<FontAwesomeIcon icon="add" />}
        style={styles.button}
        onPress={() => router.push("./createManualEtappe?reiseId=`${journeyID}`")}
      >
        Etappe Manuell Eintragen
      </Button>

      {/*<CreateManualTripModal*/}
      {/*  isVisible={modalVisible}*/}
      {/*  onClose={() => setModalVisible(false)}*/}
      {/*  journeyId={journeyId}*/}
      {/*/>*/}
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
  // fadeStyle: {
  //   color: foofDarkTheme["background-basic-color-3"],
  //   backgroundColor: foofDarkTheme["background-basic-color-3"],
  // },
  button: {
    margin: 15,
  },
});
