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
        <View style={styles.stat_row}>
          <Icon name="calendar-check" style={styles.icon_style} />
          <Text>{props.endDate ? dateFormat(props.endDate, DATE) : "--"}</Text>
        </View>
      </View>
      <View style={styles.stat_column}>
        <View style={styles.stat_row}>
          <Icon name="arrows-left-right" style={styles.icon_style} />
          <Text>{props.distance ? props.distance + " km/h" : "--"}</Text>
        </View>
        <View style={styles.stat_row}>
          <Icon name="arrow-up-right-dots" style={styles.icon_style} />
          <Text>Elevation</Text>
        </View>
        <View style={styles.stat_row}>
          <Icon name="gauge-high" style={styles.icon_style} />
          <Text>Geschwindigkeit</Text>
        </View>
        <View style={styles.stat_row}>
          <Icon name="bolt" style={styles.icon_style} />
          <Text>Kalorien</Text>
        </View>
      </View>
    </View>
    /*<Layout style={styles.container}>
      <View style={styles.stat_row}>
        <Icon name="calendar-day" style={styles.icon_style} />
        <Text>Start</Text>

        <Icon name="calendar-check" style={styles.icon_style} />
        <Text>Start</Text>

        <Icon
          name="up-right-and-down-left-from-center"
          style={styles.icon_style}
        />
        <Text>Text</Text>

        <Icon name="bolt" style={styles.icon_style} />
        <Text>Text</Text>

        <View style={styles.stat_row}>
          <Text>Text</Text>
          <Text>Text</Text>
        </View>
      </View>
    </Layout>*/
  );
}

/*
<Layout>
        <Text>
          Start der Tour:{" "}
          {tour?.startedAt ? dateFormat(new Date(tour?.startedAt), DATE) : ""}
        </Text>
        <Text>{"Status: " + (tour?.isActive ? "aktiv" : "inaktiv")}</Text>
        {tour?.isActive ? (
          <Button status="basic" onPress={toggleTourStatus}>
            deaktivieren
          </Button>
        ) : (
          <Button status="info" onPress={toggleTourStatus}>
            Zur Aktiven Tour Machen
          </Button>
        )}
      </Layout>
*/

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
      marginHorizontal: 4,
      height: 15,
    },
  });
};
