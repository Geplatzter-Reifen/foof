import { StyleSheet, Text, View } from "react-native";
import TripCard, { StreckeData } from "@/components/TripCard";
import { useLocalSearchParams } from "expo-router";
import { DATE, dateFormat } from "@/utils/datUtil";
import { getJourneyByJourneyId } from "@/model/database_functions";
import { useEffect, useState } from "react";
import { Journey } from "@/model/model";
import { Button } from "@ui-kitten/components";

export default function Reiseuebersicht() {
  const { journeyId } = useLocalSearchParams<{ journeyId: string }>();
  const [journey, setJourney] = useState<Journey>();

  useEffect(() => {
    (async () => {
      setJourney(await getJourneyByJourneyId(journeyId));
    })();
  }, [journey, journeyId]);

  return (
    <View style={styles.page}>
      <View style={styles.overview}>
        <Text>
          Start der Reise:{" "}
          {journey?.startedAt
            ? dateFormat(new Date(journey?.startedAt), DATE)
            : ""}
        </Text>
        <Button>Tkljfksdf</Button>
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
