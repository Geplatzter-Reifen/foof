import { StyleSheet, View } from "react-native";
import { Card, Icon, Text, ThemeType, useTheme } from "@ui-kitten/components";
import {
  getStageAvgSpeedString,
  getStageDistanceString,
  getStageDurationString,
  getTourAverageSpeedString,
  getTourDistanceString,
  getTourDurationString,
} from "@/services/statisticsService";
import { Stage } from "@/database/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import customStyles from "@/constants/styles";
import IconStat from "@/components/Statistics/IconStat";
import React from "react";

function MapStatisticsBox({ stage }: { stage: Stage }) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  if (!stage) {
    return null;
  }

  return (
    <Card
      style={{
        ...customStyles.basicCard,
        ...customStyles.basicShadow,
      }}
    >
      <View style={styles.statsRow}>
        {/*Distanz*/}
        <IconStat
          icon="arrows-left-right"
          centered
          status="primary"
          fontSize={20}
          iconWidth={30}
          iconHeight={30}
        >
          {getStageDistanceString(stage)}
        </IconStat>
        {/*Dauer*/}
        <IconStat
          icon="clock-rotate-left"
          centered
          status="primary"
          fontSize={20}
          iconWidth={30}
          iconHeight={30}
        >
          {getStageDurationString(stage)}
        </IconStat>
        {/*Durchschnittsgeschwindigkeit*/}
        <IconStat
          icon="gauge-high"
          centered
          status="primary"
          fontSize={20}
          iconWidth={30}
          iconHeight={30}
        >
          {getStageAvgSpeedString(stage)}
        </IconStat>
      </View>
    </Card>
  );
}

// observe the stage (tracks updates to the stage)
const enhance = withObservables(["stage"], ({ stage }: { stage: Stage }) => ({
  stage,
}));

const EnhancedMapStatistics = enhance(MapStatisticsBox);

export default EnhancedMapStatistics;

const makeStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {},
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
