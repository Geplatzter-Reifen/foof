import {
  Divider,
  Icon,
  IconElement,
  Input,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import { ImageProps, Platform, StatusBar, StyleSheet } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { updateTourNameById } from "@/services/data/tourService";

const BackIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="chevron-left" style={[props?.style, { height: 24 }]} />
);

type TourenParams = {
  tourId: string;
  tourTitle: string;
};

export default function Touren() {
  const params = useLocalSearchParams() as TourenParams;
  const { tourId, tourTitle } = params;
  const [tourname, setTourname] = useState(tourTitle);

  const updateTourname = (newTourName: string) => {
    updateTourNameById(tourId, newTourName).then(() => {
      setTourname(newTourName);
    });
  };

  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={BackIcon}
      hitSlop={15}
      onPress={() => router.back()}
    />
  );

  return (
    <Layout style={styles.container}>
      <TopNavigation
        title={() => <Text category={"h4"}>Touren</Text>}
        accessoryLeft={renderBackAction}
        style={styles.header}
        alignment={"center"}
      ></TopNavigation>
      <Divider />
      <Layout style={styles.body}>
        <Text category={"h4"}>Tourname ändern</Text>
        <Text>Aktueller Tourname: {tourname}</Text>
        <Input
          placeholder={"Neuer Tourname"}
          onSubmitEditing={(event) => updateTourname(event.nativeEvent.text)}
        ></Input>
      </Layout>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  body: {
    margin: 15,
    alignItems: "center",
  },
});
