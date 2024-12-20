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
import { router } from "expo-router";

const ShareIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon
    {...props}
    name="share-nodes"
    style={[props?.style, { height: 18, width: "auto" }]}
  />
);

function StageCard({ stage }: { stage: Stage }) {
  const startedAt: Date = new Date(stage.startedAt);
  let finishedAt: Date | undefined = stage.finishedAt
    ? new Date(stage.finishedAt)
    : undefined;

  const date: string = formatDate(startedAt, DateFormat.DATE);

  let duration: string | undefined = finishedAt
    ? getDurationFormatted(startedAt, finishedAt)
    : getDurationFormatted(startedAt, new Date(Date.now()));

  const distance: string = stage.distance.toFixed(1);

  const avgSpeed: string = stage.avgSpeed.toFixed(1);

  const Header = () => {
    return (
      <View style={styles.header}>
        <Text category="h6" style={styles.title}>
          Statistik
        </Text>
        <View style={styles.buttonGroup}>
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
    <Card
      style={{
        ...customStyles.basicCard,
        ...customStyles.basicShadow,
        ...styles.card,
      }}
      header={<Text>Statistik</Text>}
    ></Card>
  );
}

// Observe die reingegebene Prop "stage"und reagiere auf änderungen
const enhance = withObservables(["stage"], ({ stage }) => ({ stage }));
export default enhance(StageCard);

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
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
