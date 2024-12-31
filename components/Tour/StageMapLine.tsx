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
};
const StageMapLine = ({
  locations,
  stageId,
  active = false,
}: stageMapLineProps) => {
  const theme = useTheme();
  // Function to calculate the midpoint
  // Convert degrees to radians
  const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

  // Convert radians to degrees
  const toDegrees = (radians: number): number => (radians * 180) / Math.PI;

  const calculateLastPoint = (coord1: number[], coord2: number[]): number[] => {
    const lon1 = toRadians(coord1[0]);
    const lat1 = toRadians(coord1[1]);
    const lon2 = toRadians(coord2[0]);
    const lat2 = toRadians(coord2[1]);
    const dLon = lon2 - lon1;

    const Bx = Math.cos(lat2) * Math.cos(dLon);
    const By = Math.cos(lat2) * Math.sin(dLon);

    const Lat = Math.atan2(
      Math.sin(lat1) + (4.5 / 10) * (Math.sin(lat2) - Math.sin(lat1)),
      Math.sqrt(
        (Math.cos(lat1) + (4.5 / 10) * (Bx - Math.cos(lat1))) ** 2 +
          ((4.5 / 10) * By) ** 2,
      ),
    );
    const Lon =
      lon1 +
      Math.atan2(
        (4.5 / 10) * By,
        Math.cos(lat1) + (4.5 / 10) * (Bx - Math.cos(lat1)),
      );

    return [toDegrees(Lon), toDegrees(Lat)]; // Convert back to degrees
  };

  // Derive coordinates from locations
  let coords = locations.map((location) => [
    location.longitude,
    location.latitude,
  ]);

  if (active && coords.length >= 2) {
    console.log("i am in altering if ");

    // Adjust the last coordinate
    const lastCoord = calculateLastPoint(
      coords[coords.length - 1],
      coords[coords.length - 2],
    );
    // Replace the last coordinate in the array
    coords = [...coords.slice(0, -1), lastCoord];
  }

  console.log("Coordinates for the line:", coords);

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
    <MapboxGL.ShapeSource
      id={`lineSource-${stageId}`}
      shape={collection}
      lineMetrics={true}
    >
      <MapboxGL.LineLayer
        id={`lineLayer-${stageId}`}
        belowLayerID="road-label"
        style={{
          ...(active
            ? {
                lineGradient: [
                  "interpolate",
                  ["linear"],
                  ["line-progress"],
                  0,
                  theme["color-primary-500"], // Fully opaque
                  0.9,
                  theme["color-primary-500"], // Near the end
                  1,
                  "rgba(0, 0, 0, 0)", // Transparent at the end
                ],
              }
            : {
                lineColor: theme["color-primary-500"], // Static color if not active
              }),
          lineColor: theme["color-primary-500"],
          lineWidth: 4, // Thickness
          lineOpacity: 1, // Transparency
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      <MapboxGL.CircleLayer
        id={`startPointLayer-${stageId}`}
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
