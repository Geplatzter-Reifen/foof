import { getTourRoute } from "@/services/data/routeService";
import type { FeatureCollection } from "geojson";
import { Tour } from "@/database/model/model";
import { Camera } from "@rnmapbox/maps";
import React from "react";
import { calculateBounds } from "@/utils/locationUtils";

// Function to display the route on the map by adjusting the camera to fit the route's bounds
export function fitRouteInCam(
  activeTour: Tour | undefined,
  camera: React.RefObject<Camera>,
) {
  getTourRoute(activeTour?.id!).then((route) => {
    if (!route) {
      throw new Error("Keine Route importiert!");
    }
    const geoJSON: FeatureCollection = JSON.parse(route.geoJson);
    const bounds = calculateBounds(geoJSON);

    camera.current?.setCamera({
      bounds: bounds,
      padding: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        paddingBottom: 150,
      },
      animationDuration: 2000,
      heading: 0,
      animationMode: "flyTo",
    });
  });
}
