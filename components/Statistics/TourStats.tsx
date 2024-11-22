import React from "react";
import { StyleSheet, View } from "react-native";
import { dateFormat, DATE } from "@/utils/dateUtil";
import { Icon, Text, ThemeType, useTheme } from "@ui-kitten/components";

type TourStatsProps = {
  // Startdate, Enddate (optional), Distance, Elevation, Speed, Calories
  startDate?: number;
  endDate?: number;
  distance?: number;
  elevation?: number;
  speed?: number;
  calories?: number;
};

export default function TourStats(props: TourStatsProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.container}>
      <View style={styles.stat_column}>
        <View style={styles.stat_row}>
          <Icon name="calendar-plus" style={styles.icon_style} />
          <Text>
            {props.startDate ? dateFormat(props.startDate, DATE) : "--"}
          </Text>
        </View>
        {props.endDate && (
          <View style={styles.stat_row}>
            <Icon name="calendar-check" style={styles.icon_style} />
            <Text>{dateFormat(props.endDate, DATE)}</Text>
          </View>
        )}
      </View>
      <View style={styles.stat_column}>
        <View style={styles.stat_row}>
          <Icon name="arrows-left-right" style={styles.icon_style} />
          <Text>{props.distance ? props.distance + " km/h" : "--"}</Text>
        </View>
        <View style={styles.stat_row}>
          <Icon name="arrow-up-right-dots" style={styles.icon_style} />
          <Text>{props.elevation ? props.elevation + " m" : "--"}</Text>
        </View>
        <View style={styles.stat_row}>
          <Icon name="gauge-high" style={styles.icon_style} />
          <Text>{props.speed ? props.speed + " km/h" : "--"}</Text>
        </View>
        <View style={styles.stat_row}>
          <Icon name="bolt" style={styles.icon_style} />
          <Text>{props.calories ? props.calories + " kcal" : "--"}</Text>
        </View>
      </View>
    </View>
  );
}

const makeStyles = (theme: ThemeType): any => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: theme["color-primary-transparent-500"],
      height: "auto",
      paddingHorizontal: 10,
      paddingVertical: 5,
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
