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
import TourStats from "@/components/Statistics/TourStats";

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
      {tour ? (
        <TourStats
          startDate={tour?.startedAt}
          endDate={tour?.finishedAt}
          distance={0}
          elevation={0}
          speed={0}
          calories={0}
        />
      ) : null}
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
        onPress={() => setModalVisible(true)}
        accessoryLeft={<FontAwesomeIcon icon="add" />}
        style={styles.button}
      >
        Etappe Manuell Eintragen
      </Button>

      <CreateManualStageModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        tourId={tourId}
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
