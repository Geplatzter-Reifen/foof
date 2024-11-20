import React from "react";
import { DATE, dateFormat, getDuration, TIME } from "@/utils/dateUtil";
import { Stage } from "@/model/model";
import { Button, Card, Layout, Text } from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { deleteStage } from "@/model/database_functions";
import { StyleSheet, View } from "react-native";

export default function StageCard({ stage }: { stage: Stage }) {
  const startedAt: Date = new Date(stage.startedAt);
  let finishedAt: Date | undefined = stage.finishedAt
    ? new Date(stage.finishedAt)
    : undefined;

  const date: string = dateFormat(startedAt, DATE);

  let duration: string | undefined =
    startedAt && finishedAt
      ? getDuration(startedAt, finishedAt, TIME)
      : undefined;

  const distance: string = stage.distance.toFixed(1);

  return (
    <Layout level="2">
      <Card style={styles.card}>
        <Text category="h4" status="primary">
          {stage.title}
        </Text>
        <Text>{date}</Text>
        {duration && <Text>{"Dauer: " + duration}</Text>}
        <Text>Distanz: {distance} km</Text>
        <View>
          <Button status="basic" onPress={() => deleteStage(stage.id)}>
            <FontAwesomeIcon icon="trash" />
          </Button>
        </View>
      </Card>
    </Layout>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 0,
  },
});
