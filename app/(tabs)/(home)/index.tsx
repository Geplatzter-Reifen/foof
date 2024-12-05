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
import { Route, Tour } from "@/model/model";
import { sleepAsync } from "expo-dev-launcher/bundle/functions/sleepAsync";
import { getTourRoute } from "@/services/data/routeService";

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
  const [loading, setLoading] = useState(true); // Ladezustand
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [buttonState, setButtonState] = useState(ButtonStates.NotCycling);
  const [activeTour, setActiveTour] = useState<Tour>();
  const [userCentered, setUserCentered] = useState(true);
  const [geoJSON, setGeoJson] = useState<
    GeoJSON.FeatureCollection | undefined
  >();
  const buttonIconSize = 60;
  const camera = useRef<Camera>(null);

  //let geoJSON: GeoJSON.FeatureCollection | undefined = undefined;

  useEffect(() => {
    const prepare = async () => {
      await getCurrentLocation();
      TaskManager.isTaskRegisteredAsync("background-location-task").then(
        (result) => setTracking(result),
      );
      getActiveTour().then((tour) => {
        if (tour) {
          setActiveTour(tour);
        }
      });
      if (activeTour) {
        const route = await getTourRoute(activeTour.id);
        if (route) {
          setGeoJson(JSON.parse(route.geoJson));
        }
      }
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
    }
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
        await sleepAsync(100);
        showRoute();
      }}
    >
      <Icon {...props} name="route" style={[props?.style, { height: 23 }]} />
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

  const ShapeSource = ({ route }: { route: Route }) => {
    setGeoJson(JSON.parse(route.geoJson));
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

  if (loading) {
    return (
      <Layout level="2" style={styles.container}>
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
          {activeTour && <EnhancedShapeSourceV2 tour={activeTour} />}
          <MapboxGL.Camera
            defaultSettings={{
              centerCoordinate: [longitude, latitude],
              zoomLevel: 14,
            }}
            followZoomLevel={17}
            animationMode="flyTo"
            followUserMode={UserTrackingMode.FollowWithCourse}
            followUserLocation={userCentered}
            ref={camera}
          />
          <MapboxGL.UserLocation
            androidRenderMode="gps"
            showsUserHeadingIndicator={true}
          />
        </MapboxGL.MapView>
      </Layout>
      <View style={styles.mapButtonsContainer}>
        {geoJSON && <RouteButton />}
        {!userCentered && <CenterButton />}
      </View>
      <View style={styles.button_container}>{toggleButtons(buttonState)}</View>
    </Layout>
  );
}

const styles = StyleSheet.create({
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
