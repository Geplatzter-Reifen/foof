import React from "react";
import { DateFormat, formatDate, getDurationFormatted } from "@/utils/dateUtil";

import { Stage } from "@/database/model/model";

import { Button, Card, Icon, IconElement, Text } from "@ui-kitten/components";
import { ImageProps, StyleSheet, View } from "react-native";
import customStyles from "../../constants/styles";
import { withObservables } from "@nozbe/watermelondb/react";
import { shareStage } from "@/services/sharingService";

const ShareIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon
    {...props}
    name="share-nodes"
    style={[props?.style, { height: 20, width: "auto" }]}
  />
);

function StageStatCard({ stage }: { stage: Stage }) {
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
        <Text category="h5" style={styles.title}>
          Statistiken
        </Text>
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
    return <View></View>;
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
      <Text appearance="hint">vom {date}</Text>
      <StartEnd />
    </Card>
  );
}

// Observe die reingegebene Prop "stage"und reagiere auf änderungen
const enhance = withObservables(["stage"], ({ stage }) => ({ stage }));
export default enhance(StageStatCard);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginBottom: 5,
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
  stat: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
