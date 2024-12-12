import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ImageProps,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";

import {
  LOCATION_TASK_NAME,
  startAutomaticTracking,
  stopAutomaticTracking,
} from "@/services/tracking";

import MapboxGL, { Camera, UserTrackingMode } from "@rnmapbox/maps";

import {
  Layout,
  ButtonGroup,
  Spinner,
  Icon,
  TopNavigation,
  Divider,
  Text,
} from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BigRoundButton from "@/components/Buttons/BigRoundButton";
import { getActiveTour } from "@/services/data/tourService";
import { withObservables } from "@nozbe/watermelondb/react";
import { Route, Tour } from "@/database/model/model";
import { timeout } from "@/utils/utils";
import { getActiveStage } from "@/services/data/stageService";
import { StageLine } from "@/components/Stage/ActiveStageWrapper";
import { calculateBounds } from "@/utils/locationUtil";
import type { FeatureCollection } from "geojson";

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY ?? null);

enum ButtonStates {
  NotCycling,
  Cycling,
  Paused,
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true); // Ladezustand
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [buttonState, setButtonState] = useState(ButtonStates.NotCycling);
  const [activeTour, setActiveTour] = useState<Tour>();
  const [userCentered, setUserCentered] = useState(true);
  const buttonIconSize = 60;
  const camera = useRef<Camera>(null);

  let geoJSON: FeatureCollection | undefined = undefined;
  const [activeStageId, setActiveStageId] = useState<string | null>();

  useEffect(() => {
    const prepare = async () => {
      await getCurrentLocation();
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
    prepare();
  }, [activeTour]);

  const requestPermissionsAsync = async () => {
    return await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
  };

  //get current location
  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log(status);
    const { status: notificationStatus } = await requestPermissionsAsync();
    console.log(notificationStatus);

    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Allow the app to use location services",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
      );
      return; // Exit the function if permission is not granted
    }

    try {
      const { coords } = await Location.getCurrentPositionAsync();
      if (coords) {
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
      }
    } catch (error) {
      console.log("Error getting location:", error);
    }
  };

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
  const fitRouteInCam = () => {
    if (!geoJSON) {
      throw new Error("Keine Route importiert!");
    }
    setUserCentered(false);
    const bounds = calculateBounds(geoJSON);

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

  const CenterButton = (props?: Partial<ImageProps>) => (
    <TouchableOpacity
      style={styles.centerButton}
      onPress={() => setUserCentered(true)}
    >
      <Icon
        {...props}
        name="location-crosshairs"
        style={[props?.style, { height: 23 }]}
      />
    </TouchableOpacity>
  );

  const RouteButton = (props?: Partial<ImageProps>) => (
    <TouchableOpacity
      style={styles.routeButton}
      onPress={async () => {
        setUserCentered(false);
        await timeout(100);
        fitRouteInCam();
      }}
    >
      <Icon {...props} name="route" style={[props?.style, { height: 22 }]} />
    </TouchableOpacity>
  );

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

  const RenderRoute = ({ route }: { route: Route }) => {
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
  const enhance = withObservables(["route"], ({ route }: { route: Route }) => ({
    route,
  }));

  const EnhancedRenderRoute = enhance(RenderRoute);

  const Bridge = ({ routes }: { routes: Route[] }) => {
    if (routes.length === 0) return null;
    return <EnhancedRenderRoute route={routes[0]} />;
  };

  // observe routes of a tour (only tracks create and delete in the routes table)
  const enhanceV2 = withObservables(["tour"], ({ tour }: { tour: Tour }) => ({
    routes: tour.routes,
  }));

  const EnhancedRenderRouteV2 = enhanceV2(Bridge);

  if (loading) {
    return (
      <Layout level="2" style={styles.loadingContainer}>
        <Spinner size="giant" />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <Layout>
        <TopNavigation
          title={() => <Text category="h4">Home</Text>}
          style={styles.header}
          alignment="center"
        ></TopNavigation>
        <Divider />
      </Layout>
      <Layout style={styles.layout}>
        <MapboxGL.MapView
          style={styles.map}
          scaleBarEnabled={false}
          localizeLabels={{ locale: "current" }}
          compassEnabled={true}
          compassPosition={{ top: 8, right: 8 }}
          logoPosition={{ top: 8, left: 8 }}
          attributionPosition={{ top: 8, left: 96 }}
          onTouchMove={() => {
            setUserCentered(false);
          }}
        >
          {activeTour && <EnhancedRenderRouteV2 tour={activeTour} />}
          {activeStageId && <StageLine stageId={activeStageId} />}
          <MapboxGL.Camera ref={camera} />
          <MapboxGL.Camera
            defaultSettings={{
              centerCoordinate: [longitude, latitude],
              zoomLevel: 14,
            }}
            followZoomLevel={17}
            animationMode="flyTo"
            followUserMode={UserTrackingMode.Follow}
            followUserLocation={userCentered}
            ref={camera}
          />
          <MapboxGL.UserLocation androidRenderMode="gps" />
        </MapboxGL.MapView>
      </Layout>
      <View style={styles.mapButtonsContainer}>
        <RouteButton />
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
  centerButton: {
    backgroundColor: "#fff",
    width: 44,
    height: 44,
    borderRadius: 22,
    elevation: 3,
    padding: 10.5,
  },
  routeButton: {
    backgroundColor: "#fff",
    width: 44,
    height: 44,
    borderRadius: 22,
    elevation: 3,
    padding: 10.5,
    marginBottom: 10,
  },
});
