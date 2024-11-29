import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ImageProps,
  Platform,
  StatusBar,
} from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import {
  startAutomaticTracking,
  stopAutomaticTracking,
} from "@/services/tracking";
import MapboxGL, { Camera } from "@rnmapbox/maps";
import {
  Layout,
  ButtonGroup,
  IconElement,
  Icon,
  TopNavigation,
  Divider,
  TopNavigationAction,
  Text,
} from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BigRoundButton from "@/components/Buttons/BigRoundButton";
import { getActiveTour } from "@/model/database_functions";
import { withObservables } from "@nozbe/watermelondb/react";
import { Route, Tour } from "@/model/model";

void MapboxGL.setAccessToken(
  "pk.eyJ1Ijoia2F0emFibGFuY2thIiwiYSI6ImNtM2N4am40cTIyZnkydnNjODBldXR1Y20ifQ.q0I522XSqixPNIe6HwJdOg",
);

enum ButtonStates {
  NotCycling,
  Cycling,
  Paused,
}

export default function HomeScreen() {
  const [, setTracking] = useState(false); //TaskManager.isTaskRegisteredAsync("background-location-task") PROBLEM
  const [latitude, setLatitude] = useState(50.0826); // Default to Wiesbaden
  const [longitude, setLongitude] = useState(8.24); // Default to Wiesbaden
  const [buttonState, setButtonState] = useState(ButtonStates.NotCycling);
  const [activeTour, setActiveTour] = useState<Tour>();
  const buttonIconSize = 60;
  const camera = useRef<Camera>(null);

  let geoJSON: GeoJSON.FeatureCollection | undefined = undefined;

  useEffect(() => {
    void getCurrentLocation();
    TaskManager.isTaskRegisteredAsync("background-location-task").then(
      (result) => setTracking(result),
    );
    getActiveTour().then((tour) => {
      if (tour) {
        setActiveTour(tour);
      }
    });
  }, []);

  useEffect(() => {
    camera.current?.setCamera({
      centerCoordinate: [longitude, latitude],
      zoomLevel: 13,
      animationDuration: 2000,
      animationMode: "flyTo",
    });
  }, [latitude, longitude]);

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
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
          startAutomaticTracking();
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
          stopAutomaticTracking();
        }}
      />
    );
  };

  const showRoute = () => {
    if (geoJSON) {
      const pointFeatures = geoJSON.features.filter(
        (feature) => feature.geometry.type === "Point",
      );

      if (pointFeatures.length > 1) {
        const startPoint = (pointFeatures[0].geometry as GeoJSON.Point)
          .coordinates;
        const endPoint = (
          pointFeatures[pointFeatures.length - 1].geometry as GeoJSON.Point
        ).coordinates;

        camera.current?.fitBounds(startPoint, endPoint, [25, 25], 1000);
      }
    }
  };

  const RouteIcon = (props?: Partial<ImageProps>): IconElement => (
    <Icon
      {...props}
      name="route"
      style={[props?.style, { height: 40, width: "auto" }]}
    />
  );

  const renderRouteAction = (): React.ReactElement => (
    <TopNavigationAction icon={RouteIcon} onPress={showRoute} hitSlop={15} />
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

  const ShapeSource = ({ route }: { route: Route }) => {
    geoJSON = JSON.parse(route.geoJson);
    return (
      <MapboxGL.ShapeSource
        id="route"
        shape={geoJSON}
        onPress={() => console.log("test")}
      >
        <MapboxGL.LineLayer
          id="route"
          belowLayerID="road-label"
          style={{ lineColor: "blue", lineWidth: 5, lineJoin: "round" }}
        />
        <MapboxGL.CircleLayer
          id="pointLayer"
          filter={["==", "$type", "Point"]}
          style={{
            circleColor: "gray",
            circleRadius: 6,
          }}
        />
      </MapboxGL.ShapeSource>
    );
  };

  // observe the route (tracks updates to the route)
  const enhance = withObservables(["route"], ({ route }: { route: Route }) => ({
    route,
  }));

  const EnhancedShapeSource = enhance(ShapeSource);

  // observe routes of a tour (only tracks create and delete in the routes table)
  const Bridge = ({ routes }: { routes: Route[] }) => {
    if (routes.length === 0) return null;
    return <EnhancedShapeSource route={routes[0]} />;
  };

  const enhanceV2 = withObservables(["tour"], ({ tour }: { tour: Tour }) => ({
    routes: tour.routes,
  }));

  const EnhancedShapeSourceV2 = enhanceV2(Bridge);

  return (
    <Layout style={styles.container}>
      <Layout>
        <TopNavigation
          title={() => <Text category="h4">Home</Text>}
          accessoryRight={renderRouteAction}
          style={styles.header}
          alignment="center"
        ></TopNavigation>
        <Divider />
      </Layout>
      <Layout style={styles.layout}>
        <MapboxGL.MapView style={styles.map}>
          {activeTour && <EnhancedShapeSourceV2 tour={activeTour} />}
          <MapboxGL.Camera ref={camera} />
        </MapboxGL.MapView>
      </Layout>
      <View style={styles.button_container}>{toggleButtons(buttonState)}</View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    flexDirection: "row",
  },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  header: {
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
});
