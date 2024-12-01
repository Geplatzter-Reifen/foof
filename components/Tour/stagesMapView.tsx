import React, { useState, useEffect } from "react";
import { Stage, Location } from "@/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import { getAllStagesByTourIdQuery } from "@/services/data/stageService";
import { getAllLocationsByStageId } from "@/services/data/locationService";
import MapboxGL from "@rnmapbox/maps";
import StageMapLine from "@/components/Tour/StageMapLine";

// Define the StagesMapView component
const StagesMapView = ({ stages }: { stages: Stage[] }) => {
  const [stagesWithLocations, setStagesWithLocations] = useState<
    { stage: Stage; locations: Location[] }[]
  >([]);
  MapboxGL.setAccessToken(
    "pk.eyJ1Ijoia2F0emFibGFuY2thIiwiYSI6ImNtM2N4am40cTIyZnkydnNjODBldXR1Y20ifQ.q0I522XSqixPNIe6HwJdOg",
  );
  useEffect(() => {
    // Fetch locations for all stages
    const fetchStagesWithLocations = async () => {
      const upgradedStages = await Promise.all(
        stages.map(async (stage) => {
          const locations = await getAllLocationsByStageId(stage.id); // Fetch locations for each stage
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
    <MapboxGL.MapView style={{ flex: 1 }}>
      <MapboxGL.Camera
        zoomLevel={5}
        centerCoordinate={[8.239761, 50.078218]}
        animationMode="flyTo"
        animationDuration={2000}
      />
      {stagesWithLocations.map((stage) => {
        return (
          <StageMapLine locations={stage.locations} stageID={stage.stage.id} />
        );
      })}
    </MapboxGL.MapView>
  );
};

// Enhance the component with withObservables
const enhance = withObservables(["tourId"], ({ tourId }) => ({
  stages: getAllStagesByTourIdQuery(tourId), // Reactive query
}));

// The enhanced component expects `tourId` to be passed as a prop
export default enhance(StagesMapView);
