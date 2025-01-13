import { useState, useEffect } from "react";
import { Stage, Route } from "@/database/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import { getAllStagesByTourIdQuery } from "@/services/data/stageService";
import MapboxGL from "@rnmapbox/maps";
import { StageMapLine } from "@/components/Map/StageMapLine";
import { RenderRoute } from "@/components/Route/RenderRoute";
import { getTourRoute } from "@/services/data/routeService";

type stagesMapViewProps = {
  tourId: string;
  stages: Stage[];
};
// Define the StagesMapView component
const StagesMapView = ({ tourId, stages }: stagesMapViewProps) => {
  const [route, setRoute] = useState<Route | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      const route = await getTourRoute(tourId);
      setRoute(route);
    };
    fetchRoute();
  }, [tourId]);

  return (
    <MapboxGL.MapView
      localizeLabels
      scaleBarEnabled={false}
      style={{ flex: 1 }}
    >
      <MapboxGL.Camera
        zoomLevel={5}
        centerCoordinate={[10.4515, 51.1657]}
        animationMode="none"
        minZoomLevel={5}
      />
      {stages.map((stage) => {
        if (!stage.isActive) {
          return <StageMapLine stage={stage} key={stage.id} />;
        }
      })}
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
