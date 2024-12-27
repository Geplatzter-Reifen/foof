import React from "react";
import { DateFormat, formatDate } from "@/utils/dateUtil";

import { Location, Stage } from "@/database/model/model";

import { Button, Card, Icon, IconElement, Text } from "@ui-kitten/components";
import { ImageProps, StyleSheet, View } from "react-native";
import customStyles from "../../constants/styles";
import { shareStage } from "@/services/sharingService";
import IconStat from "@/components/Statistics/IconStat";
import { getCoordinateString } from "@/utils/locationUtil";
import {
  getStageAvgSpeedString,
  getStageDistanceString,
  getStageDurationString,
} from "@/services/statisticsService";

const ShareIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon
    {...props}
    name="share-nodes"
    style={[props?.style, { height: 20, width: "auto" }]}
  />
);

export default function StageStatCard({
  stage,
  locations,
}: {
  stage: Stage;
  locations: Location[];
}) {
  // Display Strings für das Startdatum, Dauer, Distanz und Durchschnittsgeschwindigkeit
  const date: string = formatDate(stage.startedAt, DateFormat.DATE);
  const durationString: string = getStageDurationString(stage);
  const distanceString: string = getStageDistanceString(stage);
  const avgSpeedString: string = getStageAvgSpeedString(stage);

  const Header = () => {
    return (
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text category="h5" style={styles.title}>
            Statistiken
          </Text>
          <Text appearance="hint" style={styles.date}>
            vom {date}
          </Text>
        </View>
        <Button
          status="primary"
          appearance="ghost"
          accessoryLeft={ShareIcon}
          onPress={() => shareStage(stage)}
        />
      </View>
    );
  };

  const StartEnd = () => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={styles.startEndContainer}>
          <IconStat
            icon="dot-circle"
            iconWidth={25}
            iconHeight={23}
            status="basic"
          >
            {getCoordinateString(locations[0])}
          </IconStat>
          <IconStat
            icon="location-dot"
            iconWidth={25}
            iconHeight={23}
            status="basic"
          >
            {getCoordinateString(locations[locations.length - 1])}
          </IconStat>
        </View>
        <View style={styles.startEndContainer}>
          <Text appearance="hint" style={styles.timeString}>
            {formatDate(locations[0].recordedAt ?? 0, DateFormat.TIME)}
          </Text>
          <Text appearance="hint" style={styles.timeString}>
            {formatDate(
              locations[locations.length - 1].recordedAt ?? 0,
              DateFormat.TIME,
            )}
          </Text>
        </View>
      </View>
    );
  };

  const Stats = () => {
    return (
      <View style={styles.statContainer}>
        <IconStat icon="arrows-left-right" status="primary" fontSize={20}>
          {distanceString}
        </IconStat>
        <IconStat icon="clock-rotate-left" status="primary" fontSize={20}>
          {durationString}
        </IconStat>
        <IconStat icon="gauge-high" status="primary" fontSize={20}>
          {avgSpeedString}
        </IconStat>
      </View>
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
    >
      {locations?.length > 0 && <StartEnd />}
      <Stats />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    marginTop: 10,
    marginLeft: 15,
    marginBottom: 10,
  },
  date: {
    marginLeft: 10,
    fontSize: 18,
  },
  startEndContainer: {
    justifyContent: "space-between",
    gap: 7,
  },
  timeString: {
    fontSize: 17,
  },
  statContainer: {
    justifyContent: "space-between",
    gap: 3,
    marginTop: 15,
  },
});
