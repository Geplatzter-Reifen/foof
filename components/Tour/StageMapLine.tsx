import { Location } from "@/model/model";
import MapboxGL from "@rnmapbox/maps";
import { lineString, point, featureCollection } from "@turf/helpers";
import { Layout, useTheme } from "@ui-kitten/components";
import React from "react";
import { Feature, FeatureCollection, LineString, Point } from "geojson";

const StageMapLine = ({
  locations,
  stageID,
  active,
}: {
  locations: Location[];
  stageId: number;
}) => {
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

  const featureCollection: FeatureCollection = {
    type: "FeatureCollection",
    features: [stage, firstPoint, lastPoint],
  };
  console.log(
    "This is featureCollection---->" + JSON.stringify(featureCollection),
  );
  return (
    <MapboxGL.ShapeSource
      id={`lineSource-${stageID}`}
      shape={featureCollection}
    >
      <MapboxGL.LineLayer
        id={`lineLayer-${stageID}`}
        style={{
          lineColor: theme["color-primary-500"],
          lineWidth: 4, // Thickness
          lineOpacity: 1, // Transparency
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      <MapboxGL.CircleLayer
        id={`startPointLayer-${stageID}`}
        filter={["==", "name", "Start"]}
        style={{
          circleColor: theme["color-primary-100"],
          circleRadius: 6, // Size of the circle
          circleStrokeWidth: 2,
          circleStrokeColor: theme["color-primary-500"],
        }}
      />
      <MapboxGL.CircleLayer
        id={`endPointLayer-${stageID}`}
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
