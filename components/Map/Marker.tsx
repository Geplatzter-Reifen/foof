import React from "react";
import MapboxGL from "@rnmapbox/maps";
import Icon from "@expo/vector-icons/FontAwesome6";
import type { Feature } from "geojson";

type MarkerProps = {
  id: string;
  coordinate: [number, number];
  markerIndex: number;
  currentIndex: number;
  setCoordinate: (coordinates: [number, number]) => void;
  selectedColor: string;
};

function Marker({
  id,
  coordinate,
  markerIndex,
  currentIndex,
  setCoordinate,
  selectedColor,
}: MarkerProps) {
  return (
    <MapboxGL.PointAnnotation
      id={id}
      coordinate={coordinate}
      key={`${id}-${currentIndex}`}
      draggable={markerIndex === currentIndex}
      onDragEnd={(feature: Feature) => {
        setCoordinate(feature.geometry.coordinates as [number, number]);
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
