import { Input, Layout, Text } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { updateTourNameById } from "@/model/database_functions";

export default function Touren() {
  const params = useLocalSearchParams() as {
    tourId: string;
    tourTitle: string;
  };
  const { tourId, tourTitle } = params;
  const [tourname, setTourname] = useState(tourTitle);

  const updateTourname = (newTourName: string) => {
    updateTourNameById(tourId, newTourName).then(() => {
      setTourname(newTourName);
    });
  };

  return (
    <Layout style={styles.container}>
      <Text category={"h4"}>Tourname ändern</Text>
      <Text>Aktueller Tourname: {tourname}</Text>
      <Input
        placeholder={"Neuer Tourname"}
        onSubmitEditing={(event) => updateTourname(event.nativeEvent.text)}
      ></Input>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
