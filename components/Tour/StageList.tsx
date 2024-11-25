import { Stage } from "@/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import StageCard from "@/components/Tour/StageCard";
import { Layout, Text } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

const StageList = ({ stages }: { stages: Stage[] }) => {
  return (
    <Layout level="2">
      {stages.length === 0 ? (
        <Text style={styles.noStageText}>Starte eine Etappe!</Text>
      ) : (
        stages.map((stage) => <StageCard key={stage.id} stage={stage} />)
      )}
    </Layout>
  );
};

const enhance = withObservables(["stages"], ({ stages }) => ({ stages }));
export default enhance(StageList);

const styles = StyleSheet.create({
  noStageText: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 20,
  },
});
