import React, { useState, useEffect, useMemo } from "react";
import { Text, Layout, Button, TabBar, Tab } from "@ui-kitten/components";
import ButtonGroup from "../../../components/Buttons/ButtonGroup";
import CoordinateInput from "../../../components/Stage/CoordinateInput";
import { StyleSheet } from "react-native";
import CardComponent from "../../../components/Stage/CardComponent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Input, useTheme } from "@ui-kitten/components";
import { createManualStage as createManualStageFn } from "@/services/tracking";
import { Alert } from "react-native";
import { ButtonSwitch } from "@/components/Buttons/ButtonSwitch";
import type { Position } from "geojson";
import MapWithMarkers from "@/components/Map/MapWithMarkers";

const CreateManualStage: React.FC = () => {
  const { tourId } = useLocalSearchParams<{ tourId: string }>();
  // changing the title of the page
  const navigation = useNavigation();
  //switches title from plain text to the input field
  const [titleBeingChanged, setTitleBeingChanged] = useState(false);
  const [stageTitle, setStageTitle] = useState("Etappe"); ///the name of the title
  const router = useRouter();
  // compass input
  const [startLatitude, setStartLatitude] = useState("");
  const [startLongitude, setStartLongitude] = useState("");
  const [startDate, setStartDate] = useState(new Date());

  const [endLatitude, setEndLatitude] = useState("");
  const [endLongitude, setEndLongitude] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const theme = useTheme();

  ////////////address input

  ////////////on the map input

  const titleInput = useMemo(
    () => (
      <Layout style={styles.headerInput}>
        <Input
          value={stageTitle}
          onChangeText={(nextValue) => setStageTitle(nextValue)}
          maxLength={20}
        />
      </Layout>
    ),
    [stageTitle],
  );

  //switching between done and edit

  const changingTitleButton = useMemo(
    () => (
      <Button
        appearance="ghost"
        onPress={() => setTitleBeingChanged((prevState) => !prevState)}
      >
        {titleBeingChanged ? (
          <FontAwesomeIcon icon="check" size={25} />
        ) : (
          <FontAwesomeIcon icon="edit" size={25} />
        )}
      </Button>
    ),
    [titleBeingChanged],
  );

  // Update header input ot text based on if title or edit state changes
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () =>
        titleBeingChanged ? (
          titleInput
        ) : (
          <Text category="h4">{stageTitle}</Text>
        ), // Switch between input and title
      headerRight: () => changingTitleButton, // Set the button on the right
      headerTitleAlign: "center", // Keep the title centered
    });
  }, [
    navigation,
    titleInput,
    changingTitleButton,
    titleBeingChanged,
    stageTitle,
  ]);

  const startCoordInput = (
    <CoordinateInput
      latitude={startLatitude}
      longitude={startLongitude}
      setLatitude={setStartLatitude}
      setLongitude={setStartLongitude}
      date={startDate}
      setDate={setStartDate}
    />
  );

  const endCoordInput = (
    <CoordinateInput
      latitude={endLatitude}
      longitude={endLongitude}
      setLatitude={setEndLatitude}
      setLongitude={setEndLongitude}
      date={endDate}
      setDate={setEndDate}
    />
  );

  const onSubmitStage = async () => {
    try {
      await createManualStageFn(
        stageTitle,
        startLatitude + ", " + startLongitude,
        endLatitude + ", " + endLongitude,
        startDate,
        endDate,
        tourId,
      );
      router.back();
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert("Error", err.message);
      } else {
        Alert.alert("Unknown Error", "An unexpected error occurred.");
      }
    }
  };

  const [selectedIndex, setSelectedIndex] = useState(0);

  const setCoordinate = (coordinate: Position) => {
    if (selectedIndex === 0) {
      setStartLatitude(coordinate[1].toString());
      setStartLongitude(coordinate[0].toString());
    } else {
      setEndLatitude(coordinate[1].toString());
      setEndLongitude(coordinate[0].toString());
    }
    console.log(coordinate);
  };

  const TopTapBar = (): React.ReactElement => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    return (
      <>
        <TabBar
          style={{ height: 50 }}
          selectedIndex={selectedIndex}
          onSelect={(index) => setSelectedIndex(index)}
        >
          <Tab title="Start" />
          <Tab title="Ende" />
        </TabBar>
        <MapWithMarkers
          markerIndex={selectedIndex}
          onCoordinateChange={setCoordinate}
        />
      </>
    );
  };

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return (
          <>
            <CardComponent title="Start" form={startCoordInput} />
            <CardComponent title="Ende" form={endCoordInput} />
          </>
        );
      case 1:
        return (
          <>
            <TopTapBar />
          </>
        );
      case 2:
        return <Text>City Input</Text>;
      default:
        return null;
    }
  };

  return (
    <Layout style={styles.layout} level="2">
      <ButtonSwitch
        onSelect={(index) => {
          if (index < 2) {
            setSelectedIndex(index);
          }
        }}
        selectedIndex={selectedIndex}
      >
        <Button style={styles.button}>
          <FontAwesomeIcon icon="compass" size={25} />
        </Button>
        <Button style={styles.button}>
          <FontAwesomeIcon icon="map-pin" size={25} />
        </Button>
        <Button style={styles.button}>
          <FontAwesomeIcon icon="city" size={25} />
        </Button>
      </ButtonSwitch>

      <Layout style={styles.cardsContainer} level="2">
        {renderContent()}
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
        <Button style={styles.button} onPress={onSubmitStage}>
          <Text category="h1">ERSTELLEN</Text>
        </Button>
      </ButtonGroup>
    </Layout>
  );
};

export default CreateManualStage;

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
