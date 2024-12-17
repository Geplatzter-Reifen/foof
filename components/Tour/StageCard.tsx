import React from "react";
import { DateFormat, formatDate, getDurationFormatted } from "@/utils/dateUtil";

import { Stage } from "@/database/model/model";
import { deleteStage } from "@/services/data/stageService";

import {
  Button,
  Card,
  Icon,
  IconElement,
  Layout,
  Text,
} from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ImageProps, StyleSheet, View } from "react-native";
import customStyles from "../../constants/styles";
import { foofDarkTheme } from "@/constants/custom-theme";
import { withObservables } from "@nozbe/watermelondb/react";
import { shareStage } from "@/services/sharingService";
import {
  getStageAvgSpeedString,
  getStageDistanceString,
  getStageDurationString,
} from "@/services/statisticsService";
import IconStat from "@/components/Statistics/IconStat";

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

function StageCard({ stage }: { stage: Stage }) {
  // Startdatum & "Enddatum" aus der Stage holen
  const startedAt: Date = new Date(stage.startedAt);
  let finishedAt: Date | undefined = stage.finishedAt
    ? new Date(stage.finishedAt)
    : new Date(Date.now()); // falls Stage noch am aufzeichnen

  // Display Strings für das Startdatum, Dauer, Distanz und Durchschnittsgeschwindigkeit
  const dateString: string = formatDate(startedAt, DateFormat.DATE_TIME);
  const durationString: string = getStageDurationString(stage);
  const distanceString: string = getStageDistanceString(stage);
  const avgSpeedString: string = getStageAvgSpeedString(stage);

  // Header der Kachel mit Löschen- und Teilen-Button
  const Header = () => {
    return (
      <View style={styles.header}>
        <Text category="h6" style={styles.title}>
          {stage.title}
        </Text>
        <View style={styles.buttonGroup}>
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

  return (
    <Layout level="2">
      <Card
        style={{
          ...customStyles.basicCard,
          ...customStyles.basicShadow,
          ...styles.card,
        }}
        header={<Header />}
        status={stage.isActive ? "primary" : undefined}
      >
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
        <Text appearance="hint" style={styles.date}>
          {dateString}
        </Text>
      </Card>
    </Layout>
  );
}

// Observe die reingegebene Prop "stage"und reagiere auf änderungen
const enhance = withObservables(["stage"], ({ stage }) => ({ stage }));
export default enhance(StageCard);

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
    marginTop: 10,
    marginLeft: 15,
  },
  body: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  buttonGroup: {
    flexDirection: "row",
  },
  date: {
    marginTop: 7,
  },
});
