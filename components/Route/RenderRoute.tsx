// This file defines the `RenderRoute` component, which is responsible for rendering a route on a Mapbox map using GeoJSON data.
// The `RenderRoute` component uses Mapbox GL's `ShapeSource`, `LineLayer`, and `CircleLayer` to display the route and its points.
// The `EnhancedRenderRoute` component is an observable version of `RenderRoute` that tracks updates to the route.
// The `Bridge` component checks if there is a route associated with a tour and renders the `EnhancedRenderRoute` component if a route exists.
// The `EnhancedRenderRouteV2` component is an observable version of `Bridge` that tracks create and delete operations in the routes table of a tour.

import { withObservables } from "@nozbe/watermelondb/react";
import { Route, Tour } from "@/database/model/model";
import React from "react";
import MapboxGL from "@rnmapbox/maps";

export const RenderRoute = ({ route }: { route: Route }) => {
  const geoJSON = JSON.parse(route.geoJson);
  return (
    <MapboxGL.ShapeSource shape={geoJSON} id="routeSource">
      <MapboxGL.LineLayer
        id="routeLayer"
        belowLayerID="road-label"
        style={{
          lineColor: "#b8b8b8",
          lineWidth: 4,
          lineJoin: "round",
          lineCap: "round",
        }}
      />
      <MapboxGL.CircleLayer
        id="pointLayer"
        filter={["==", "$type", "Point"]}
        style={{
          circleColor: "#eaeaea",
          circleRadius: 6,
          circleStrokeWidth: 2,
          circleStrokeColor: "#000000",
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

export const EnhancedRenderRouteV2 = enhanceV2(Bridge);
