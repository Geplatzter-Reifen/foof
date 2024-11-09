import React from "react";
import { DATE, dateFormat, getDuration, TIME } from "@/utils/dateUtil";
import { Trip } from "@/model/model";
import { Button, Card, Text } from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { deleteTrip, finishTrip } from "@/model/database_functions";
import { View } from "react-native";

export default function TripCard({ trip }: { trip: Trip }) {
  const startedAt: Date | undefined = trip.startedAt
    ? new Date(trip.startedAt)
    : undefined;
  let finishedAt: Date | undefined = trip.finishedAt
    ? new Date(trip.finishedAt)
    : undefined;

  const date: string | undefined = startedAt
    ? dateFormat(startedAt, DATE)
    : undefined;

  let duration: string | undefined =
    startedAt && finishedAt
      ? getDuration(startedAt, finishedAt, TIME)
      : undefined;

  async function setFinishedAt() {
    const finishTime = Date.now();
    await finishTrip(trip.id, Date.now());

    finishedAt = new Date(finishTime);
    duration = startedAt ? getDuration(startedAt, finishedAt, TIME) : undefined;
  }

  return (
    <Card>
      <Text category="h4" status="primary">
        {trip.title}
      </Text>
      <Text>{date}</Text>
      {duration && <Text>Dauer: {duration}</Text>}
      <View>
        {!finishedAt && (
          <Button status="basic" onPress={() => setFinishedAt()}>
            <FontAwesomeIcon icon="flag" />
          </Button>
        )}
        <Button status="basic" onPress={() => deleteTrip(trip.id)}>
          <FontAwesomeIcon icon="trash" />
        </Button>
      </View>
    </Card>
  );
}
