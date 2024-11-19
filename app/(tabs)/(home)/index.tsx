import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { Layout, Button } from "@ui-kitten/components";
import * as Location from "expo-location";
import {
  startAutomaticTracking,
  stopAutomaticTracking,
} from "@/services/tracking";
import * as TaskManager from "expo-task-manager";

MapboxGL.setAccessToken(
  "pk.eyJ1Ijoia2F0emFibGFuY2thIiwiYSI6ImNtM2N4am40cTIyZnkydnNjODBldXR1Y20ifQ.q0I522XSqixPNIe6HwJdOg",
);

export default function Index() {
  // const latitude = 50.0826;
  // const longitude = 8.24;
  //
  // return (
  //     <View style={styles.container}>
  //       <Layout style={styles.layout}>
  //         <MapboxGL.MapView style={styles.map}>
  //           <MapboxGL.Camera
  //               zoomLevel={12}
  //               centerCoordinate={[longitude, latitude]}
  //               animationMode="flyTo"
  //               animationDuration={2000}
  //           />
  //         </MapboxGL.MapView>
  //       </Layout>
  //     </View>
  // );
  const [tracking, setTracking] = useState(false); //TaskManager.isTaskRegisteredAsync("background-location-task") PROBLEM
  const [latitude, setLatitude] = useState(50.0826); // Default to Wiesbaden
  const [longitude, setLongitude] = useState(8.24); // Default to Wiesbaden
  useEffect(() => {
    getCurrentLocation();
    TaskManager.isTaskRegisteredAsync("background-location-task").then(
      (result) => setTracking(result),
    );
  }, []);

  const changeButton = () => {
    if (!tracking) {
      startAutomaticTracking();
      setTracking(true);
    } else {
      stopAutomaticTracking();
      setTracking(false);
    }
  };

  //get current location
  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log(status);

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

  return (
    <View style={styles.container}>
      <Layout style={styles.layout} level="1">
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera
            zoomLevel={13}
            centerCoordinate={[longitude, latitude]}
            animationMode="flyTo"
            animationDuration={2000}
          />
        </MapboxGL.MapView>
      </Layout>

      <Button style={styles.button} onPress={changeButton}>
        {tracking ? "stop" : "start"}
      </Button>
    </View>
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
  button: {
    position: "absolute",
    bottom: 30, // Position from the bottom of the screen
    alignSelf: "center", // Center the button horizontally
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 90,
  },
});
