import React from "react";
import { View, StyleSheet } from "react-native";
import { DATE, dateFormat } from "@/utils/dateUtil";
import { Trip } from "@/model/model";
import { Text } from "@ui-kitten/components";
import { colorTheme } from "@/constants/custom-theme";

export default function TripCard({ trip }: { trip: Trip }) {
  const startedAt: Date | undefined = trip.startedAt
    ? new Date(trip.startedAt)
    : undefined;
  const finishedAt: Date | undefined = trip.finishedAt
    ? new Date(trip.finishedAt)
    : undefined;

  const date: string | undefined = startedAt
    ? dateFormat(startedAt, DATE)
    : undefined;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{trip.title}</Text>
      <Text style={styles.label}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colorTheme["color-primary-500"],
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  info: {
    fontSize: 16,
    color: "#666",
  },
});
