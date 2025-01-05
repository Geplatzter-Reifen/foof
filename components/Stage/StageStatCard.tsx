import React, { useEffect, useState } from "react";
import { DateFormat, formatDate } from "@/utils/dateUtils";

import { Location, Stage } from "@/database/model/model";

import { Button, Card, Icon, IconElement, Text } from "@ui-kitten/components";
import { ImageProps, StyleSheet, View } from "react-native";
import customStyles from "../../constants/styles";
import { shareStage } from "@/services/sharingService";
import IconStat from "@/components/Statistics/IconStat";
import {
  getStageAvgSpeedString,
  getStageDistanceString,
  getStageDurationString,
} from "@/services/statisticsService";
import { fetchPlaceName } from "@/services/geoService";

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
  const startLocation: Location = locations[0];
  const [startName, setStartName] = useState("Von");
  const endLocation: Location = locations[locations.length - 1];
  const [endName, setEndName] = useState("Nach");

  useEffect(() => {
    const getStartAndEndNames = async () => {
      const start = await fetchPlaceName(startLocation);
      if (start) {
        setStartName(start);
      }
      const end = await fetchPlaceName(endLocation);
      if (end) {
        setEndName(end);
      }
    };

    void getStartAndEndNames();
  }, [startLocation, endLocation]);

  // Header der Kachel: Titel, Datum, Teilen-Button
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

  // Start- und Zieladressen, Start- und Endzeitpunkt
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
            {startName}
          </IconStat>
          <IconStat
            icon="location-dot"
            iconWidth={25}
            iconHeight={23}
            status="basic"
          >
            {endName}
          </IconStat>
        </View>
        <View style={styles.startEndTimeContainer}>
          <Text appearance="hint" style={styles.timeString}>
            {formatDate(startLocation.recordedAt ?? 0, DateFormat.TIME)}
          </Text>
          <Text appearance="hint" style={styles.timeString}>
            {formatDate(endLocation.recordedAt ?? 0, DateFormat.TIME)}
          </Text>
        </View>
      </View>
    );
  };

  // Distanz, Dauer, Durchschnittsgeschwindigkeit
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
      disabled={true}
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
    flex: 6,
    justifyContent: "space-between",
    gap: 7,
  },
  startEndTimeContainer: {
    flex: 1,
    justifyContent: "space-between",
    gap: 7,
  },
  timeString: {
    fontSize: 17,
    textAlign: "right",
  },
  statContainer: {
    justifyContent: "space-between",
    gap: 3,
    marginTop: 15,
  },
});
