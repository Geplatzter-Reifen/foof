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

  // Header der Kachel
  const Header = () => {
    return (
      <Text category="h5" style={styles.title}>
        {stage.title}
      </Text>
    );
  };

  // Body mit Distanz, Dauer und Durchschnittsgeschwindigkeit
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

  // Footer: Startzeitpunkt der Stage
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
        router.push({
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

// Observe die reingegebene Prop "stage"und reagiere auf änderungen
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
