import { Location } from "@/database/model/model";
import MapboxGL from "@rnmapbox/maps";
import { lineString, point, featureCollection } from "@turf/helpers";
import { useTheme } from "@ui-kitten/components";
import React from "react";
import type { Feature, FeatureCollection, LineString, Point } from "geojson";
import { length } from "@turf/turf";

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
 * Calculates a point 45% of the way between two geographic coordinates.
 * This helps solve the overlapping problem between the active stage line and the user location point.
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

  return [toDegrees(Lon), toDegrees(Lat)];
};

/**
 * StageMapLine Component
 *
 * This component renders a dynamic line on a Mapbox map, representing a stage route.
 * The line can include a gradient effect if the `active` prop is set to `true`.
 * It also displays start and end points using CircleLayer.
 *
 * @component
 * @param {Object} props - The props for the StageMapLine component.
 * @param {Object[]} props.locations - An array of location objects, each containing `latitude` and `longitude`.
 * @param {string} props.stageId - A unique identifier for the stage, used for layer and source IDs.
 * @param {boolean} [props.active=false] - Determines whether the line should include a gradient effect or display statically.
 * @param {string} [props.lineColor] - Custom color for the line.
 * @param {string} [props.circleColor] - Custom color for the circles at the start and end points.
 * @param {string} [props.circleStrokeColor] - Custom stroke color for the circles at the start and end points.
 * @returns {JSX.Element} A Mapbox line and optionally styled start/end points.
 */
type StageMapLineProps = {
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
}: StageMapLineProps) => {
  const theme = useTheme();

  // Fallback to default theme colors if none are provided
  lineColor = lineColor || theme["color-primary-500"];
  circleColor = circleColor || theme["color-primary-100"];
  circleStrokeColor = circleStrokeColor || theme["color-primary-500"];

  // Unpack location coordinates
  const locationsUnpacked = locations.map((loc) => ({
    latitude: loc.latitude,
    longitude: loc.longitude,
  }));

  let coords = locationsUnpacked.map((location) => [
    location.longitude,
    location.latitude,
  ]);

  // Gradient start and end points for active stages
  let gradientStart = 0;
  if (active) {
    if (coords.length >= 2) {
      const lastCoord = calculateLastPoint(
        coords[coords.length - 1],
        coords[coords.length - 2],
      );
      coords = [...coords.slice(0, -1), lastCoord];
      const geojsonLine = lineString(coords);
      const totalLineLength = length(geojsonLine);
      const segmentLineLength = length(
        lineString([coords[coords.length - 2], coords[coords.length - 1]]),
      );
      gradientStart = (totalLineLength - segmentLineLength) / totalLineLength;
    } else {
      gradientStart = 0;
    }
  }

  // Create GeoJSON features
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
          ...(active && gradientStart != 0
            ? {
                lineGradient: [
                  "interpolate",
                  ["linear"],
                  ["line-progress"],
                  0,
                  theme["color-primary-500"],
                  gradientStart,
                  theme["color-primary-500"],
                  1,
                  "rgba(0, 0, 0, 0)",
                ],
              }
            : {
                lineColor: lineColor,
              }),
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
          circleColor: circleColor,
          circleRadius: 6,
          circleStrokeWidth: 2,
          circleStrokeColor: circleStrokeColor,
        }}
      />
      <MapboxGL.CircleLayer
        id={`endPointLayer-${stageId}`}
        filter={["==", "name", "End"]}
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
