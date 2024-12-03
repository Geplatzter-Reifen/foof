import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";

import {
  startAutomaticTracking,
  stopAutomaticTracking,
  LOCATION_TASK_NAME,
} from "@/services/tracking";

import MapboxGL from "@rnmapbox/maps";

import { Layout, ButtonGroup } from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BigRoundButton from "@/components/Buttons/BigRoundButton";

MapboxGL.setAccessToken(
  "pk.eyJ1Ijoia2F0emFibGFuY2thIiwiYSI6ImNtM2N4am40cTIyZnkydnNjODBldXR1Y20ifQ.q0I522XSqixPNIe6HwJdOg",
);

enum ButtonStates {
  NotCycling,
  Cycling,
  Paused,
}

export default function HomeScreen() {
  const [latitude, setLatitude] = useState(50.0826); // Default to Wiesbaden
  const [longitude, setLongitude] = useState(8.24); // Default to Wiesbaden
  const [buttonState, setButtonState] = useState(ButtonStates.NotCycling);
  const buttonIconSize = 60;

  useEffect(() => {
    getCurrentLocation();
    TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME).then((result) => {
      if (result) {
        setButtonState(ButtonStates.Cycling);
      }
    });
  }, []);

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
      console.log(coords);

      if (coords) {
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
        console.log(coords);
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

  function StopButton() {
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
  }

  function toggleButtons(buttonState: ButtonStates) {
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
  }

  return (
    <Layout style={styles.container}>
      <Layout style={styles.layout}>
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera
            zoomLevel={13}
            centerCoordinate={[longitude, latitude]}
            animationMode="flyTo"
            animationDuration={2000}
          />
        </MapboxGL.MapView>
      </Layout>
      <View style={styles.button_container}>{toggleButtons(buttonState)}</View>
    </Layout>
  );
}

// Define the styles here
const styles = StyleSheet.create({
  map: {
    flex: 1,
    flexDirection: "row",
  },
  container: {
    flex: 1,
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
});
