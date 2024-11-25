import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import {
  createLocation,
  createStage,
  getActiveStage,
  setStageActive,
  setStageDistance,
  getAllLocationsByStageId,
  getTourByTourId,
  getActiveTour,
  finishStage,
} from "@/model/database_functions";
import { calculateDistance } from "@/utils/locationUtil";
import { LocationObject } from "expo-location";

const LOCATION_TASK_NAME = "background-location-task";

let lastLocation: LocationObject | undefined = undefined;
let lastActiveStageId: string | undefined = undefined;

export async function createManualStage(
  stageName: string,
  startingCoordinatesString: string,
  endCoordinatesString: string,
  tourId?: string,
) {
  if (!stageName || stageName.trim() === "") {
    throw new Error("Bitte gib einen Tournamen an");
  }

  const tour = tourId ? await getTourByTourId(tourId) : await getActiveTour();

  if (tour === null) {
    throw new Error("Keine Aktive Tour gesetzt");
  }

  let startingCoordinates = parseCoordinates(startingCoordinatesString);
  let endCoordinates = parseCoordinates(endCoordinatesString);

  if (startingCoordinates === null || endCoordinates === null) {
    throw new Error("Ungültiges Koordinatenformat");
  }

  let stage = await createStage(tour.id, stageName);

  await stage.addLocation(
    startingCoordinates?.latitude,
    startingCoordinates?.longitude,
  );
  await stage.addLocation(endCoordinates?.latitude, endCoordinates?.longitude);
  await setStageDistance(
    stage.id,
    calculateDistance(startingCoordinates, endCoordinates),
  );
}

export async function startAutomaticTracking() {
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === "granted") {
    console.log("Foreground status: ", foregroundStatus);
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === "granted") {
      console.log("Background status: ", backgroundStatus);
      if (await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)) {
        console.log("Tracking already started.");
      } else {
        let activeTour = await getActiveTour();
        if (!activeTour) {
          throw new Error("No active tour set");
        }
        let stage = await createStage(activeTour.id, "Etappe");
        await setStageActive(stage.id);

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Highest,
        });
        console.log("Tracking started.");
      }
    }
  }
}

export async function stopAutomaticTracking() {
  if (await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    let stage = await getActiveStage();
    await finishStage(stage!.id);
    console.log("Tracking stopped.");
  } else {
    console.log("Tracking already stopped.");
  }
}

function parseCoordinates(
  coordinateString: string,
): { latitude: number; longitude: number } | null {
  const regex = /^\s*([-+]?\d{1,2}(?:\.\d+)?),\s*([-+]?\d{1,3}(?:\.\d+)?)\s*$/;
  const match = coordinateString.match(regex);

  if (!match) {
    return null;
  }

  const latitude = parseFloat(match[1]);
  const longitude = parseFloat(match[2]);

  return { latitude, longitude };
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  // Handle errors first
  if (error) {
    console.error("Error in location task:", error.message);
    throw error;
  }

  // Proceed if there is data
  if (!data) {
    console.warn("No data received in location task.");
    throw new Error("No data received in location task.");
  }

  // Extract locations from the data (ignoring TypeScript warning)
  //@ts-ignore
  const { locations } = data;
  console.log("New background location received:", locations[0]);

  // Fetch the active stage
  const activeStage = await getActiveStage();
  if (!activeStage) {
    throw new Error("No active stage set");
  }

  const currentLocation = {
    latitude: locations[0].coords.latitude,
    longitude: locations[0].coords.longitude,
  };

  // Add the new location to the database
  await createLocation(
    activeStage.id,
    currentLocation.latitude,
    currentLocation.longitude,
  );

  if (lastLocation && lastActiveStageId === activeStage.id) {
    const latestLocation = {
      latitude: lastLocation.coords.latitude,
      longitude: lastLocation.coords.longitude,
    };

    // Calculate the updated distance for the active stage
    const updatedDistance =
      activeStage.distance + calculateDistance(latestLocation, currentLocation);

    console.log("Updated distance for active stage:", updatedDistance);

    // Update the stage distance in the database
    await setStageDistance(activeStage.id, updatedDistance);
  }
  lastActiveStageId = activeStage.id;
  lastLocation = locations[0];
});
