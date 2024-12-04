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
import * as Notifications from "expo-notifications";

import {
  startAutomaticTracking,
  stopAutomaticTracking,
  LOCATION_TASK_NAME,
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
import { getActiveTour } from "@/services/data/tourService";
import { withObservables } from "@nozbe/watermelondb/react";
import { Route, Tour } from "@/model/model";

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY ?? null);

enum ButtonStates {
  NotCycling,
  Cycling,
  Paused,
}

export default function HomeScreen() {
  const [latitude, setLatitude] = useState(50.0826); // Default to Wiesbaden
  const [longitude, setLongitude] = useState(8.24); // Default to Wiesbaden
  const [buttonState, setButtonState] = useState(ButtonStates.NotCycling);
  const [activeTour, setActiveTour] = useState<Tour>();
  const buttonIconSize = 60;
  const camera = useRef<Camera>(null);

  let geoJSON: GeoJSON.FeatureCollection | undefined = undefined;

  useEffect(() => {
    void getCurrentLocation();
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
  }, []);

  useEffect(() => {
    camera.current?.setCamera({
      centerCoordinate: [longitude, latitude],
      zoomLevel: 13,
      animationDuration: 2000,
      animationMode: "flyTo",
    });
  }, [latitude, longitude]);

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
          void startAutomaticTracking();
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
        }}
      />
    );
  };

  // Function to display the route on the map by adjusting the camera to fit the route's bounds
  const showRoute = async () => {
    if (geoJSON) {
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
