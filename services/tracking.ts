import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import {
  createLocation,
  createStage,
  getActiveTour,
  getActiveStage,
  getTourByTourId,
  setStageActive,
  setStageDistance,
  setStageInactive,
} from "@/model/database_functions";
import { calculateDistance } from "@/utils/locationUtil";

const LOCATION_TASK_NAME = "background-location-task";

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
  // TODO: avgSpeed setzen
  //await setStageAvgSpeed(...)
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
    await setStageInactive(stage!.id);
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
  if (error) {
    console.log(error.message);
    return;
  }
  if (data) {
    //@ts-ignore
    const { locations } = data;
    console.log("New background location: ", locations[0]);
    console.log("New background location: ", data);
    let activeStage = await getActiveStage();
    if (!activeStage) {
      throw new Error("No active stage set");
    }
    await createLocation(
      activeStage.id,
      locations[0].coords.latitude,
      locations[0].coords.longitude,
    );
  }
});
