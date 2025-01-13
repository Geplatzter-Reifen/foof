import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import * as TaskManager from "expo-task-manager";
import { getActiveTour } from "@/services/data/tourService";
import { getStageAvgSpeedInKmh } from "./statisticsService";
import {
  finishStage,
  getActiveStage,
  setStageAvgSpeed,
  setStageDistance,
  startStage,
} from "@/services/data/stageService";
import { createLocationWithRecordedAt } from "@/services/data/locationService";
import { calculateDistance, MapPoint } from "@/utils/locationUtils";
import { Stage, Tour } from "@/database/model/model";

export const LOCATION_TASK_NAME = "location-task";

let lastLocation: LocationObject | undefined = undefined;
let lastActiveStageId: string | undefined = undefined;

/**
 * Ensures that the necessary location permissions are granted.
 *
 * @throws {Error} If location permissions are not granted by the user.
 * @returns {Promise<void>} A promise that resolves if permissions are granted, or rejects with an error if not.
 */
export async function ensurePermissions(): Promise<void> {
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== "granted") {
    throw new Error("Location permissions not granted");
  }
}

/**
 * Starts location updates for the given tour.
 *
 * @param {Tour} activeTour - The active tour for which location updates are started.
 * @returns {Promise<void>} A promise that resolves when location updates are successfully started.
 */
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

/**
 * Starts automatic location tracking for the active tour.
 *
 * @throws {Error} If location permissions are not granted or no active tour is set.
 * @returns {Promise<void>} A promise that resolves when tracking starts successfully
 * or logs a message if tracking is already active.
 */
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

/**
 * Stops automatic location tracking if it is currently active.
 *
 * @returns {Promise<void>} A promise that resolves when tracking is successfully stopped
 * or logs a message if tracking is already inactive.
 */
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

/**
 * Processes a single location update by storing the location and updating stage distance.
 *
 * @param {LocationObject} location - The current location data.
 * @throws {Error} If no active stage is set.
 * @returns {Promise<void>} Resolves after processing the location update.
 */
async function processLocationUpdate(location: LocationObject): Promise<void> {
  const activeStage: Stage | null = await getActiveStage();
  if (!activeStage) {
    throw new Error("No active stage set");
  }
  const currentLocation: MapPoint = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
  await createLocationWithRecordedAt(
    activeStage.id,
    currentLocation.latitude,
    currentLocation.longitude,
    location.timestamp,
  );

  if (lastLocation && lastActiveStageId === activeStage.id) {
    const latestLocation: MapPoint = {
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

type TaskData = {
  locations?: LocationObject[];
};

TaskManager.defineTask<TaskData>(
  LOCATION_TASK_NAME,
  async ({ data, error }) => {
    if (error) {
      console.error("Error in location task:", error.message);
      throw error;
    }

    if (data.locations) {
      for (const location of data.locations) {
        try {
          await processLocationUpdate(location);
        } catch (err) {
          if (err instanceof Error) {
            console.error("Error processing location update:", err.message);
          }
        }
      }
    } else {
      console.warn("No data received in location task.");
    }
  },
);
