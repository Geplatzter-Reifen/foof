import { StyleSheet, Text, View } from "react-native";
import { DATE, dateFormat } from "@/utils/datUtil";
import TripCard, { StreckeData } from "@/components/TripCard";
import { Journey } from "@/model/model";

export default function ReiseUebersicht({ journey }: { journey: Journey }) {
  return (
    <View style={styles.page}>
      <View style={styles.overview}>
        <Text>
          Start der Reise: {dateFormat(new Date(journey.startedAt), DATE)}
        </Text>
      </View>
      <TripCard
        startLoc={getStreckeData().startLoc}
        endLoc={getStreckeData().endLoc}
        startTime={getStreckeData().startTime}
        endTime={getStreckeData().endTime}
      />
      <TripCard
        startLoc={getStreckeData().startLoc}
        endLoc={getStreckeData().endLoc}
        startTime={getStreckeData().startTime}
        endTime={getStreckeData().endTime}
      />
    </View>
  );
}

function getStreckeData(): StreckeData {
  return {
    startLoc: "50.7019264,7.1303168",
    endLoc: "50.6285290,7.2064826",
    startTime: new Date("2024-11-04T09:12"),
    endTime: new Date("2024-11-04T16:46"),
  };
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  overview: {
    backgroundColor: "#f5f5f5",
    width: "100%",
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
