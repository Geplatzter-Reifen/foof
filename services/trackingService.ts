import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { getTourByTourId, getActiveTour } from "@/services/data/tourService";
import { getStageAvgSpeedInKmh } from "./statisticsService";
import {
  getActiveStage,
  createStage,
  startStage,
  setStageDistance,
  setStageAvgSpeed,
  finishStage,
} from "@/services/data/stageService";
import { createLocation } from "@/services/data/locationService";
import { calculateDistance, Coordinates } from "@/utils/locationUtils";
import { LocationObject } from "expo-location";

import { Stage, Tour } from "@/database/model/model";
import { parseCoordinates } from "@/utils/locationUtils";

export const LOCATION_TASK_NAME = "location-task";

let lastLocation: LocationObject | undefined = undefined;
let lastActiveStageId: string | undefined = undefined;

// Validate input for manual stage creation
export function validateManualStageInput(
  stageName: string,
  startTime: Date,
  endTime: Date,
  startingCoordinates: Coordinates | null,
  endCoordinates: Coordinates | null,
): void {
  if (!stageName || stageName.trim() === "") {
    throw new Error("Bitte gib einen Tournamen an");
  }
  if (startingCoordinates === null || endCoordinates === null) {
    throw new Error("Ungültiges Koordinatenformat");
  }
  if (endTime < startTime) {
    throw new Error("Start und Endzeit sind ungültig");
  }
}

// Create a new stage and save locations
async function initializeManualStage(
  tourId: string,
  stageName: string,
  startTime: Date,
  endTime: Date,
  startingCoordinates: Coordinates,
  endCoordinates: Coordinates,
): Promise<Stage> {
  const stage: Stage = await createStage(
    tourId,
    stageName,
    startTime.getTime(),
    endTime.getTime(),
    false,
    calculateDistance(startingCoordinates, endCoordinates),
  );
  await stage.addLocation(
    startingCoordinates.latitude,
    startingCoordinates.longitude,
  );
  await stage.addLocation(endCoordinates?.latitude, endCoordinates?.longitude);

  let speed = getStageAvgSpeedInKmh(stage);

  await setStageAvgSpeed(stage.id, speed);

  return stage;
}

export async function createManualStage(
  stageName: string,
  startingCoordinatesString: string,
  endCoordinatesString: string,
  startTime: Date,
  endTime: Date,
  tourId?: string,
): Promise<Stage> {
  const tour: Tour | null = tourId
    ? await getTourByTourId(tourId)
    : await getActiveTour();
  if (!tour) {
    throw new Error("Keine Aktive Tour gesetzt");
  }

  const startingCoordinates = parseCoordinates(startingCoordinatesString);
  const endCoordinates = parseCoordinates(endCoordinatesString);
  validateManualStageInput(
    stageName,
    startTime,
    endTime,
    startingCoordinates,
    endCoordinates,
  );

  return initializeManualStage(
    tour.id,
    stageName,
    startTime,
    endTime,
    startingCoordinates!,
    endCoordinates!,
  );
}

// Check and request necessary permissions
export async function ensurePermissions(): Promise<void> {
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== "granted") {
    throw new Error("Location permissions not granted");
  }
}

// Start location updates
async function startLocationUpdates(activeTour: Tour): Promise<void> {
  await startStage(activeTour.id);
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Highest,
    foregroundService: {
      notificationTitle: "Tracking aktiv",
      notificationBody: "Viel Spaß beim Radeln!",
    },
  });
  console.log("Tracking started.");
}

export async function startAutomaticTracking(): Promise<void> {
  await ensurePermissions();
  if (await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)) {
    console.log("Tracking already started.");
    return;
  }
  const activeTour: Tour | null = await getActiveTour();
  if (!activeTour) {
    throw new Error("No active tour set");
  }
  await startLocationUpdates(activeTour);
}

export async function stopAutomaticTracking(): Promise<void> {
  if (await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    const stage: Stage | null = await getActiveStage();
    if (stage) await finishStage(stage.id);
    lastActiveStageId = undefined;
    console.log("Tracking stopped.");
  } else {
    console.log("Tracking already stopped.");
  }
}

// Process a single location update
async function processLocationUpdate(location: LocationObject): Promise<void> {
  const activeStage: Stage | null = await getActiveStage();
  if (!activeStage) {
    throw new Error("No active stage set");
  }
  const currentLocation: Coordinates = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
  await createLocation(
    activeStage.id,
    currentLocation.latitude,
    currentLocation.longitude,
  );

  if (lastLocation && lastActiveStageId === activeStage.id) {
    const latestLocation: Coordinates = {
      latitude: lastLocation.coords.latitude,
      longitude: lastLocation.coords.longitude,
    };
    const updatedDistance =
      activeStage.distance + calculateDistance(latestLocation, currentLocation);
    await setStageDistance(activeStage.id, updatedDistance);
  }

  await setStageAvgSpeed(activeStage.id, getStageAvgSpeedInKmh(activeStage));
  lastActiveStageId = activeStage.id;
  lastLocation = location;
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Error in location task:", error.message);
    throw error;
  }

  // @ts-ignore
  if (data && data.locations) {
    // @ts-ignore
    const [location]: LocationObject[] = data.locations;
    try {
      console.log("New location received:", location);
      await processLocationUpdate(location);
    } catch (err) {
      // @ts-ignore
      console.error("Error processing location update:", err.message);
    }
  } else {
    console.warn("No data received in location task.");
  }
});
