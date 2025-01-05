import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Platform, StatusBar } from "react-native";
import * as TaskManager from "expo-task-manager";

import {
  LOCATION_TASK_NAME,
  startAutomaticTracking,
  stopAutomaticTracking,
} from "@/services/tracking";

import MapboxGL, { Camera, UserTrackingMode } from "@rnmapbox/maps";

import {
  ButtonGroup,
  Divider,
  Layout,
  Spinner,
  Text,
  TopNavigation,
} from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BigRoundButton from "@/components/Buttons/BigRoundButton";
import { getActiveTour } from "@/services/data/tourService";
import { withObservables } from "@nozbe/watermelondb/react";
import { Route, Tour } from "@/database/model/model";
import { timeout } from "@/utils/utils";
import { getActiveStage } from "@/services/data/stageService";
import { StageLine } from "@/components/Stage/ActiveStageWrapper";
import SmallIconButton from "@/components/Buttons/SmallIconButton";

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY ?? null);

enum ButtonStates {
  NotCycling,
  Cycling,
  Paused,
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true); // Ladezustand

  const [activeTour, setActiveTour] = useState<Tour>();
  const [activeStageId, setActiveStageId] = useState<string | null>();

  const [buttonState, setButtonState] = useState(ButtonStates.NotCycling);
  const [userCentered, setUserCentered] = useState(true); // Status: Ist die Kamera grade auf dem User zentriert?

  const camera = useRef<Camera>(null);
  const buttonIconSize = 60;

  let geoJSON: GeoJSON.FeatureCollection | undefined = undefined;

  useEffect(() => {
    const prepare = async () => {
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
        onPress={() => {
          setButtonState(ButtonStates.Cycling);
          startAutomaticTracking().then(() =>
            getActiveStage().then((stage) => {
              setActiveStageId(stage?.id!);
            }),
          );
        }}
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

  const StopButton = () => {
    return (
      <BigRoundButton
        icon={
          <FontAwesomeIcon icon="stop" size={buttonIconSize} color="white" />
        }
        onPress={() => {
          setButtonState(ButtonStates.NotCycling);
          void stopAutomaticTracking();
          setActiveStageId(null);
        }}
      />
    );
  };

  // Function to display the route on the map by adjusting the camera to fit the route's bounds
  const showRoute = async () => {
    if (!geoJSON) {
      throw new Error("Keine Route importiert!");
    }

    setUserCentered(false);
    // Find the outermost coordinates
    let minLat = Infinity,
      maxLat = -Infinity,
      minLng = Infinity,
      maxLng = -Infinity;
    geoJSON.features.forEach((feature) => {
      if (feature.geometry.type === "LineString") {
        (feature.geometry as GeoJSON.LineString).coordinates.forEach(
          ([lng, lat]) => {
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
            if (lng < minLng) minLng = lng;
            if (lng > maxLng) maxLng = lng;
          },
        );
      } else if (feature.geometry.type === "Point") {
        const [lng, lat] = (feature.geometry as GeoJSON.Point).coordinates;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
      }
    });

    const bounds = {
      ne: [maxLng, maxLat],
      sw: [minLng, minLat],
    };

    camera.current?.setCamera({
      bounds: bounds,
      padding: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        paddingBottom: 150,
      },
      animationDuration: 2000,
      heading: 0,
      animationMode: "flyTo",
    });
  };

  const CenterButton = () => (
    <SmallIconButton
      icon="location-crosshairs"
      style={styles.mapButton}
      onPress={() => setUserCentered(true)}
    />
  );

  const RouteButton = ({ routeCount }: { routeCount: number }) => {
    if (routeCount === 0) {
      return null;
    }
    return (
      <SmallIconButton
        icon="route"
        style={[styles.mapButton, styles.routeButton]}
        onPress={async () => {
          setUserCentered(false);
          await timeout(100);
          showRoute();
        }}
      />
    );
  };

  const enhance = withObservables(["tour"], ({ tour }: { tour: Tour }) => ({
    routeCount: tour.routes.observeCount(),
  }));

  const EnhancedRouteButton = enhance(RouteButton);

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

  const ShapeSource = ({ route }: { route: Route }) => {
    geoJSON = JSON.parse(route.geoJson);
    return (
      <MapboxGL.ShapeSource shape={geoJSON} id="routeSource">
        <MapboxGL.LineLayer
          id="routeLayer"
          belowLayerID="road-label"
          style={{
            lineColor: "#b8b8b8",
            lineWidth: 5,
            lineJoin: "round",
            lineCap: "round",
          }}
        />
        <MapboxGL.CircleLayer
          id="pointLayer"
          filter={["==", "$type", "Point"]}
          style={{
            circleColor: "black",
            circleRadius: 5,
          }}
        />
      </MapboxGL.ShapeSource>
    );
  };

  // observe the route (tracks updates to the route)
  const enhanceV1 = withObservables(
    ["route"],
    ({ route }: { route: Route }) => ({
      route,
    }),
  );

  const EnhancedShapeSource = enhanceV1(ShapeSource);

  // observe routes of a tour (only tracks create and delete in the routes table)
  const Bridge = ({ routes }: { routes: Route[] }) => {
    if (routes.length === 0) return null;
    return <EnhancedShapeSource route={routes[0]} />;
  };

  const enhanceV2 = withObservables(["tour"], ({ tour }: { tour: Tour }) => ({
    routes: tour.routes,
  }));

  const EnhancedShapeSourceV2 = enhanceV2(Bridge);

  if (loading) {
    return (
      <Layout level="2" style={styles.loadingContainer}>
        <Spinner size="giant" />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <Layout style={styles.layout}>
        {/* Karte mit Einstellungen: - keine Skala - Kompass oben rechts - Postion von "mapbox" - Position des Info-Buttons (siehe https://github.com/rnmapbox/maps/blob/main/docs/MapView.md) */}
        <MapboxGL.MapView
          style={styles.map}
          scaleBarEnabled={false}
          compassEnabled={true}
          compassPosition={{ top: 8, right: 8 }}
          logoPosition={{ top: 8, left: 8 }}
          attributionPosition={{ top: 8, left: 96 }}
          onTouchMove={() => {
            setUserCentered(false);
          }}
        >
          {activeTour && <EnhancedShapeSourceV2 tour={activeTour} />}
          {activeStageId && <StageLine stageId={activeStageId} />}
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
      <View style={styles.mapButtonsContainer}>
        {/* Button zum Route anzeigen */}
        {activeTour && <EnhancedRouteButton tour={activeTour} />}
        {/* Button zum Zentrieren der Karte auf den User */}
        {!userCentered && <CenterButton />}
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
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
    top: 175,
    right: 11,
  },
  mapButton: {
    backgroundColor: "#fff",
  },
  routeButton: {
    marginBottom: 11,
  },
});
