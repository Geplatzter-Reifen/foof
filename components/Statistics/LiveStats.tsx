import { StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "@ui-kitten/components";
import {
  getStageAvgSpeedString,
  getStageDistanceString,
  getStageDurationString,
} from "@/services/statisticsService";
import { Stage } from "@/database/model/model";
import { withObservables } from "@nozbe/watermelondb/react";

function MapStatisticsBox({ stage }: { stage: Stage }) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  if (!stage) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Icon name="arrows-left-right" style={styles.icon} />
          <Text style={styles.text}>{getStageDistanceString(stage, 2)}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="clock" style={styles.icon} />
          <Text style={styles.text}>{getStageDurationString(stage)}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="gauge-high" style={styles.icon} />
          <Text style={styles.text}>{getStageAvgSpeedString(stage)}</Text>
        </View>
      </View>
    </View>
  );
}

// observe the stage (tracks updates to the stage)
const enhance = withObservables(["stage"], ({ stage }: { stage: Stage }) => ({
  stage,
}));

const EnhancedMapStatistics = enhance(MapStatisticsBox);

export default EnhancedMapStatistics;

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      top: 650,
      width: "100%",
      padding: 10,
      zIndex: 10,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    icon: {
      height: 20,
      width: 20,
      marginRight: 8,
      color: theme["text-basic-color"],
    },
    text: {
      color: theme["text-basic-color"],
      fontWeight: "bold",
      fontSize: 20,
    },
  });
