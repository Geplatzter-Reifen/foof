import React from "react";
import { DATE, dateFormat, getDuration, TIME } from "@/utils/dateUtil";
import { Trip } from "@/model/model";
import { Button, Card, Layout, Text } from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { deleteTrip } from "@/model/database_functions";
import { StyleSheet, View } from "react-native";

export default function TripCard({ trip }: { trip: Trip }) {
  const startedAt: Date = new Date(trip.startedAt);
  let finishedAt: Date | undefined = trip.finishedAt
    ? new Date(trip.finishedAt)
    : undefined;

  const date: string = dateFormat(startedAt, DATE);

  let duration: string | undefined =
    startedAt && finishedAt
      ? getDuration(startedAt, finishedAt, TIME)
      : undefined;

  const distance: string = trip.distance.toFixed(1);

  return (
    <Layout level="3">
      <Card style={styles.card}>
        <Text category="h4" status="primary">
          {trip.title}
        </Text>
        <Text>{date}</Text>
        {duration && <Text>{"Dauer: " + duration}</Text>}
        <Text>Distanz: {distance} km</Text>
        <View>
          <Button status="basic" onPress={() => deleteTrip(trip.id)}>
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
