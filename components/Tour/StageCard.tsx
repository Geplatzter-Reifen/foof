import React from "react";
import { DATE, dateFormat, getDurationFormatted } from "@/utils/dateUtil";

import { Stage } from "@/model/model";
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
import { shareStage } from "@/services/sharingService";

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

export default function StageCard({ stage }: { stage: Stage }) {
  const startedAt: Date = new Date(stage.startedAt);
  let finishedAt: Date | undefined = stage.finishedAt
    ? new Date(stage.finishedAt)
    : undefined;

  const date: string = dateFormat(startedAt, DATE);

  let duration: string | undefined = finishedAt
    ? getDurationFormatted(startedAt, finishedAt)
    : getDurationFormatted(startedAt, new Date(Date.now()));

  const distance: string = stage.distance.toFixed(1);

  const avgSpeed: string = stage.avgSpeed.toFixed(1);

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
      >
        <View style={styles.stat}>
          <FontAwesomeIcon
            icon="arrows-left-right"
            size={19}
            color={foofDarkTheme["color-primary-500"]}
            style={styles.icon}
          />
          <Text style={styles.statLabel}>{distance} km</Text>
        </View>
        {duration && (
          <View style={styles.stat}>
            <FontAwesomeIcon
              icon="clock"
              size={19}
              color={foofDarkTheme["color-primary-500"]}
              style={styles.icon}
            />
            <Text style={styles.statLabel}>{duration}</Text>
          </View>
        )}
        <View style={styles.stat}>
          <FontAwesomeIcon
            icon="gauge-high"
            size={19}
            color={foofDarkTheme["color-primary-500"]}
            style={styles.icon}
          />
          <Text style={styles.statLabel}>{avgSpeed} km/h</Text>
        </View>
        <Text appearance="hint" style={styles.date}>
          {date}
        </Text>
      </Card>
    </Layout>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    marginHorizontal: 10,
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
  stat: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonGroup: {
    flexDirection: "row",
  },
  icon: {
    marginRight: 10,
  },
  statLabel: {
    fontSize: 17,
  },
  date: {
    marginTop: 5,
  },
});
