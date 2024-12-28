import { useState, useEffect, useMemo, useRef } from "react";
import { Text, Layout, Button, TabBar, Tab } from "@ui-kitten/components";
import ButtonGroup from "../../../components/Buttons/ButtonGroup";
import CoordinateInput from "../../../components/Stage/CoordinateInput";
import { StyleSheet } from "react-native";
import CardComponent from "../../../components/Stage/CardComponent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Input } from "@ui-kitten/components";
import { createManualStage as createManualStageFn } from "@/services/tracking";
import { Alert } from "react-native";
import { ButtonSwitch } from "@/components/Buttons/ButtonSwitch";
import type { Position } from "geojson";
import MapWithMarkers from "@/components/Map/MapWithMarkers";
import DateModal from "@/components/Modal/DateModal";

type TopTapBarProps = {
  selectedMarkerIndex: number;
  onSelect: (index: number) => void;
};

const TopTapBar = ({ selectedMarkerIndex, onSelect }: TopTapBarProps) => {
  return (
    <TabBar
      style={{ height: 50 }}
      selectedIndex={selectedMarkerIndex}
      onSelect={onSelect}
    >
      <Tab title="Start" />
      <Tab title="Ende" />
    </TabBar>
  );
};

export default function CreateManualStage() {
  const { tourId } = useLocalSearchParams<{ tourId: string }>();
  // changing the title of the page
  const navigation = useNavigation();
  //switches title from plain text to the input field
  const [titleBeingChanged, setTitleBeingChanged] = useState(false);
  const [stageTitle, setStageTitle] = useState("Etappe"); ///the name of the title
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  // compass input
  const startLatitude = useRef<number>();
  const startLongitude = useRef<number>();
  const endLatitude = useRef<number>();
  const endLongitude = useRef<number>();
  const startDate = useRef(new Date());
  const endDate = useRef(new Date());

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

  const submitStage = async () => {
    try {
      await createManualStageFn(
        stageTitle,
        startLatitude.current + ", " + startLongitude.current,
        endLatitude.current + ", " + endLongitude.current,
        startDate.current,
        endDate.current,
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

  const setCoordinate = (coordinate: Position) => {
    if (selectedMarkerIndex === 0) {
      startLongitude.current = coordinate[0];
      startLatitude.current = coordinate[1];
    } else {
      endLongitude.current = coordinate[0];
      endLatitude.current = coordinate[1];
    }
  };

  const handleCreateButton = async () => {
    switch (selectedIndex) {
      case 0:
        await submitStage();
        break;
      case 1:
        setVisible(true);
        break;
    }
  };

  const renderStartCoordinateInput = (
    <CoordinateInput
      onLatitudeChange={(latitude) => (startLatitude.current = latitude)}
      onLongitudeChange={(longitude) => (startLongitude.current = longitude)}
      onDateChange={(date) => (startDate.current = date)}
      initialLatitude={startLatitude.current}
      initialLongitude={startLongitude.current}
      initialDate={startDate.current}
    />
  );

  const renderEndCoordinateInput = (
    <CoordinateInput
      onLatitudeChange={(latitude) => (endLatitude.current = latitude)}
      onLongitudeChange={(longitude) => (endLongitude.current = longitude)}
      onDateChange={(date) => (endDate.current = date)}
      initialLatitude={endLatitude.current}
      initialLongitude={endLongitude.current}
      initialDate={endDate.current}
    />
  );

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return (
          <>
            <CardComponent title="Start" form={renderStartCoordinateInput} />
            <CardComponent title="Ende" form={renderEndCoordinateInput} />
          </>
        );
      case 1:
        const initialStartCoordinate: Position = [
          startLongitude.current ?? NaN,
          startLatitude.current ?? NaN,
        ];
        const initialEndCoordinate: Position = [
          endLongitude.current ?? NaN,
          endLatitude.current ?? NaN,
        ];
        return (
          <>
            <TopTapBar
              selectedMarkerIndex={selectedMarkerIndex}
              onSelect={(index) => setSelectedMarkerIndex(index)}
            />
            <MapWithMarkers
              markerIndex={selectedMarkerIndex}
              onCoordinateChange={setCoordinate}
              initialStartCoordinate={initialStartCoordinate}
              initialEndCoordinate={initialEndCoordinate}
            />
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
      <DateModal
        modalVisible={visible}
        onClose={() => setVisible(false)}
        onSave={submitStage}
        onStartDateChange={(date) => (startDate.current = date)}
        onEndDateChange={(date) => (endDate.current = date)}
        initialStartDate={startDate.current}
        initialEndDate={endDate.current}
      />

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
        <Button style={styles.button} onPress={handleCreateButton}>
          <Text category="h1">ERSTELLEN</Text>
        </Button>
      </ButtonGroup>
    </Layout>
  );
}

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
