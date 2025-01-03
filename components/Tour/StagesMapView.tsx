import React, { useState, useEffect } from "react";
import { Stage, Location, Route, Tour } from "@/database/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import { getAllStagesByTourIdQuery } from "@/services/data/stageService";
import { getAllLocationsByStageId } from "@/services/data/locationService";
import MapboxGL from "@rnmapbox/maps";
import StageMapLine from "@/components/Tour/StageMapLine";
import * as TaskManager from "expo-task-manager";
import { LOCATION_TASK_NAME } from "@/services/tracking";
import { getActiveTour } from "@/services/data/tourService";

type stagesMapViewProps = {
  stages: Stage[];
};
// Define the StagesMapView component
const StagesMapView = ({ stages }: stagesMapViewProps) => {
  const [stagesWithLocations, setStagesWithLocations] = useState<
    { stage: Stage; locations: Location[] }[]
  >([]);
  const [activeTour, setActiveTour] = useState<Tour>();
  useEffect(() => {
    const prepare = async () => {
      getActiveTour().then((tour) => {
        if (tour) {
          setActiveTour(tour);
        }
      });
    };
    void prepare();
  }, [activeTour]);
  // observe the route (tracks updates to the route)
  const enhanceV1 = withObservables(
    ["route"],
    ({ route }: { route: Route }) => ({
      route,
    }),
  );
  let geoJSON: GeoJSON.FeatureCollection | undefined = undefined;
  const ShapeSource = ({ route }: { route: Route }) => {
    geoJSON = JSON.parse(route.geoJson);
    return (
      <StageMapLine
        routeGeoJSON={geoJSON}
        stageId={"planned-route"}
        planed={true}
      />
    );
  };
  const EnhancedShapeSource = enhanceV1(ShapeSource);
  // observe routes of a tour (only tracks create and delete in the routes table)
  const Bridge = ({ routes }: { routes: Route[] }) => {
    if (routes.length === 0) return null;
    return <EnhancedShapeSource route={routes[0]} />;
  };

  const enhanceV2 = withObservables(["tour"], ({ tour }: { tour: Tour }) => ({
    routes: tour.routes,
  }));

  const EnhancedShapeSourceV2 = enhanceV2(Bridge);

  useEffect(() => {
    const fetchStagesWithLocations = async () => {
      const finishedStages = stages.filter((stage) => {
        return !stage.isActive;
      });
      const upgradedStages = await Promise.all(
        finishedStages.map(async (stage) => {
          const locations = await getAllLocationsByStageId(stage.id);
          return { stage, locations };
        }),
      );
      setStagesWithLocations(upgradedStages); // Set the resolved array
    };
    fetchStagesWithLocations();
  }, [stages]); // Re-run if `stages` changes

  // Fallback if stages are still being resolved
  if (!stagesWithLocations.length) {
    return <MapboxGL.MapView style={{ flex: 1 }} />;
  }

  return (
    <MapboxGL.MapView
      zoomEnabled={true}
      scrollEnabled={true}
      pitchEnabled={true}
      rotateEnabled={true}
      style={{ flex: 1 }}
    >
      <MapboxGL.Camera
        minZoomLevel={5}
        maxZoomLevel={15}
        zoomLevel={5}
        centerCoordinate={[10.4515, 51.1657]}
        animationMode="flyTo"
        animationDuration={1000}
      />
      {stagesWithLocations.map((stage) => {
        if (stage.locations.length <= 1) return;
        return (
          <StageMapLine
            locations={stage.locations}
            stageId={stage.stage.id}
            key={stage.stage.id}
          />
        );
      })}
      {activeTour && <EnhancedShapeSourceV2 tour={activeTour} />}
    </MapboxGL.MapView>
  );
};

// Enhance the component with withObservables
const enhance = withObservables(["tourId"], ({ tourId }) => ({
  stages: getAllStagesByTourIdQuery(tourId), // Reactive query
}));

// The enhanced component expects `tourId` to be passed as a prop
export default enhance(StagesMapView);
