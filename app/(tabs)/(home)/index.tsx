import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import { EnhancedRenderRouteV2 } from "@/components/Route/RenderRoute";

import {
  LOCATION_TASK_NAME,
  startAutomaticTracking,
  stopAutomaticTracking,
} from "@/services/tracking";
import MapboxGL, { Camera, UserTrackingMode } from "@rnmapbox/maps";

import { ButtonGroup, Layout, Spinner } from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BigRoundButton from "@/components/Buttons/BigRoundButton";
import { getActiveTour } from "@/services/data/tourService";
import { Stage, Tour } from "@/database/model/model";
import { timeout } from "@/utils/utils";
import { getActiveStage } from "@/services/data/stageService";
import MapStatisticsBox from "@/components/Statistics/LiveStats";
import {
  CenterButton,
  EnhancedRouteButton,
} from "@/components/Buttons/MapButtons";
import { fitRouteInCam } from "@/utils/camUtils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import { EnhancedStageMapLines } from "@/components/Tour/StageMapLine";

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY ?? null);

enum ButtonStates {
  NotCycling,
  Cycling,
  Paused,
}

export default function HomeScreen() {
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true); // Ladezustand

  const [activeTour, setActiveTour] = useState<Tour>();
  const [activeStage, setActiveStage] = useState<Stage | null>();
  const [activeStageId, setActiveStageId] = useState<string | null>();

  const [buttonState, setButtonState] = useState(ButtonStates.NotCycling);
  const [userCentered, setUserCentered] = useState(true); // Status: Ist die Kamera grade auf dem User zentriert?

  const camera = useRef<Camera>(null);
  const buttonIconSize = 60;

  useEffect(() => {
    const prepare = async () => {
      await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME).then((result) => {
        if (result) {
          setButtonState(ButtonStates.Cycling);
        }
      });
      getActiveTour().then((tour) => {
        if (tour) {
          setActiveTour(tour);
        }
      });

      setLoading(false);
    };
    void prepare();
  }, [activeTour]);

  const StartButton = () => {
    return (
      <BigRoundButton
        icon={
          <FontAwesomeIcon
            transform="right-1"
            icon="play"
            size={buttonIconSize}
            color="white"
          />
        }
        onPress={onStartButtonPress}
      />
    );
  };

  const PauseButton = () => {
    return (
      <BigRoundButton
        icon={
          <FontAwesomeIcon icon="pause" size={buttonIconSize} color="white" />
        }
        onPress={() => setButtonState(ButtonStates.Paused)}
      />
    );
  };

  const onStartButtonPress = async () => {
    setButtonState(ButtonStates.Cycling);
    startAutomaticTracking().then(() => {
      getActiveStage().then((stage) => {
        setActiveStageId(stage?.id!);
      });
      getActiveStage().then((stage) => {
        if (stage) {
          setActiveStage(stage);
        }
      });
    });
  };

  const onStopButtonPress = async () => {
    setButtonState(ButtonStates.NotCycling);
    const isFinished = await stopAutomaticTracking();
    setActiveStageId(null);
    setActiveStage(null);
    router.navigate({ pathname: "../(touren)" });
    await timeout(10);
    // @ts-ignore Typescript erwartet "never"
    navigation.navigate("(touren)", {
      screen: "stage",
      params: { stageId: activeStageId },
      initial: false,
    });
    setActiveStageId(null);
    if (isFinished) {
      Alert.alert("Tour beendet", "Herzlichen Glückwunsch!");
    }
  };

  const StopButton = () => {
    return (
      <BigRoundButton
        icon={
          <FontAwesomeIcon icon="stop" size={buttonIconSize} color="white" />
        }
        onPress={onStopButtonPress}
      />
    );
  };

  const toggleButtons = (buttonState: ButtonStates) => {
    switch (buttonState) {
      case ButtonStates.NotCycling:
        return StartButton();
      case ButtonStates.Cycling:
        return PauseButton();
      case ButtonStates.Paused:
        return (
          <ButtonGroup>
            {StopButton()}
            {StartButton()}
          </ButtonGroup>
        );
    }
  };

  if (loading) {
    return (
      <Layout level="2" style={styles.loadingContainer}>
        <Spinner size="giant" />
      </Layout>
    );
  }

  return (
    <Layout style={{ ...styles.container, ...{ marginTop: insets.top } }}>
      <Layout style={styles.layout}>
        {/* Karte mit Einstellungen: - keine Skala - Kompass oben rechts - Postion von "mapbox" - Position des Info-Buttons (siehe https://github.com/rnmapbox/maps/blob/main/docs/MapView.md) */}
        <MapboxGL.MapView
          style={styles.map}
          scaleBarEnabled={false}
          localizeLabels={true}
          compassEnabled={true}
          compassPosition={{ top: activeStage ? 113 : 8, right: 8 }}
          logoPosition={{ top: activeStage ? 113 : 8, left: 8 }}
          attributionPosition={{ top: activeStage ? 113 : 8, left: 96 }}
          onTouchMove={() => {
            setUserCentered(false);
          }}
        >
          {/* renders the route of the active tour on the map */}
          {activeTour && (
            <>
              <EnhancedRenderRouteV2 tour={activeTour} />
              <EnhancedStageMapLines tour={activeTour} />
            </>
          )}
          {/* Kamera, die dem User folgt */}
          <MapboxGL.Camera
            followZoomLevel={17}
            animationMode="flyTo"
            followUserMode={UserTrackingMode.Follow}
            followUserLocation={userCentered}
            ref={camera}
          />
          {/* Blauer Punkt */}
          <MapboxGL.UserLocation androidRenderMode="gps" />
        </MapboxGL.MapView>
      </Layout>
      {activeStage && (
        <View style={styles.statisticsBox}>
          <MapStatisticsBox stage={activeStage} />
        </View>
      )}
      <View
        style={{
          ...styles.mapButtonsContainer,
          top: activeStage ? 166 : 65,
          right: 11,
        }}
      >
        {/* Button zum Route anzeigen */}
        {activeTour && (
          <EnhancedRouteButton
            tour={activeTour}
            onPress={async () => {
              setUserCentered(false);
              await timeout(100);
              fitRouteInCam(activeTour, camera);
            }}
          />
        )}
        {/* Button zum Zentrieren der Karte auf den User */}
        {!userCentered && (
          <CenterButton onPress={() => setUserCentered(true)} />
        )}
      </View>
      <View style={styles.button_container}>{toggleButtons(buttonState)}</View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  map: {
    flex: 1,
    flexDirection: "row",
  },
  header: {
    flexDirection: "column",
  },
  layout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button_container: {
    position: "absolute",
    flexDirection: "row",
    alignSelf: "center",
    bottom: 15,
  },
  mapButtonsContainer: {
    position: "absolute",
    flexDirection: "column",
    alignSelf: "center",
  },
  statisticsBox: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
  },
});
