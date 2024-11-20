import React from "react";
import { DATE, dateFormat, getDurationFormatted } from "@/utils/dateUtil";
import { Stage } from "@/model/model";
import { Button, Card, Layout, Text } from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { deleteStage } from "@/model/database_functions";
import { StyleSheet, View } from "react-native";
import customStyles from "../../constants/styles";
import { foofDarkTheme } from "@/constants/custom-theme";

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
        <Button
          status="basic"
          appearance="ghost"
          onPress={() => deleteStage(stage.id)}
        >
          <FontAwesomeIcon icon="trash" />
        </Button>
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
