import React from "react";
import { Text, Layout } from "@ui-kitten/components";
import { Stage } from "@/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import { getAllStagesByTourIdQuery } from "@/services/data/stageService";

// Define the StagesMapView component
const StagesMapView = ({ stages }: { stages: Stage[] }) => {
  return (
    <Layout style={{ flex: 1 }}>
      <Text category="h5" style={{ margin: 10 }}>
        Map of Stages
      </Text>
      {stages.length === 0 ? (
        <Text>No stages available</Text>
      ) : (
        stages.map((stage) => {
          const locations = getAllStagesByTourIdQuery(stage.id).toString();
          return <Text key={stage.id}>{locations}</Text>;
        })
      )}
    </Layout>
  );
};

// Enhance the component with withObservables
const enhance = withObservables(["tourId"], ({ tourId }) => ({
  stages: getAllStagesByTourIdQuery(tourId), // Reactive query
}));

// The enhanced component expects `tourId` to be passed as a prop
export default enhance(StagesMapView);
