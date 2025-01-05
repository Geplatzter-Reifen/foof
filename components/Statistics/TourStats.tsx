import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { formatDate, DateFormat } from "@/utils/dateUtils";
import { Icon, Text, ThemeType, useTheme } from "@ui-kitten/components";
import { Tour, Stage } from "@/database/model/model";
import {
  getTourDurationString,
  getTourDistanceString,
  getTourAverageSpeedString,
  getTourProgress,
} from "@/services/statisticsService";
import { withObservables } from "@nozbe/watermelondb/react";
import { TourProgressBar } from "@/components/Statistics/TourProgressBar";

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
      <TourProgressBar progress={progress} style={styles.progressContainer} />

      <View style={styles.statsContainer}>
        <View style={styles.stat_column}>
          <View style={styles.stat_row}>
            <Icon name="arrows-left-right" style={styles.icon_style} />
            <Text>{getTourDistanceString(stages)}</Text>
          </View>
          <View style={styles.stat_row}>
            <Icon name="arrow-up-right-dots" style={styles.icon_style} />
            <Text>{"0 m"}</Text>
          </View>
          <View style={styles.stat_row}>
            <Icon name="gauge-high" style={styles.icon_style} />
            <Text>{getTourAverageSpeedString(stages)}</Text>
          </View>
          <View style={styles.stat_row}>
            <Icon name="bolt" style={styles.icon_style} />
            <Text>{0 + " kcal"}</Text>
          </View>
        </View>
        <View style={styles.stat_column}>
          <View style={styles.stat_row}>
            <Icon name="calendar-plus" style={styles.icon_style} />
            <Text>
              {tour.startedAt
                ? formatDate(tour.startedAt, DateFormat.DATE)
                : "--"}
            </Text>
          </View>
          {tour.finishedAt && (
            <View style={styles.stat_row}>
              <Icon name="calendar-check" style={styles.icon_style} />
              <Text>{formatDate(tour.finishedAt, DateFormat.DATE)}</Text>
            </View>
          )}
          <View style={styles.stat_row}>
            <Icon name="clock" style={styles.icon_style} />
            <Text>{getTourDurationString(stages)}</Text>
          </View>
        </View>
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
      backgroundColor: theme["color-primary-transparent-500"],
    },
    progressContainer: {
      padding: 8,
      margin: 10,
      marginBottom: 0,
    },
    progressBar: {
      height: 27,
      //@ts-ignore
      indicatorColor: theme["color-primary-500"],
      backgroundColor: theme["background-basic-color-2"],
      borderRadius: 6,
    },
    statsContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: "auto",
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    stat_column: {
      flex: 1,
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
    stat_row: {
      flexDirection: "row",
      alignItems: "center",
    },
    icon_style: {
      alignSelf: "center",
      marginHorizontal: 4,
      height: 15,
      width: "100%",
      minWidth: 17,
    },
  });
};
