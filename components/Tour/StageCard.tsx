import React from "react";
import { DateFormat, formatDate } from "@/utils/dateUtil";

import { Stage } from "@/database/model/model";
import { deleteStage } from "@/services/data/stageService";
import { shareStage } from "@/services/sharingService";
import {
  getStageAvgSpeedString,
  getStageDistanceString,
  getStageDurationString,
} from "@/services/statisticsService";

import { Button, Card, Icon, IconElement, Text } from "@ui-kitten/components";
import { ImageProps, StyleSheet, View } from "react-native";
import customStyles from "../../constants/styles";
import { withObservables } from "@nozbe/watermelondb/react";
import IconStat from "@/components/Statistics/IconStat";

function StageCardComp({ stage }: { stage: Stage }) {
  // Display Strings für das Startdatum, Dauer, Distanz und Durchschnittsgeschwindigkeit
  const dateString: string = formatDate(stage.startedAt, DateFormat.DATE_TIME);
  const durationString: string = getStageDurationString(stage);
  const distanceString: string = getStageDistanceString(stage);
  const avgSpeedString: string = getStageAvgSpeedString(stage);

  // Icons für Teilen und Löschen
  const ShareIcon = (props?: Partial<ImageProps>): IconElement => (
    <Icon
      {...props}
      name="share-nodes"
      style={[props?.style, { height: 18, width: "auto" }]}
    />
  );
  const TrashIcon = (props?: Partial<ImageProps>): IconElement => (
    <Icon
      {...props}
      name="trash"
      style={[props?.style, { height: 18, width: "auto" }]}
    />
  );

  // Header der Kachel mit Löschen- und Teilen-Button
  const Header = () => {
    return (
      <View style={styles.header}>
        <Text category="h5" style={styles.title}>
          {stage.title}
        </Text>
        <View style={styles.headerButtonGroup}>
          <Button
            status="basic"
            appearance="ghost"
            accessoryLeft={TrashIcon}
            onPress={() => deleteStage(stage.id)}
          ></Button>
          <Button
            status="basic"
            appearance="ghost"
            accessoryLeft={ShareIcon}
            onPress={() => shareStage(stage)}
          ></Button>
        </View>
      </View>
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
    >
      <Body />
      <Footer />
    </Card>
  );
}

// Observe die reingegebene Prop "stage"und reagiere auf änderungen
const enhance = withObservables(["stage"], ({ stage }) => ({ stage }));
const StageCard = enhance(StageCardComp);

export { StageCard, StageCardComp as StageCardForTest };

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    marginHorizontal: 10,
    flex: 1,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    marginTop: 8,
    marginLeft: 15,
  },
  body: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  headerButtonGroup: {
    flexDirection: "row",
  },
  date: {
    marginTop: 9,
  },
});
