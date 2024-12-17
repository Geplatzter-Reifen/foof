import { Stage } from "@/database/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import { StageCard } from "@/components/Tour/StageCard";
import { Text } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";

const StageListComp = ({ stages }: { stages: Stage[] }) => {
  return (
    <View style={styles.list}>
      {
        // Falls keine Etappe existiert, returne einen String
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

// enhancen, um auf DB-Änderungen zu reagieren
const enhance = withObservables(["stages"], ({ stages }) => ({ stages }));
const StageList = enhance(StageListComp);
export { StageList, StageListComp as StageListForTesting };

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
