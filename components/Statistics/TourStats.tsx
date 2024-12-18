import React from "react";
import { DimensionValue, StyleSheet, View } from "react-native";
import {
  formatDate,
  DateFormat,
  getTotalMillisecondsString,
} from "@/utils/dateUtil";
import {
  Icon,
  ProgressBar,
  Text,
  ThemeType,
  useTheme,
} from "@ui-kitten/components";
import { Tour, Stage } from "@/database/model/model";
import {
  getTourDuration,
  getTourDistance,
  getTourAverageSpeed,
} from "@/services/statisticsService";
import { withObservables } from "@nozbe/watermelondb/react";

let activeTour: Tour | undefined = undefined;
let tourStages: Stage[] = [];

function TourStats() {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const progress = getTourDistance(tourStages) / 1001;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} style={styles.progressBar} />
        <Text
          style={{
            position: "absolute",
            top: "28%",
            left:
              progress < 0.18
                ? (`${((progress + 0.04) * 100).toFixed(2)}%` as DimensionValue)
                : progress < 1
                  ? (`${((progress - 0.125) * 100).toFixed(2)}%` as DimensionValue)
                  : ("44%" as DimensionValue),
            color: progress >= 0.15 ? "#fff" : theme["text-basic-color"],
            fontSize: 19,
          }}
        >
          {(progress * 100).toFixed(1) + "%"}
        </Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.stat_column}>
          <View style={styles.stat_row}>
            <Icon name="arrows-left-right" style={styles.icon_style} />
            <Text>{getTourDistance(tourStages).toFixed(1) + " km"}</Text>
          </View>
          <View style={styles.stat_row}>
            <Icon name="arrow-up-right-dots" style={styles.icon_style} />
            <Text>{"0 m"}</Text>
          </View>
          <View style={styles.stat_row}>
            <Icon name="gauge-high" style={styles.icon_style} />
            <Text>{getTourAverageSpeed(tourStages).toFixed(1) + " km/h"}</Text>
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
              {activeTour!.startedAt
                ? formatDate(activeTour!.startedAt, DateFormat.DATE)
                : "--"}
            </Text>
          </View>
          {activeTour!.finishedAt && (
            <View style={styles.stat_row}>
              <Icon name="calendar-check" style={styles.icon_style} />
              <Text>{formatDate(activeTour!.finishedAt, DateFormat.DATE)}</Text>
            </View>
          )}
          <View style={styles.stat_row}>
            <Icon name="clock" style={styles.icon_style} />
            <Text>
              {getTotalMillisecondsString(getTourDuration(tourStages))}
            </Text>
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
const Bridge = ({ stages }: { stages: Stage[] }) => {
  tourStages = stages;
  for (const stage of stages) {
    if (stage.isActive) {
      return <EnhancedTourStats stage={stage} />;
    }
  }
  return <TourStats />;
};

// observe stages of a tour (only tracks create and delete in the stages table)
const enhanceV2 = withObservables(["tour"], ({ tour }: { tour: Tour }) => {
  activeTour = tour;
  return {
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
