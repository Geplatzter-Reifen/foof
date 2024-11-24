import React, { useState, useEffect } from "react";
import { Text, Layout, Card, Button } from "@ui-kitten/components";
import ButtonGroup from "../../../components/Stage/ButtonGroup";
import CoordinateInput from "../../../components/Stage/CoordinateInput";
import { StyleSheet } from "react-native";
import CardComponent from "../../../components/Stage/CardComponent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Input } from "@ui-kitten/components";
import { createManualStage as createManualStageFn } from "@/services/tracking";

const createManualStage: React.FC = () => {
  const { tourId } = useLocalSearchParams<{ tourId: string }>();
  const navigation = useNavigation(); ///changing the title of the page
  const [titleBeingChanged, setTitleBeingChanged] = useState(false); //// switches title from plain text to the input field
  const [stageTitle, setStageTitle] = useState("Stage"); ///the name of the title
  const router = useRouter();
  ////////////compass input variant
  const [startLat, setStartLat] = useState("");
  const [startLon, setStartLon] = useState("");
  const [startDate, setStartDate] = useState(new Date());

  const [endLat, setEndLat] = useState("");
  const [endLon, setEndLon] = useState("");
  const [endDate, setEndDate] = useState(new Date());

  ////////////address input variant

  ////////////on the map input variant

  // Title input field
  const titleInput = (
    <Layout style={styles.headerInput}>
      <Input
        value={stageTitle}
        onChangeText={(nextValue) => setStageTitle(nextValue)} // Update title
        maxLength={20} // Restrict input to 20 characters
      />
    </Layout>
  );

  // Button to toggle editing
  const changingTitleButton = (
    <Button
      appearance="ghost"
      onPress={() => setTitleBeingChanged((prevState) => !prevState)} // Toggle edit mode
    >
      {titleBeingChanged ? (
        <FontAwesomeIcon icon="check" size={25} /> // Accept changes
      ) : (
        <FontAwesomeIcon icon="edit" size={25} /> // Edit title
      )}
    </Button>
  );

  // Update header options whenever the title or edit state changes
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () =>
        titleBeingChanged ? (
          titleInput
        ) : (
          <Text category="h4" status="primary">
            {stageTitle}
          </Text>
        ), // Switch between input and title
      headerRight: () => changingTitleButton, // Set the button on the right
      headerTitleAlign: "center", // Keep the title centered
    });
  }, [navigation, titleBeingChanged, stageTitle]);

  ////coordinate start input
  const startCoordInput = (
    <CoordinateInput
      lat={startLat}
      lon={startLon}
      setLat={setStartLat}
      setLon={setStartLon}
      date={startDate}
      setDate={setStartDate}
    />
  );
  ////coordinate start input
  const endCoordInput = (
    <CoordinateInput
      lat={endLat}
      lon={endLon}
      setLat={setEndLat}
      setLon={setEndLon}
      date={endDate}
      setDate={setEndDate}
    />
  );

  // stageName: string,
  //     startingCoordinatesString: string,
  //     endCoordinatesString: string,
  //     startTime:Date,
  //     endTime:Date,
  //     tourId?: string,
  const onSubmitEtappe = async () => {
    console.log("button presed!");
    console.log("title--> " + stageTitle);
    console.log("start--> " + startLat + ", " + startLon);
    console.log("end--> " + endLat + ", " + endLon);
    console.log("startDate" + startDate);
    console.log("endDate" + endDate);
    console.log("tourID" + tourId);
    try {
      await createManualStageFn(
        stageTitle,
        startLat + ", " + startLon,
        endLat + ", " + endLon,
        startDate,
        endDate,
        tourId,
      );
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
      }
    }
    console.log("title--> " + stageTitle);
    console.log("start--> " + startLat + ", " + startLon);
    console.log("end--> " + endLat + ", " + endLon);
    console.log("startDate" + startDate);
    console.log("endDate" + endDate);
    console.log("tourID" + tourId);
    router.back();
  };

  return (
    <Layout style={styles.layout} level="2">
      <ButtonGroup>
        <Button style={styles.button} onPress={() => {}}>
          <FontAwesomeIcon icon="compass" size={25} />
        </Button>
        <Button style={styles.button} onPress={() => {}}>
          <FontAwesomeIcon icon="map-pin" size={25} />
        </Button>
        <Button style={styles.button} onPress={() => {}}>
          <FontAwesomeIcon icon="city" size={25} />
        </Button>
      </ButtonGroup>

      <Layout style={styles.cardsContainer} level="2">
        <CardComponent title="Start" form={startCoordInput} />

        <CardComponent title="Ende" form={endCoordInput} />
      </Layout>
      <ButtonGroup>
        <Button
          style={styles.button}
          onPress={() => {
            router.back();
          }}
        >
          <Text category="h1">ABBRECHEN</Text>
        </Button>
        <Button
          style={styles.button}
          onPress={() => {
            onSubmitEtappe();
          }}
        >
          <Text category="h1">ERSTELLEN</Text>
        </Button>
      </ButtonGroup>
    </Layout>
  );
};

export default createManualStage;

const styles = StyleSheet.create({
  cardsContainer: {
    flex: 7, // Takes up the majority of the remaining space
    flexDirection: "column", // Arrange cards in a column
  },
  layout: {
    flex: 1,
    alignItems: "stretch",
    paddingVertical: 5,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    alignSelf: "center",
  },
  headerInput: {
    justifyContent: "space-around",
    alignItems: "center",
  },
});
