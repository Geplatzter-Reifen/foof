import { useState, useEffect } from "react";
import { Stage, Location } from "@/database/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import { getAllStagesByTourIdQuery } from "@/services/data/stageService";
import { getAllLocationsByStageId } from "@/services/data/locationService";
import MapboxGL from "@rnmapbox/maps";
import StageMapLine from "@/components/Tour/StageMapLine";

/**
 * Fetches finished stages and their associated locations.
 *
 * @param {Stage[]} stages - List of stages.
 * @returns {Promise<{ stage: Stage; locations: Location[] }[]>}
 * An array of objects containing a stage and its locations.
 */
const fetchStagesWithLocations = async (stages: Stage[]) => {
  // Filter stages that are not active
  const finishedStages = stages.filter((stage) => !stage.isActive);

  // Fetch locations for each finished stage
  const upgradedStages = await Promise.all(
    finishedStages.map(async (stage) => {
      const locations = await getAllLocationsByStageId(stage.id);
      return { stage, locations };
    }),
  );

  return upgradedStages; // Return resolved array
};

/**
 * StagesMapView
 *
 * A reusable component which returns a map of Germany with all existing stages.
 * Each stage is then passed as props to tha MapLine component.
 * @param {Stage[]} stages - The properties for the card.
 * @param {string} props.title - The title displayed at the top of the card.
 * @param {React.ReactNode} props.form - The content rendered inside the card under the header.
 * @returns {JSX.Element} A card component with a header and customizable content.
 */
type stagesMapViewProps = {
  stages: Stage[];
};
// Define the StagesMapView component
const StagesMapView = ({ stages }: stagesMapViewProps) => {
  const [stagesWithLocations, setStagesWithLocations] = useState<
    { stage: Stage; locations: Location[] }[]
  >([]);

  /**
   * Handles fetching stages with their locations.
   * Runs asynchronously and updates the state.
   */
  const loadStagesWithLocations = async () => {
    try {
      const result = await fetchStagesWithLocations(stages);
      setStagesWithLocations(result);
    } catch (error) {
      console.error("Error fetching stages with locations:", error);
    }
  };

  // useEffect to trigger data fetching when `stages` changes
  useEffect(() => {
    loadStagesWithLocations();
  }, [stages]);

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
    </MapboxGL.MapView>
  );
};

// Enhance the component with withObservables
const enhance = withObservables(["tourId"], ({ tourId }) => ({
  stages: getAllStagesByTourIdQuery(tourId), // Reactive query
}));

// The enhanced component expects `tourId` to be passed as a prop
export default enhance(StagesMapView);
