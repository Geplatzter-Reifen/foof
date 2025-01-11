import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Input,
  Layout,
  Tab,
  TabBar,
  Text,
} from "@ui-kitten/components";
import ButtonGroup from "../../../components/Buttons/ButtonGroup";
import CoordinateInput from "../../../components/Stage/CoordinateInput";
import { Alert, StyleSheet } from "react-native";
import CardComponent from "../../../components/Stage/CardComponent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ButtonSwitch } from "@/components/Buttons/ButtonSwitch";
import { tourIsFinished } from "@/services/StageConnection/stageConnection";
import { getActiveTour } from "@/services/data/tourService";
import type { Position } from "geojson";
import MapWithMarkers from "@/components/Map/MapWithMarkers";
import DateTimeModal from "@/components/Modal/DateTimeModal";
import { MapState } from "@rnmapbox/maps";
import { roundNumber } from "@/utils/utils";
import React from "react";
import { createManualStage as createManualStageFn } from "@/services/manualStageInputService";
import { Tour } from "@/database/model/model";
import { validateUndefinedCoordinates } from "@/utils/locationUtils";

type TopTapBarProps = {
  selectedIndex: number;
  onSelect: (index: number) => void;
};

/**
 * Component for the top tab bar.
 * @param selectedIndex - The index of the currently selected marker.
 * @param onSelect - Function called when a tab is selected.
 */
const TopTapBar = ({ selectedIndex, onSelect }: TopTapBarProps) => {
  return (
    <TabBar
      style={{ height: 50 }}
      selectedIndex={selectedIndex}
      onSelect={onSelect}
    >
      <Tab title="Start" />
      <Tab title="Ende" />
    </TabBar>
  );
};

