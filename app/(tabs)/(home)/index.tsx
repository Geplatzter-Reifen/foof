import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";

import * as Location from "expo-location";

import BigRoundButton from "@/components/Buttons/BigButton";

import MapboxGL from "@rnmapbox/maps";

import { Layout, Button, ButtonGroup } from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

MapboxGL.setAccessToken(
  "pk.eyJ1Ijoia2F0emFibGFuY2thIiwiYSI6ImNtM2N4am40cTIyZnkydnNjODBldXR1Y20ifQ.q0I522XSqixPNIe6HwJdOg",
);
enum ButtonStates {
  NotCycling,
  Cycling,
  Paused,
}

export default function HomeScreen() {
  const [tracking, setTracking] = useState(false); //TaskManager.isTaskRegisteredAsync("background-location-task") PROBLEM
  const [latitude, setLatitude] = useState(50.0826); // Default to Wiesbaden
  const [longitude, setLongitude] = useState(8.24); // Default to Wiesbaden
  const [buttonState, setButtonState] = useState(ButtonStates.NotCycling);

  const StartButton = () => {
    return (
      <BigRoundButton
        icon={<FontAwesomeIcon icon="play" size={50} />}
        onPress={() => setButtonState(ButtonStates.Cycling)}
      />
    );
  };

  const PauseButton = () => {
    return (
      <BigRoundButton
        icon={<FontAwesomeIcon icon="pause" size={50} />}
        onPress={() => setButtonState(ButtonStates.Paused)}
      />
    );
  };

  function StopButton() {
    return (
      <BigRoundButton
        icon={<FontAwesomeIcon icon="stop" size={50} />}
        onPress={() => setButtonState(ButtonStates.NotCycling)}
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
            {StartButton()}
            {StopButton()}
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
    margin: 5,
    marginBottom: 45,
    borderRadius: 20,
    height: 600,
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

    bottom: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  button: {
    borderRadius: 360,
    alignSelf: "center",
  },
});
