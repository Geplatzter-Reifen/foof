import { Stage } from "@/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import StageCard from "@/components/Tour/StageCard";
import { Layout, Text } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

const StageList = ({ stages }: { stages: Stage[] }) => {
  return (
    <Layout level="3">
      <Text status="primary" category="h5" style={styles.heading}>
        Etappen
      </Text>
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
  heading: {
    marginBottom: 10,
  },
  noStageText: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 20,
  },
});
