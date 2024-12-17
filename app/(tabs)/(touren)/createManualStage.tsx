import React, { useState, useEffect, useMemo } from "react";
import { Alert, StyleSheet } from "react-native";
import { Button, Layout, Text } from "@ui-kitten/components";
import { Input } from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import ButtonGroup from "../../../components/Buttons/ButtonGroup";
import CoordinateInput from "../../../components/Stage/CoordinateInput";
import CardComponent from "../../../components/Stage/CardComponent";
import { createManualStage as createManualStageFn } from "@/services/tracking";
import { ButtonSwitch } from "@/components/Buttons/ButtonSwitch";

/**
 * useCoordinates function
 *
 * This function is a custom hook for managing latitude, longitude, and date states.
 *
 * @param {Object} params - The initial parameters for the hook.
 * @param {string} [params.initialLatitude] - The initial latitude value.
 * @param {string} [params.initialLongitude] - The initial longitude value.
 * @param {Date} [params.initialDate] - The initial date value.
 *
 * @returns {Object} An object containing the latitude, longitude, and date states, along with their setters.
 */
type useCoordinateParams = {
  initialLatitude?: string;
  initialLongitude?: string;
  initialDate?: Date;
};

function useCoordinates({
  initialLatitude = "",
  initialLongitude = "",
  initialDate = new Date(),
}: useCoordinateParams = {}) {
  const [latitude, setLatitude] = useState(initialLatitude);
  const [longitude, setLongitude] = useState(initialLongitude);
  const [date, setDate] = useState(initialDate);

  return { latitude, setLatitude, longitude, setLongitude, date, setDate };
}

/**
 * CreateManualStage Component
 *
 * Renders a form to manually create a stage in a tour. Includes:
 * - Start and end coordinates.
 * - Start and end dates.
 * - Title editing functionality.
 * - Submission and cancellation options.
 *
 * @returns {JSX.Element} The rendered component.
 */
const CreateManualStage: React.FC = () => {
  const { tourId } = useLocalSearchParams<{ tourId: string }>();
  if (!tourId) throw new Error("Missing tourId parameter.");

  const navigation = useNavigation();
  const router = useRouter();

  const [titleBeingChanged, setTitleBeingChanged] = useState(false);
  const [stageTitle, setStageTitle] = useState("Etappe");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const start = useCoordinates();
  const end = useCoordinates();

  const titleInput = useMemo(
    () => (
      <Layout style={styles.headerInput}>
        <Input
          value={stageTitle}
          onChangeText={(nextValue) => setStageTitle(nextValue)}
          maxLength={20}
          accessibilityLabel="Stage Title Input"
          placeholder="Enter stage title"
        />
      </Layout>
    ),
    [stageTitle],
  );

  const changingTitleButton = useMemo(
    () => (
      <Button
        appearance="ghost"
        onPress={() => setTitleBeingChanged((prevState) => !prevState)}
        accessibilityLabel="Toggle title edit mode"
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

  useEffect(() => {
    navigation.setOptions({
      headerTitle: titleBeingChanged ? (
        titleInput
      ) : (
        <Text category="h4">{stageTitle}</Text>
      ),
      headerRight: () => changingTitleButton,
      headerTitleAlign: "center",
    });
  }, [
    navigation,
    titleInput,
    changingTitleButton,
    titleBeingChanged,
    stageTitle,
  ]);

  const renderCoordinateInput = (
    latitude: string,
    longitude: string,
    setLatitude: React.Dispatch<React.SetStateAction<string>>,
    setLongitude: React.Dispatch<React.SetStateAction<string>>,
    date: Date,
    setDate: React.Dispatch<React.SetStateAction<Date>>,
  ) => (
    <CoordinateInput
      latitude={latitude}
      longitude={longitude}
      setLatitude={setLatitude}
      setLongitude={setLongitude}
      date={date}
      setDate={setDate}
    />
  );

  const startCoordInput = renderCoordinateInput(
    start.latitude,
    start.longitude,
    start.setLatitude,
    start.setLongitude,
    start.date,
    start.setDate,
  );

  const endCoordInput = renderCoordinateInput(
    end.latitude,
    end.longitude,
    end.setLatitude,
    end.setLongitude,
    end.date,
    end.setDate,
  );

  const onSubmitStage = async () => {
    if (!stageTitle.trim()) {
      Alert.alert("Error", "Stage title cannot be empty.");
      return;
    }

    if (!start.latitude || !end.latitude) {
      Alert.alert("Error", "Coordinates cannot be empty.");
      return;
    }

    try {
      await createManualStageFn(
        stageTitle,
        `${start.latitude}, ${start.longitude}`,
        `${end.latitude}, ${end.longitude}`,
        start.date,
        end.date,
        tourId,
      );
      router.back();
    } catch (err) {
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "Unknown Error",
      );
    }
  };

  return (
    <Layout style={styles.layout} level="2">
      <ButtonSwitch
        onSelect={(index) => setSelectedIndex(index)}
        selectedIndex={selectedIndex}
      >
        <Button style={styles.button} accessibilityLabel="Compass button">
          <FontAwesomeIcon icon="compass" size={25} />
        </Button>
        <Button style={styles.button} accessibilityLabel="Map Pin button">
          <FontAwesomeIcon icon="map-pin" size={25} />
        </Button>
        <Button style={styles.button} accessibilityLabel="City button">
          <FontAwesomeIcon icon="city" size={25} />
        </Button>
      </ButtonSwitch>

      <Layout style={styles.cardsContainer} level="2">
        <CardComponent title="Start" form={startCoordInput} />
        <CardComponent title="Ende" form={endCoordInput} />
      </Layout>

      <ButtonGroup>
        <Button
          style={styles.button}
          onPress={() => router.back()}
          accessibilityLabel="Cancel button"
        >
          <Text category="h1">ABBRECHEN</Text>
        </Button>
        <Button
          style={styles.button}
          onPress={onSubmitStage}
          accessibilityLabel="Submit button"
        >
          <Text category="h1">ERSTELLEN</Text>
        </Button>
      </ButtonGroup>
    </Layout>
  );
};

export default CreateManualStage;

const styles = StyleSheet.create({
  cardsContainer: {
    flex: 7,
    flexDirection: "column",
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