export default function CreateManualStage() {
  const { tourId } = useLocalSearchParams<{ tourId: string }>();
  const [tour, setTour] = useState<Tour>();
  // changing the title of the page
  const navigation = useNavigation();
  //switches title from plain text to the input field
  const [titleBeingChanged, setTitleBeingChanged] = useState(false);
  const [stageTitle, setStageTitle] = useState("Etappe"); ///the name of the title
  // Switching between coordinate input and map input
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Switching between start and end coordinate input for map input
  const [selectedTopTapBarIndex, setSelectedTopTapBarIndex] = useState(0);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const router = useRouter();
  // Variables for user input
  const startLatitude = useRef<number>();
  const startLongitude = useRef<number>();
  const endLatitude = useRef<number>();
  const endLongitude = useRef<number>();
  const startDate = useRef(new Date());
  const endDate = useRef(new Date());

  // Camera properties for the map
  const centerCoordinate = useRef<Position>();
  const zoomLevel = useRef<number>();
  const heading = useRef<number>();
  const pitch = useRef<number>();

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

  useEffect(() => {
    const fetchTour = async () => {
      const tour = await getActiveTour();
      if (!tour) {
        Alert.alert("Fehler", "Keine aktive Tour gefunden.");
        router.back();
      } else {
        setTour(tour);
      }
    };
    fetchTour();
  }, [router, tourId]);

  /**
   * Submits the stage to the database.
   * Creates a new stage with the given data.
   * If the creation is successful, it navigates back to the previous screen.
   * If an error occurs, it displays an alert with the error message.
   */
  const submitStage = async () => {
    if (startDate.current >= endDate.current) {
      Alert.alert(
        "Ungültige Eingabe",
        "Der Startzeitpunkt muss vor dem Endzeitpunkt liegen.",
      );
    } else {
      try {
        const result = validateUndefinedCoordinates(
          startLatitude.current,
          startLongitude.current,
          endLatitude.current,
          endLongitude.current,
        );
        await createManualStageFn(
          stageTitle,
          {
            latitude: result.startLatitude,
            longitude: result.startLongitude,
          },
          { latitude: result.endLatitude, longitude: result.endLongitude },
          startDate.current,
          endDate.current,
          tourId,
        );
        router.back();
      } catch (err) {
        if (err instanceof Error) {
          Alert.alert("Ungültige Eingabe", err.message);
        } else {
          Alert.alert("Unknown Error", "An unexpected error occurred.");
        }
      }
      if (tour && (await tourIsFinished(tour))) {
        Alert.alert("Tour beendet", "Herzlichen Glückwunsch!");
      }
    }
  };

  /**
   * Sets the coordinates based on the selected tab.
   * If the start tab is selected, it sets the start coordinates.
   * If the end tab is selected, it sets the end coordinates.
   * @param coordinate - The coordinates to set.
   */
  const setCoordinate = (coordinate: Position) => {
    if (selectedTopTapBarIndex === 0) {
      startLongitude.current = coordinate[0];
      startLatitude.current = coordinate[1];
    } else {
      endLongitude.current = coordinate[0];
      endLatitude.current = coordinate[1];
    }
  };

  /**
   * Handles the create button press event.
   * Depending on the selected index, it either submits the stage data
   * or displays the DateTimeModal for date and time selection.
   */
  const handleCreateButton = async () => {
    switch (selectedIndex) {
      case 0:
        await submitStage();
        break;
      case 1:
        setTimeModalVisible(true);
        break;
    }
  };

  /**
   * Renders the coordinate input component for the start coordinates.
   * It includes inputs for latitude, longitude, and date/time.
   * The initial values are set based on the current state.
   */
  const renderStartCoordinateInput = (
    <CoordinateInput
      onLatitudeChange={(latitude) => (startLatitude.current = latitude)}
      onLongitudeChange={(longitude) => (startLongitude.current = longitude)}
      onDateTimeChange={(date) => (startDate.current = date)}
      initialLatitude={roundNumber(6, startLatitude.current)}
      initialLongitude={roundNumber(6, startLongitude.current)}
      initialDate={startDate.current}
    />
  );

  /**
   * Renders the coordinate input component for the end coordinates.
   * It includes inputs for latitude, longitude, and date/time.
   * The initial values are set based on the current state.
   */
  const renderEndCoordinateInput = (
    <CoordinateInput
      onLatitudeChange={(latitude) => (endLatitude.current = latitude)}
      onLongitudeChange={(longitude) => (endLongitude.current = longitude)}
      onDateTimeChange={(date) => (endDate.current = date)}
      initialLatitude={roundNumber(6, endLatitude.current)}
      initialLongitude={roundNumber(6, endLongitude.current)}
      initialDate={endDate.current}
    />
  );

  /**
   * Handles the event when the map goes idle.
   * Updates the camera properties based on the current map state.
   * @param state - The current state of the map.
   */
  const handleMapIdle = (state: MapState) => {
    const properties = state.properties;
    centerCoordinate.current = properties.center;
    zoomLevel.current = properties.zoom;
    heading.current = properties.heading;
    pitch.current = properties.pitch;
  };

  /** Render the content based on the selected index */
  const renderContent = () => {
    switch (selectedIndex) {
      // Coordinate input
      case 0:
        return (
          <>
            <CardComponent title="Start" form={renderStartCoordinateInput} />
            <CardComponent title="Ende" form={renderEndCoordinateInput} />
          </>
        );
      // Map input
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
              selectedIndex={selectedTopTapBarIndex}
              onSelect={setSelectedTopTapBarIndex}
            />
            {tour && (
              <MapWithMarkers
                markerIndex={selectedTopTapBarIndex}
                onCoordinateChange={setCoordinate}
                initialStartCoordinate={initialStartCoordinate}
                initialEndCoordinate={initialEndCoordinate}
                centerCoordinate={centerCoordinate.current}
                zoomLevel={zoomLevel.current}
                heading={heading.current}
                pitch={pitch.current}
                onMapIdle={handleMapIdle}
                tour={tour}
              />
            )}
            <DateTimeModal
              modalVisible={timeModalVisible}
              onClose={() => setTimeModalVisible(false)}
              onSave={submitStage}
              onStartDateChange={(date) => (startDate.current = date)}
              onEndDateChange={(date) => (endDate.current = date)}
              initialStartDate={startDate.current}
              initialEndDate={endDate.current}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={styles.layout} level="2">
      <ButtonSwitch
        onSelect={(index) => {
          setSelectedIndex(index);
        }}
        selectedIndex={selectedIndex}
      >
        <Button style={styles.button}>
          <FontAwesomeIcon icon="compass" size={25} />
        </Button>
        <Button style={styles.button}>
          <FontAwesomeIcon icon="map-pin" size={25} />
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
          status="basic"
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
