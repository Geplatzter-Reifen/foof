import { Location } from "@/database/model/model";
import MapboxGL from "@rnmapbox/maps";
import { lineString, point, featureCollection } from "@turf/helpers";
import { useTheme } from "@ui-kitten/components";
import React from "react";
import type { Feature, FeatureCollection, LineString, Point } from "geojson";

type stageMapLineProps = {
  locations: Location[];
  stageId: string;
  active?: boolean;
  lineColor?: string;
  circleColor?: string;
  circleStrokeColor?: string;
};
const StageMapLine = ({
  locations,
  stageId,
  active = false,
  lineColor,
  circleColor,
  circleStrokeColor,
}: stageMapLineProps) => {
  const theme = useTheme();

  lineColor = lineColor || theme["color-primary-500"];
  circleColor = circleColor || theme["color-primary-100"];
  circleStrokeColor = circleStrokeColor || theme["color-primary-500"];

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
          lineColor: lineColor,
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
          circleColor: circleColor,
          circleRadius: 6, // Size of the circle
          circleStrokeWidth: 2,
          circleStrokeColor: circleStrokeColor,
        }}
      />
      <MapboxGL.CircleLayer
        id={`endPointLayer-${stageId}`}
        filter={["==", "name", "End"]}
        // aboveLayerID="routeSource"
        style={{
          circleColor: circleColor,
          circleRadius: 6, // Size of the circle
          circleStrokeWidth: 2,
          circleStrokeColor: circleStrokeColor,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

export default React.memo(StageMapLine);
