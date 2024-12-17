import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { formatDate, DateFormat } from "@/utils/dateUtil";
import { Icon, Text, ThemeType, useTheme } from "@ui-kitten/components";
import { Tour, Stage } from "@/database/model/model";
import {
  getTourDistance,
  getTourDurationString,
  getTourDistanceString,
  getTourAverageSpeedString,
} from "@/services/statisticsService";
import { TourProgressBar } from "@/components/Statistics/TourProgressBar";

type TourStatsProps = {
  tour: Tour;
};

export default function TourStats(props: TourStatsProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [stages, setStages] = useState<Stage[]>([]);

  useEffect(() => {
    (async () => {
      const getStages = await props.tour.stages.fetch();
      if (getStages) {
        setStages(getStages);
      }
    })();
  }, [props.tour]);

  const progress = getTourDistance(stages) / 1001;

  return (
    <View style={styles.container}>
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
              {props.tour.startedAt
                ? formatDate(props.tour.startedAt, DateFormat.DATE)
                : "--"}
            </Text>
          </View>
          {props.tour.finishedAt && (
            <View style={styles.stat_row}>
              <Icon name="calendar-check" style={styles.icon_style} />
              <Text>{formatDate(props.tour.finishedAt, DateFormat.DATE)}</Text>
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

const makeStyles = (theme: ThemeType): any => {
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
