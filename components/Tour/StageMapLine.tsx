import { Location } from "@/database/model/model";
import MapboxGL from "@rnmapbox/maps";
import { lineString, point, featureCollection } from "@turf/helpers";
import { useTheme } from "@ui-kitten/components";
import React from "react";
import type { FeatureCollection, LineString, Point } from "geojson";

type stageMapLineProps = {
  locations?: Location[]; // Optional, for location-based input
  routeGeoJSON?: FeatureCollection; // Optional, for direct GeoJSON input
  stageId: string;
  active?: boolean;
  planed?: boolean;
};

const StageMapLine = ({
  locations,
  routeGeoJSON,
  stageId,
  active = false,
  planed = false,
}: stageMapLineProps) => {
  const theme = useTheme();

  // If GeoJSON is provided, use it directly
  let collection: FeatureCollection;
  if (routeGeoJSON) {
    collection = routeGeoJSON;
  } else if (locations) {
    // If locations are provided, generate GeoJSON
    const locationsUnpacked = locations.map((loc) => ({
      latitude: loc.latitude,
      longitude: loc.longitude,
    }));

    const coords = locationsUnpacked.map((location) => [
      location.longitude,
      location.latitude,
    ]);

    const stage = lineString(coords, { name: "Stage" });
    const firstPoint = point(coords[0], { name: "Start" });
    const lastPoint = point(coords[coords.length - 1], { name: "End" });

    collection = active
      ? featureCollection<Point | LineString>([stage, firstPoint])
      : featureCollection<Point | LineString>([stage, firstPoint, lastPoint]);
  } else {
    throw new Error("Either 'locations' or 'routeGeoJSON' must be provided.");
  }

  // Define dynamic colors based on the `planed` parameter
  const lineColor = planed
    ? theme["color-basic-400"]
    : theme["color-primary-500"];
  const circleColor = planed
    ? theme["color-basic-300"]
    : theme["color-primary-100"];
  const circleStrokeColor = planed
    ? theme["color-basic-600"]
    : theme["color-primary-500"];

  return (
    <MapboxGL.ShapeSource id={`lineSource-${stageId}`} shape={collection}>
      <MapboxGL.LineLayer
        id={`lineLayer-${stageId}`}
        belowLayerID="road-label"
        style={{
          lineColor,
          lineWidth: 4,
          lineOpacity: 1,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      <MapboxGL.CircleLayer
        id={`startPointLayer-${stageId}`}
        filter={["any", ["==", "name", "Start"], ["==", "$type", "Point"]]}
        style={{
          circleColor: circleColor,
          circleRadius: 6,
          circleStrokeWidth: 2,
          circleStrokeColor: circleStrokeColor,
        }}
      />
      <MapboxGL.CircleLayer
        id={`endPointLayer-${stageId}`}
        filter={["any", ["==", "name", "End"], ["==", "$type", "Point"]]}
        style={{
          circleColor: circleColor,
          circleRadius: 6,
          circleStrokeWidth: 2,
          circleStrokeColor: circleStrokeColor,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

export default React.memo(StageMapLine);
