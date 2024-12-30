import { useState } from "react";
import type { Feature, Position } from "geojson";
import { Layout, useTheme } from "@ui-kitten/components";
import MapboxGL from "@rnmapbox/maps";
import Marker from "@/components/Map/Marker";
import { StyleSheet } from "react-native";
import StageMapLine from "@/components/Tour/StageMapLine";
import { Stage, Location } from "@/database/model/model";

type MapWithMarkerProps = {
  markerIndex: number;
  onCoordinateChange: (coordinates: Position) => void;
  initialStartCoordinate?: Position;
  initialEndCoordinate?: Position;
  onMapIdle?: (state: MapboxGL.MapState) => void;
  centerCoordinate?: Position;
  zoomLevel?: number;
  heading?: number;
  pitch?: number;
  stagesWithLocations?: { stage: Stage; locations: Location[] }[];
};

function MapWithMarkers({
  markerIndex,
  onCoordinateChange,
  initialStartCoordinate,
  initialEndCoordinate,
  onMapIdle,
  centerCoordinate,
  zoomLevel,
  heading,
  pitch,
  stagesWithLocations,
}: MapWithMarkerProps) {
  const theme = useTheme();
  centerCoordinate = centerCoordinate || [10.4515, 51.1657]; // Zentrum von Deutschland
  zoomLevel = zoomLevel || 5; // Zoom-Level für Deutschland

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
        onMapIdle={onMapIdle}
        scaleBarEnabled={false}
        compassEnabled={true}
      >
        <MapboxGL.Camera
          centerCoordinate={centerCoordinate}
          zoomLevel={zoomLevel}
          animationDuration={0}
          heading={heading}
          pitch={pitch}
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
        {stagesWithLocations?.map((stage) => {
          if (stage.locations.length <= 1) return;
          return (
            <StageMapLine
              locations={stage.locations}
              stageId={stage.stage.id}
              key={stage.stage.id}
              lineColor={"#b8b8b8"}
              circleColor={"#eaeaea"}
              circleStrokeColor={"#b8b8b8"}
            />
          );
        })}
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
