import { StyleSheet, View } from "react-native";
import { Card } from "@ui-kitten/components";
import {
  getStageDistanceString,
  getStageDurationString,
} from "@/services/statisticsService";
import { Stage } from "@/database/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import customStyles from "@/constants/styles";
import IconStat from "@/components/Statistics/IconStat";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { LocationSubscription } from "expo-location";
import { msToKmh } from "@/utils/unitUtils";

function MapStatisticsBox({ stage }: { stage: Stage }) {
  const [speed, setSpeed] = useState("0"); // Speed in meters/second

  useEffect(() => {
    let subscription: LocationSubscription;

    const startLocationSubscription = async () => {
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          const speed = location.coords.speed || 0;
          setSpeed(msToKmh(speed).toFixed(2));
        },
      );
    };

    startLocationSubscription();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <Card
      style={{
        ...customStyles.basicCard,
        ...customStyles.basicShadow,
      }}
    >
      <View style={styles.statsRow}>
        {/*Distanz*/}
        <IconStat
          icon="arrows-left-right"
          centered
          status="primary"
          fontSize={20}
          iconWidth={30}
          iconHeight={30}
        >
          {getStageDistanceString(stage)}
        </IconStat>
        {/*Dauer*/}
        <IconStat
          icon="clock-rotate-left"
          centered
          status="primary"
          fontSize={20}
          iconWidth={30}
          iconHeight={30}
        >
          {getStageDurationString(stage)}
        </IconStat>
        {/*Durchschnittsgeschwindigkeit*/}
        <IconStat
          icon="gauge-high"
          centered
          status="primary"
          fontSize={20}
          iconWidth={30}
          iconHeight={30}
        >
          {speed}
        </IconStat>
      </View>
    </Card>
  );
}

// observe the stage (tracks updates to the stage)
const enhance = withObservables(["stage"], ({ stage }: { stage: Stage }) => ({
  stage,
}));

const EnhancedMapStatistics = enhance(MapStatisticsBox);

export default EnhancedMapStatistics;

const styles = StyleSheet.create({
  container: {},
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
});
