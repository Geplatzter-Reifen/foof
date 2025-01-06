import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { DateFormat, formatDate } from "@/utils/dateUtils";
import { ThemeType, useTheme } from "@ui-kitten/components";
import { Stage, Tour } from "@/database/model/model";
import {
  getTourAverageSpeedString,
  getTourDistanceString,
  getTourDurationString,
  getTourProgress,
} from "@/services/statisticsService";
import { withObservables } from "@nozbe/watermelondb/react";
import { TourProgressBar } from "@/components/Statistics/TourProgressBar";
import IconStat from "@/components/Statistics/IconStat";

function TourStats({
  stage,
  stages,
  tour,
}: {
  stage?: Stage;
  stages: Stage[];
  tour: Tour;
}) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = async () => {
      setProgress(await getTourProgress(stages));
    };

    void calculateProgress();
  }, [stages]);

  return (
    <View style={styles.container}>
      {/* Fortschrittsbalken über die Tourdistanz*/}
      <TourProgressBar progress={progress} style={styles.progressBar} />

      {/* Tourstatistiken */}
      <View style={styles.statsContainer}>
        {/*Distanz*/}
        <IconStat
          icon="arrows-left-right"
          centered
          status="primary"
          fontSize={20}
          iconWidth={30}
        >
          {getTourDistanceString(stages)}
        </IconStat>
        {/*Dauer*/}
        <IconStat
          icon="clock-rotate-left"
          centered
          status="primary"
          fontSize={20}
          iconWidth={30}
        >
          {getTourDurationString(stages)}
        </IconStat>
        {/*Durchschnittsgeschwindigkeit*/}
        <IconStat
          icon="gauge-high"
          centered
          status="primary"
          fontSize={20}
          iconWidth={30}
        >
          {getTourAverageSpeedString(stages)}
        </IconStat>
      </View>

      {/* Start- und Enddatum der Tour */}
      <View style={styles.dateContainer}>
        <IconStat icon="calendar-plus" status="text">
          {tour.startedAt ? formatDate(tour.startedAt, DateFormat.DATE) : "--"}
        </IconStat>
        <IconStat icon="calendar-check" status="text" reversed>
          {tour.finishedAt
            ? formatDate(tour.finishedAt, DateFormat.DATE)
            : "--"}
        </IconStat>
      </View>
    </View>
  );
}

// observe the stage (tracks updates to the stage)
const enhance = withObservables(["stage"], ({ stage }: { stage: Stage }) => ({
  stage,
}));

const EnhancedTourStats = enhance(TourStats);

// Bridge component that determines which TourStats component to render based on the active stage.
const Bridge = ({ tour, stages }: { tour: Tour; stages: Stage[] }) => {
  for (const stage of stages) {
    if (stage.isActive) {
      return <EnhancedTourStats stage={stage} stages={stages} tour={tour} />;
    }
  }
  return <TourStats stages={stages} tour={tour} />;
};

// observe stages of a tour (only tracks create and delete in the stages table)
const enhanceV2 = withObservables(["tour"], ({ tour }: { tour: Tour }) => {
  return {
    tour,
    stages: tour.stages,
  };
});

const EnhancedTourStatsV2 = enhanceV2(Bridge);

export default EnhancedTourStatsV2;

const makeStyles = (theme: ThemeType) => {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: theme["color-primary-transparent-500"],
    },
    progressBar: {
      marginVertical: 8,
    },
    dateContainer: {
      flexDirection: "row",
      height: "auto",
      justifyContent: "space-between",
      marginTop: 14,
      marginBottom: 3,
      marginHorizontal: 2,
    },
    statsContainer: {
      flexDirection: "row",
      height: "auto",
      justifyContent: "space-between",
      marginTop: 8,
    },
  });
};
