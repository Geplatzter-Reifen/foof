import { useState, useEffect } from "react";
import { Stage, Location, Route } from "@/database/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import { getAllStagesByTourIdQuery } from "@/services/data/stageService";
import { getAllLocationsByStageId } from "@/services/data/locationService";
import MapboxGL from "@rnmapbox/maps";
import StageMapLine from "@/components/Tour/StageMapLine";
import { RenderRoute } from "@/components/Route/RenderRoute";
import { getTourRoute } from "@/services/data/routeService";

type stagesMapViewProps = {
  tourId: string;
  stages: Stage[];
};
// Define the StagesMapView component
const StagesMapView = ({ tourId, stages }: stagesMapViewProps) => {
  const [stagesWithLocations, setStagesWithLocations] = useState<
    { stage: Stage; locations: Location[] }[]
  >([]);
  const [route, setRoute] = useState<Route | null>(null);

  // Fetch locations for all stages

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

  useEffect(() => {
    const fetchRoute = async () => {
      const route = await getTourRoute(tourId);
      setRoute(route);
    };
    fetchRoute();
  }, [tourId]);

  // Fallback if stages are still being resolved
  if (!stagesWithLocations.length) {
    return <MapboxGL.MapView style={{ flex: 1 }} />;
  }

  return (
    <MapboxGL.MapView
      localizeLabels
      scaleBarEnabled={false}
      style={{ flex: 1 }}
    >
      <MapboxGL.Camera
        zoomLevel={5}
        centerCoordinate={[10.4515, 51.1657]}
        animationDuration={0}
        minZoomLevel={5}
      />
      {stagesWithLocations
        .filter((stage) => stage.locations.length > 1)
        .map((stage) => (
          <StageMapLine
            locations={stage.locations}
            stageId={stage.stage.id}
            key={stage.stage.id}
          />
        ))}
      {route && <RenderRoute route={route} />}
    </MapboxGL.MapView>
  );
};

// Enhance the component with withObservables
const enhance = withObservables(["tourId"], ({ tourId }) => ({
  stages: getAllStagesByTourIdQuery(tourId), // Reactive query
}));

// The enhanced component expects `tourId` to be passed as a prop
export default enhance(StagesMapView);
