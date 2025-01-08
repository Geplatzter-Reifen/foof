import { Location, Stage, Tour } from "@/database/model/model";
import MapboxGL from "@rnmapbox/maps";
import { lineString, point, featureCollection } from "@turf/helpers";
import { useTheme } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import type { Feature, FeatureCollection, LineString, Point } from "geojson";
import { length } from "@turf/turf";
import { withObservables } from "@nozbe/watermelondb/react";
import { getAllLocationsByStageId } from "@/services/data/locationService";

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

type StageMapLineProps = {
  stage: Stage;
  stageLocations?: Location[];
  lineColor?: string;
  circleColor?: string;
  circleStrokeColor?: string;
};

/**
 * This component renders a dynamic line on a Mapbox map, representing a stage route.
 * The line includes a gradient effect if the stage is active.
 * It also displays start and end points using CircleLayer.
 */
export const StageMapLine = ({
  stage,
  stageLocations,
  lineColor,
  circleColor,
  circleStrokeColor,
}: StageMapLineProps) => {
  const theme = useTheme();
  const [locations, setLocations] = useState<Location[]>([]);
  const stageId = stage.id;
  const active = stage.isActive;

  useEffect(() => {
    const fetchStageLocations = async () => {
      const locations = await getAllLocationsByStageId(stage.id);
      setLocations(locations);
    };
    if (stageLocations) {
      setLocations(stageLocations);
    } else {
      fetchStageLocations();
    }
  }, [stage, stageLocations]);

  if (locations.length <= 1) {
    return null;
  }

  // Fallback to default theme colors if none are provided
  lineColor = lineColor || theme["color-primary-500"];
  circleColor = circleColor || theme["color-primary-100"];
  circleStrokeColor = circleStrokeColor || theme["color-primary-500"];

  let coords = locations.map((loc) => [loc.longitude, loc.latitude]);

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
  const stageLine: Feature<LineString> = lineString(coords, {
    name: "StageLine",
  });
  const firstPoint: Feature<Point> = point(coords[0], { name: "Start" });
  const lastPoint: Feature<Point> = point(coords[coords.length - 1], {
    name: "End",
  });

  const collection: FeatureCollection = active
    ? featureCollection<Point | LineString>([stageLine, firstPoint])
    : featureCollection<Point | LineString>([stageLine, firstPoint, lastPoint]);

  return (
    <MapboxGL.ShapeSource
      id={`lineSource-${stageId}`}
      shape={collection}
      lineMetrics
    >
      <MapboxGL.LineLayer
        id={`lineLayer-${stageId}`}
        belowLayerID="road-label"
        style={{
          ...(active && gradientStart !== 0
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
                lineGradient: [
                  "interpolate",
                  ["linear"],
                  ["line-progress"],
                  0,
                  lineColor,
                  1,
                  lineColor,
                ],
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

const enhance = withObservables(["stage"], ({ stage }: { stage: Stage }) => ({
  stage,
  stageLocations: stage.locations,
}));

/**
 * This component is a higher-order component that provides the stage and stageLocations props to the StageMapLine component.
 * It observes the stage object and re-renders when the stage is updated or Locations are added.
 */
const EnhancedStageMapLine = enhance(StageMapLine);

const enhanceV2 = withObservables(["tour"], ({ tour }: { tour: Tour }) => ({
  stages: tour.stages,
}));

const StageMapLines = ({ stages }: { stages: Stage[] }) => {
  return (
    <>
      {stages.map((stage) => {
        if (stage.isActive) {
          return <EnhancedStageMapLine key={stage.id} stage={stage} />;
        } else {
          return <StageMapLine key={stage.id} stage={stage} />;
        }
      })}
    </>
  );
};

/**
 * This component is a higher-order component that provides the tour prop to the StageMapLines component.
 * The StageMapLines component renders a StageMapLine component for each stage in a tour
 * and re-renders when a stage is added or removed from the tour table.
 * Active stages are observed a second time to update when the stage changes or a Location is added.
 */
export const EnhancedStageMapLines = enhanceV2(StageMapLines);
