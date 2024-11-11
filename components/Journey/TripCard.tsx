import React, { useEffect, useState } from "react";
import { DATE, dateFormat, getDuration, TIME } from "@/utils/dateUtil";
import { Trip } from "@/model/model";
import { Button, Card, Layout, Text } from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  deleteTrip,
  getAllLocationsByTripId,
} from "@/model/database_functions";
import { View } from "react-native";
import { Location } from "@/model/model";

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

  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    (async () => {
      setLocations(await getAllLocationsByTripId(trip.id));
    })();
  }, [trip]);

  console.log(locations);

  return (
    <Card>
      <Text category="h4" status="primary">
        {trip.title}
      </Text>
      <Text>{date}</Text>
      {duration && <Text>Dauer: {duration}</Text>}
      {locations.map((loc) => (
        <Layout key={loc.id}>
          <Text>{"Lat: " + loc.latitude}</Text>
          <Text>{"Lon: " + loc.longitude}</Text>
        </Layout>
      ))}
      <View>
        <Button status="basic" onPress={() => deleteTrip(trip.id)}>
          <FontAwesomeIcon icon="trash" />
        </Button>
      </View>
    </Card>
  );
}
