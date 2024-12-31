import { Location } from "@/database/model/model";
import MapboxGL from "@rnmapbox/maps";
import { lineString, point, featureCollection } from "@turf/helpers";
import { useTheme } from "@ui-kitten/components";
import React from "react";
import type { Feature, FeatureCollection, LineString, Point } from "geojson";

/**
 * Converts degrees to radians.
 *
 * @param degrees - The angle in degrees.
 * @returns The angle in radians.
 */
const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/**
 * Converts radians to degrees.
 *
 * @param radians - The angle in radians.
 * @returns The angle in degrees.
 */
const toDegrees = (radians: number): number => (radians * 180) / Math.PI;
/**
 * Calculates a point 45% of the way between two geographic coordinates. Solves the overlapping
 * problem between active stage line and user location point
 *
 * This function interpolates a point along the great circle path between two
 * geographic coordinates (latitude and longitude), simulating a partial
 * progression between the two points.
 *
 * @param coord1 - The starting coordinate as [longitude, latitude].
 * @param coord2 - The ending coordinate as [longitude, latitude].
 * @returns A coordinate [longitude, latitude] 45% of the way from coord1 to coord2.
 */
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
/**
 * StageMapLine Component
 *
 * This component renders a dynamic line on a Mapbox map, representing a stage route.
 * The line can include a gradient effect if the `active` prop is set to `true`.
 * It also displays start and end points using CircleLayer.
 *
 * Props:
 * - locations: Location[] - An array of location objects containing latitude and longitude.
 * - stageId: string - A unique identifier for the stage, used for layer and source IDs.
 * - active: boolean - Determines whether the line should include a gradient effect or display statically.
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
                lineColor: theme["color-primary-500"], // Static color if not active stage
              }),
          lineColor: theme["color-primary-500"],
          lineWidth: 4,
          lineOpacity: 1,
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
