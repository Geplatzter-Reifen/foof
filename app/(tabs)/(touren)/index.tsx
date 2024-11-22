import { ImageProps, Platform, StatusBar, StyleSheet } from "react-native";
import { router } from "expo-router";
import { getActiveTour } from "@/model/database_functions";
import React, { useEffect, useState } from "react";
import { Tour } from "@/model/model";
import { Layout, Button, Text, IconElement, Icon } from "@ui-kitten/components";
import { withObservables } from "@nozbe/watermelondb/react";

export default function Touruebersicht() {
  const [activeTour, setActiveTour] = useState<Tour>();

  useEffect(() => {
    (async () => {
      const activeTour = await getActiveTour();
      if (activeTour) {
        setActiveTour(activeTour);
      }
    })();
  }, []);

  const MapIcon = (props?: Partial<ImageProps>): IconElement => (
    <Icon
      {...props}
      name="map"
      style={[props?.style, { height: 24, width: "100%" }]}
    />
  );

  const EditIcon = (props?: Partial<ImageProps>): IconElement => (
    <Icon
      {...props}
      name="edit"
      style={[props?.style, { height: 24, width: "100%" }]}
    />
  );

  const PlusIcon = (props?: Partial<ImageProps>): IconElement => (
    <Icon
      {...props}
      name="plus"
      style={[props?.style, { height: 40, width: "100%" }]}
    />
  );

  if (!activeTour) {
    return null;
  }

  return (
    <Layout style={styles.container}>
      <Layout style={styles.header}>
        <Button
          status={"basic"}
          appearance={"ghost"}
          accessoryRight={MapIcon}
        />
        <EnhancedHeader tour={activeTour}></EnhancedHeader>
        <Button
          status={"basic"}
          appearance={"ghost"}
          accessoryRight={EditIcon}
          onPress={() =>
            router.push({
              pathname: "./touren",
              params: {
                tourId: activeTour?.id,
                tourTitle: activeTour?.title,
              },
            })
          }
        />
      </Layout>
      <Layout style={[styles.box, { zIndex: -1 }]}>
        <Text>This is a text box</Text>
      </Layout>
      <Text status={"primary"} category="h4" style={styles.header2}>
        Etappen
      </Text>
      <Button style={styles.button} accessoryLeft={PlusIcon}></Button>
    </Layout>
  );
}

const Header = ({ tour }: { tour: Tour }) => (
  <Text category="h4" status={"primary"} style={styles.headerText}>
    {tour.title}
  </Text>
);

const enhance = withObservables(["tour"], ({ tour }) => ({
  tour,
}));
const EnhancedHeader = enhance(Header);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexDirection: "row",
    alignItems: "center",
    elevation: 6,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
  },
  box: {
    padding: 40,
    backgroundColor: "#EDCBB4",
    elevation: 3,
  },
  header2: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: "left",
  },
  button: {
    position: "absolute",
    bottom: 35,
    right: 15,
    width: 80,
    height: 80,
    borderRadius: 50,
    elevation: 3,
  },
});
