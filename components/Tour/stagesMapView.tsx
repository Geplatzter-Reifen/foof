import React, { useState, useEffect, ReactElement } from "react";
import { Stage, Location } from "@/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import { getAllStagesByTourIdQuery } from "@/services/data/stageService";
import { getAllLocationsByStageId } from "@/services/data/locationService";
import MapboxGL from "@rnmapbox/maps";
import StageMapLine from "@/components/Tour/StageMapLine";
import { useNavigation } from "expo-router";

type stagesMapViewProps = {
  stages: Stage[];
  tour: string;
};
// Define the StagesMapView component
const StagesMapView = ({ stages, tour }: stagesMapViewProps) => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: tour,
      headerTitleAlign: "center", // Ensures the title is centered
    });
  }, [navigation, tour]);
  const [stagesWithLocations, setStagesWithLocations] = useState<
    { stage: Stage; locations: Location[] }[]
  >([]);

  // Fetch locations for all stages
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
  useEffect(() => {
    fetchStagesWithLocations();
  }, [fetchStagesWithLocations, stages]); // Re-run if `stages` changes

  // Fallback if stages are still being resolved
  if (!stagesWithLocations.length) {
    return <MapboxGL.MapView style={{ flex: 1 }} />;
  }

  return (
    <MapboxGL.MapView
      minZoomLevel={5}
      maxZoomLevel={15}
      zoomEnabled={true}
      scrollEnabled={true}
      pitchEnabled={true}
      rotateEnabled={true}
      style={{ flex: 1 }}
    >
      <MapboxGL.Camera
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
    </MapboxGL.MapView>
  );
};

// Enhance the component with withObservables
const enhance = withObservables(["tourId"], ({ tourId }) => ({
  stages: getAllStagesByTourIdQuery(tourId), // Reactive query
}));

// The enhanced component expects `tourId` to be passed as a prop
export default enhance(StagesMapView);
