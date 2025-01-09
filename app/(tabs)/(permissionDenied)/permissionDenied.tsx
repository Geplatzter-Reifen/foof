import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as Linking from "expo-linking";

const PermissionDenied = () => {
  const openSettings = () => {
    Linking.openSettings(); // Opens the device settings for the app
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Location permission is required to use this app.
      </Text>
      <Button title="Enable Location Permission" onPress={openSettings} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default PermissionDenied;
