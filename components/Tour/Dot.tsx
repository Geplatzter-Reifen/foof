import { Location } from "@/model/model";
import MapboxGL from "@rnmapbox/maps";
import { lineString } from "@turf/helpers";
import { Layout, useTheme } from "@ui-kitten/components";
import React from "react";

const Dot = ({ lon, lat }: { lon: number; lat: number }) => {
  const theme = useTheme();

  const stage = lineString(coords, { name: "Stage" });
  return active ? (
    <MapboxGL.ShapeSource id={`lineSource-${stageID}`} shape={stage}>
      <MapboxGL.LineLayer
        id={`lineLayer-${stageID}`}
        style={{
          lineColor: theme["color-primary-500"],
          lineWidth: 3, // Thickness
          lineOpacity: 1, // Transparency
          lineCap: "round",
          lineJoin: "round",
        }}
      />
    </MapboxGL.ShapeSource>
  ) : (
    <MapboxGL.ShapeSource id={`lineSource-${stageID}`} shape={stage}>
      <MapboxGL.LineLayer
        id={`lineLayer-${stageID}`}
        style={{
          lineColor: theme["color-primary-500"],
          lineWidth: 3, // Thickness
          lineOpacity: 1, // Transparency
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      <MapboxGL.CircleLayer
        coordinate={start}
        id={`lineLayer-${stageID}-start`}
        style={{
          circleStrokeColor: theme["color-primary-500"],
          circleColor: theme["color-primary-100"],
          circleStrokeWidth: 3,
        }}
      />
      <MapboxGL.CircleLayer
        coordinate={end}
        id={`lineLayer-${stageID}-end`}
        style={{
          circleStrokeColor: theme["color-primary-500"],
          circleColor: theme["color-primary-100"],
          circleStrokeWidth: 3,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

export default React.memo(StageMapLine);
