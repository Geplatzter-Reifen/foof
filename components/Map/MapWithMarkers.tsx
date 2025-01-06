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

  /**
   * The start coordinate is initialized if coordinates are provided and are numbers.
   * Else, the start coordinate is set to null.
   */
  const [startMarkerCoordinate, setStartMarkerCoordinate] =
    useState<Position | null>(
      initialStartCoordinate &&
        !isNaN(initialStartCoordinate[0]) &&
        !isNaN(initialStartCoordinate[1])
        ? initialStartCoordinate
        : null,
    );

  /**
   * The end coordinate is initialized if coordinates are provided and are numbers.
   * Else, the end coordinate is set to null.
   */
  const [endMarkerCoordinate, setEndMarkerCoordinate] =
    useState<Position | null>(
      initialEndCoordinate &&
        !isNaN(initialEndCoordinate[0]) &&
        !isNaN(initialEndCoordinate[1])
        ? initialEndCoordinate
        : null,
    );

  /**
   * Handles the event when the map is clicked.
   * If the clicked feature is a point, it updates the coordinates.
   * Depending on the current marker index, it sets either the start or end coordinate.
   * @param feature - The clicked feature containing the geometry.
   */
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

  /**
   * Updates the marker coordinates.
   * If the index is 0, the start marker coordinate is updated.
   * If the index is 1, the end marker coordinate is updated.
   * @param index - The index of the marker.
   * @param coordinates - The new coordinates.
   */
  const updateMarkerCoordinate = (index: number, coordinates: Position) => {
    onCoordinateChange(coordinates);
    if (index === 0) {
      setStartMarkerCoordinate(coordinates);
    } else if (index === 1) {
      setEndMarkerCoordinate(coordinates);
    }
  };

  return (
    <Layout style={styles.container}>
      {/** MapboxGL MapView component that displays the map. */}
      <MapboxGL.MapView
        style={styles.map}
        onPress={handleMapPress}
        localizeLabels={true}
        onMapIdle={onMapIdle}
        scaleBarEnabled={false}
        compassEnabled={true}
      >
        {/** MapboxGL Camera component that controls the camera settings of the map. */}
        <MapboxGL.Camera
          centerCoordinate={centerCoordinate}
          zoomLevel={zoomLevel}
          animationDuration={0}
          heading={heading}
          pitch={pitch}
          minZoomLevel={0.1}
        />
        {/** Marker component for the start point, if the start coordinate is set. */}
        {startMarkerCoordinate && (
          <Marker
            id="startMarker"
            coordinate={startMarkerCoordinate}
            markerIndex={0}
            currentIndex={markerIndex}
            onCoordinateChange={updateMarkerCoordinate}
            selectedColor={theme["color-primary-default"]}
          />
        )}
        {/** Marker component for the end point, if the end coordinate is set. */}
        {endMarkerCoordinate && (
          <Marker
            id="endMarker"
            coordinate={endMarkerCoordinate}
            markerIndex={1}
            currentIndex={markerIndex}
            onCoordinateChange={updateMarkerCoordinate}
            selectedColor={theme["color-primary-default"]}
          />
        )}
        {/** StageMapLine component that displays the lines from already existing stages. */}
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
});

export default MapWithMarkers;
