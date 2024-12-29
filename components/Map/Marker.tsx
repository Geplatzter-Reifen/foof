import React from "react";
import MapboxGL from "@rnmapbox/maps";
import Icon from "@expo/vector-icons/FontAwesome6";
import type { Feature, Position } from "geojson";

type MarkerProps = {
  id: string;
  coordinate: Position;
  markerIndex: number;
  currentIndex: number;
  selectedColor: string;
  onCoordinateChange: (index: number, coordinates: Position) => void;
};

function Marker({
  id,
  coordinate,
  markerIndex,
  currentIndex,
  selectedColor,
  onCoordinateChange,
}: MarkerProps) {
  return (
    <MapboxGL.PointAnnotation
      id={id}
      coordinate={coordinate}
      key={`${id}-${currentIndex}`}
      draggable={markerIndex === currentIndex}
      anchor={{ x: 0.5, y: 1 }}
      onDragEnd={(feature: Feature) => {
        if (feature.geometry.type === "Point") {
          onCoordinateChange(markerIndex, feature.geometry.coordinates);
        }
      }}
    >
      {markerIndex === currentIndex ? (
        <Icon name="location-dot" size={30} color={selectedColor} />
      ) : (
        <Icon name="location-dot" size={30} color="black" />
      )}
    </MapboxGL.PointAnnotation>
  );
}

export default Marker;
