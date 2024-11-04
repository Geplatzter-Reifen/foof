import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DATE_TIME, dateFormat} from "@/utils/dateFormatter";

export type StreckeData = {
  startLoc: string,
  endLoc: string,
  startTime: Date,
  endTime: Date,
}

export default function StreckeCard(props: StreckeData) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Strecke</Text>
      <Text style={styles.label}>Start:</Text>
      <Text style={styles.info}>{props.startLoc}</Text>
      <Text style={styles.label}>Ziel:</Text>
      <Text style={styles.info}>{props.endLoc}</Text>
      <Text style={styles.label}>Startzeitpunkt:</Text>
      <Text style={styles.info}>{dateFormat(props.startTime, DATE_TIME)}</Text>
      <Text style={styles.label}>Endzeitpunkt:</Text>
      <Text style={styles.info}>{dateFormat(props.endTime, DATE_TIME)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5',
    width: '90%',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  info: {
    fontSize: 16,
    color: '#666',
  },
});