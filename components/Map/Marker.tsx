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
    /**
     * MapboxGL PointAnnotation component that represents a draggable marker on the map.
     * - id: Unique identifier for the marker.
     * - coordinate: The coordinate where the marker is placed.
     * - key: Unique key for the marker, so react can differentiate between markers.
     * - draggable: Determines if the marker is draggable based on the selected marker index.
     * - anchor: Sets the anchor point of the marker. This ensures that the marker
     *   is positioned so that its tip is exactly at the specified coordinate
     * - onDragEnd: Event handler for when the marker drag ends, updating the coordinates.
     */
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
        <Icon name="location-dot" size={30} color="#373737" />
      )}
    </MapboxGL.PointAnnotation>
  );
}

export default Marker;
