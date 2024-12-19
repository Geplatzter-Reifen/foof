import { withObservables } from "@nozbe/watermelondb/react";
import { Route, Tour } from "@/database/model/model";
import React from "react";
import MapboxGL from "@rnmapbox/maps";

const RenderRoute = ({ route }: { route: Route }) => {
  const geoJSON = JSON.parse(route.geoJson);
  return (
    <MapboxGL.ShapeSource shape={geoJSON} id="routeSource">
      <MapboxGL.LineLayer
        id="routeLayer"
        belowLayerID="road-label"
        style={{
          lineColor: "#b8b8b8",
          lineWidth: 5,
          lineJoin: "round",
          lineCap: "round",
        }}
      />
      <MapboxGL.CircleLayer
        id="pointLayer"
        filter={["==", "$type", "Point"]}
        style={{
          circleColor: "black",
          circleRadius: 5,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

// observe the route (tracks updates to the route)
const enhance = withObservables(["route"], ({ route }: { route: Route }) => ({
  route,
}));

const EnhancedRenderRoute = enhance(RenderRoute);

const Bridge = ({ routes }: { routes: Route[] }) => {
  if (routes.length === 0) return null;
  return <EnhancedRenderRoute route={routes[0]} />;
};

// observe routes of a tour (only tracks create and delete in the routes table)
const enhanceV2 = withObservables(["tour"], ({ tour }: { tour: Tour }) => ({
  routes: tour.routes,
}));

const EnhancedRenderRouteV2 = enhanceV2(Bridge);

export { EnhancedRenderRouteV2 };
