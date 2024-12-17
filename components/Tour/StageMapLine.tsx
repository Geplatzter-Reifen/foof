import { Location } from "@/database/model/model";
import MapboxGL from "@rnmapbox/maps";
import { lineString, point, featureCollection } from "@turf/helpers";
import { useTheme } from "@ui-kitten/components";
import React from "react";
import type { Feature, FeatureCollection, LineString, Point } from "geojson";

/**
 * StageMapLine component
 *
 * Renders a line on the map representing a stage with dots at the start and end.
 * If the `active` prop is set to true, only the start dot will be shown.
 *
 * @param {Object} props - Component properties.
 * @param {Location[]} props.locations - Array of location objects containing latitude and longitude.
 * @param {string} props.stageId - Unique identifier for the stage (used for layer IDs).
 * @param {boolean} [props.active=false] - If true, shows only the start point (used for active stages).
 * @returns {JSX.Element} A Mapbox shape source with a line and optional start/end points.
 */

type stageMapLineProps = {
  locations: Location[];
  stageId: string;
  active?: boolean;
};
const StageMapLine = ({
  locations,
  stageId,
  active = false,
}: stageMapLineProps) => {
  const theme = useTheme();

  const locationsUnpacked = locations.map((loc) => ({
    latitude: loc.latitude,
    longitude: loc.longitude,
  }));

  const coords = locationsUnpacked.map((location) => [
    location.longitude,
    location.latitude,
  ]);

  // Create individual features
  const stage: Feature<LineString> = lineString(coords, { name: "Stage" });
  const firstPoint: Feature<Point> = point(coords[0], { name: "Start" });
  const lastPoint: Feature<Point> = point(coords[coords.length - 1], {
    name: "End",
  });

  const collection: FeatureCollection = active
    ? featureCollection<Point | LineString>([stage, firstPoint])
    : featureCollection<Point | LineString>([stage, firstPoint, lastPoint]);
  return (
    <MapboxGL.ShapeSource id={`lineSource-${stageId}`} shape={collection}>
      <MapboxGL.LineLayer
        id={`lineLayer-${stageId}`}
        belowLayerID="road-label"
        // aboveLayerID="routeSource"
        style={{
          lineColor: theme["color-primary-500"],
          lineWidth: 4, // Thickness
          lineOpacity: 1, // Transparency
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      <MapboxGL.CircleLayer
        id={`startPointLayer-${stageId}`}
        // aboveLayerID="routeSource"
        filter={["==", "name", "Start"]}
        style={{
          circleColor: theme["color-primary-100"],
          circleRadius: 6, // Size of the circle
          circleStrokeWidth: 2,
          circleStrokeColor: theme["color-primary-500"],
        }}
      />
      <MapboxGL.CircleLayer
        id={`endPointLayer-${stageId}`}
        filter={["==", "name", "End"]}
        // aboveLayerID="routeSource"
        style={{
          circleColor: theme["color-primary-100"],
          circleRadius: 6, // Size of the circle
          circleStrokeWidth: 2,
          circleStrokeColor: theme["color-primary-500"],
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

export default React.memo(StageMapLine);
