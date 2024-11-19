import React from "react";
import { DATE, dateFormat, getDurationFormatted, TIME } from "@/utils/dateUtil";
import { Stage } from "@/model/model";
import { Button, Card, Layout, Text } from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { deleteStage } from "@/model/database_functions";
import { StyleSheet, View } from "react-native";
import customStyles from "../../constants/styles";

export default function StageCard({ stage }: { stage: Stage }) {
  const startedAt: Date = new Date(stage.startedAt);
  let finishedAt: Date | undefined = stage.finishedAt
    ? new Date(stage.finishedAt)
    : undefined;

  const date: string = dateFormat(startedAt, DATE);

  let duration: string | undefined =
    startedAt && finishedAt
      ? getDurationFormatted(startedAt, finishedAt, TIME)
      : undefined;

  const distance: string = stage.distance.toFixed(1);

  return (
    <Layout level="3">
      <Card
        style={{
          ...customStyles.basicCard,
          ...customStyles.basicShadow,
          ...styles.card,
        }}
        header={<Text category="h6">{stage.title}</Text>}
      >
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
  },
});
