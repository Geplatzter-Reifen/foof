import React from "react";
import { DateFormat, formatDate } from "@/utils/dateUtils";

import { Stage } from "@/database/model/model";
import {
  getStageAvgSpeedString,
  getStageDistanceString,
  getStageDurationString,
} from "@/services/statisticsService";

import { Card, Text } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import customStyles from "../../constants/styles";
import { withObservables } from "@nozbe/watermelondb/react";
import { router } from "expo-router";
import IconStat from "@/components/Statistics/IconStat";

function StageCardComponent({ stage }: { stage: Stage }) {
  // Display Strings für das Startdatum, Dauer, Distanz und Durchschnittsgeschwindigkeit
  const dateString: string = formatDate(stage.startedAt, DateFormat.DATE_TIME);
  const durationString: string = getStageDurationString(stage);
  const distanceString: string = getStageDistanceString(stage);
  const avgSpeedString: string = getStageAvgSpeedString(stage);

  // Header of the tile
  const Header = () => {
    return (
      <Text category="h5" style={styles.title}>
        {stage.title}
      </Text>
    );
  };

  // Body with distance, duration and average speed
  const Body = () => {
    return (
      <View style={styles.body}>
        <IconStat icon="arrows-left-right" status="primary">
          {distanceString}
        </IconStat>
        <IconStat icon="clock-rotate-left" status="primary">
          {durationString}
        </IconStat>
        <IconStat icon="gauge-high" status="primary">
          {avgSpeedString}
        </IconStat>
      </View>
    );
  };

  // Footer: start time of the stage
  const Footer = () => {
    return (
      <Text appearance="hint" style={styles.date}>
        {dateString}
      </Text>
    );
  };

  return (
    <Card
      style={{
        ...customStyles.basicCard,
        ...customStyles.basicShadow,
        ...styles.card,
      }}
      header={<Header />}
      status={stage.isActive ? "primary" : undefined}
      testID="stage-card"
      disabled={stage.isActive}
      onPress={() =>
        router.navigate({
          pathname: "./stage",
          params: {
            stageId: stage.id,
          },
        })
      }
    >
      <Body />
      <Footer />
    </Card>
  );
}

// observe the provided prop "stage" and react to changes
const enhance = withObservables(["stage"], ({ stage }) => ({ stage }));
const StageCard = enhance(StageCardComponent);

export { StageCard, StageCardComponent as StageCardForTest };

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    marginHorizontal: 10,
    flex: 1,
  },
  title: {
    marginVertical: 8,
    marginLeft: 15,
  },
  body: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  date: {
    marginTop: 9,
  },
});
