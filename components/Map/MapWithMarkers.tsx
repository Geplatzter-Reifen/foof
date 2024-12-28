import { useState } from "react";
import type { Feature, Position } from "geojson";
import { Layout, useTheme } from "@ui-kitten/components";
import MapboxGL from "@rnmapbox/maps";
import Marker from "@/components/Map/Marker";
import { StyleSheet } from "react-native";

type MapWithMarkerProps = {
  markerIndex: number;
  onCoordinateChange: (coordinates: Position) => void;
  initialStartCoordinate?: Position;
  initialEndCoordinate?: Position;
};

function MapWithMarkers({
  markerIndex,
  onCoordinateChange,
  initialStartCoordinate,
  initialEndCoordinate,
}: MapWithMarkerProps) {
  const theme = useTheme();

  const [startMarkerCoordinate, setStartMarkerCoordinate] =
    useState<Position | null>(
      initialStartCoordinate &&
        !isNaN(initialStartCoordinate[0]) &&
        !isNaN(initialStartCoordinate[1])
        ? initialStartCoordinate
        : null,
    );

  const [endMarkerCoordinate, setEndMarkerCoordinate] =
    useState<Position | null>(
      initialEndCoordinate &&
        !isNaN(initialEndCoordinate[0]) &&
        !isNaN(initialEndCoordinate[1])
        ? initialEndCoordinate
        : null,
    );

  const handleMapPress = (feature: Feature) => {
    const geometry = feature.geometry;
    if (geometry.type === "Point") {
      onCoordinateChange(geometry.coordinates);
      if (markerIndex === 0) {
        setStartMarkerCoordinate(geometry.coordinates);
      } else if (markerIndex === 1) {
        setEndMarkerCoordinate(geometry.coordinates);
      }
    }
  };

  const setCoordinate = (index: number, coordinates: Position) => {
    onCoordinateChange(coordinates);
    if (index === 0) {
      setStartMarkerCoordinate(coordinates);
    } else if (index === 1) {
      setEndMarkerCoordinate(coordinates);
    }
  };

  return (
    <Layout style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        onPress={handleMapPress}
        localizeLabels={true}
      >
        <MapboxGL.Camera
          centerCoordinate={[10.4515, 51.1657]} // Zentrum von Deutschland
          zoomLevel={5} // Zoom-Level für Deutschland
          animationDuration={0}
        />
        {startMarkerCoordinate && (
          <Marker
            id="startMarker"
            coordinate={startMarkerCoordinate}
            markerIndex={0}
            currentIndex={markerIndex}
            onCoordinateChange={setCoordinate}
            selectedColor={theme["color-primary-default"]}
          />
        )}
        {endMarkerCoordinate && (
          <Marker
            id="endMarker"
            coordinate={endMarkerCoordinate}
            markerIndex={1}
            currentIndex={markerIndex}
            onCoordinateChange={setCoordinate}
            selectedColor={theme["color-primary-default"]}
          />
        )}
      </MapboxGL.MapView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    flexDirection: "row",
  },
  markerContainer: {
    alignItems: "center",
  },
  marker: {
    width: 20,
    height: 20,
    backgroundColor: "red",
    borderRadius: 10,
  },
});

export default MapWithMarkers;
