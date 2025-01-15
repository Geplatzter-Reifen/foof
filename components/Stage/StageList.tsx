import { Stage } from "@/database/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import { StageCard } from "@/components/Stage/StageCard";
import { Text } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";

const StageListComponent = ({ stages }: { stages: Stage[] }) => {
  return (
    <View style={styles.list}>
      {
        // if no stage exists, return a text component
        stages.length === 0 ? (
          <Text style={styles.noStageText}>Starte eine Etappe!</Text>
        ) : (
          stages
            .sort((stage_a, stage_b) => {
              return stage_b.startedAt - stage_a.startedAt;
            })
            .map((stage) => <StageCard key={stage.id} stage={stage} />)
        )
      }
    </View>
  );
};

// enhance to be able to react to database changes
const enhance = withObservables(["stages"], ({ stages }) => ({ stages }));
const StageList = enhance(StageListComponent);
export { StageList, StageListComponent as StageListForTesting };

const styles = StyleSheet.create({
  noStageText: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 20,
  },
  list: {
    marginTop: 15,
  },
});
