import * as ExpoLocation from "expo-location";
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
import { calculateDistance, MapPoint } from "@/utils/locationUtils";
import { Stage, Tour, Location } from "@/database/model/model";
import {
  createLocation,
  createLocations,
  getLocationBeforeTimestamp,
} from "@/services/data/locationService";

export const LOCATION_TASK_NAME = "location-task";

/**
 * Ensures that the necessary location permissions are granted.
 *
 * @throws {Error} If location permissions are not granted by the user.
 * @returns {Promise<void>} A promise that resolves if permissions are granted, or rejects with an error if not.
 */
export async function ensurePermissions(): Promise<void> {
  const { status: foregroundStatus } =
    await ExpoLocation.requestForegroundPermissionsAsync();
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
  await ExpoLocation.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: ExpoLocation.Accuracy.Highest,
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
    await ExpoLocation.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    const stage: Stage | null = await getActiveStage();
    if (stage) await finishStage(stage.id);
    console.log("Tracking stopped.");
  } else {
    console.log("Tracking already stopped.");
  }
}

/**
 * Processes a single location update by storing the location and updating stage distance.
 * @param location - The current location data.
 * @throws {Error} If no active stage is set
 */
async function processLocationUpdate(location: LocationObject) {
  const activeStage: Stage | null = await getActiveStage();
  if (!activeStage) {
    throw new Error("No active stage set");
  }
  const currentLocation = locationObjectToMapPoint(location);

  const result = await Promise.all([
    createLocation(
      activeStage.id,
      location.coords.latitude,
      location.coords.longitude,
      location.timestamp,
    ),
    getLocationBeforeTimestamp(activeStage.id, location.timestamp),
  ]);
  const lastLocation = result[1];

  if (lastLocation) {
    const lastLocationMapPoint = locationToMapPoint(lastLocation);
    const updatedDistance =
      activeStage.distance +
      calculateDistance(lastLocationMapPoint, currentLocation);
    await setStageDistance(activeStage.id, updatedDistance);
  }

  await setStageAvgSpeed(activeStage.id, getStageAvgSpeedInKmh(activeStage));
}

/**
 * Processes a batch of location updates by storing the locations and updating stage distance.
 * @param locations - The array of location data.
 * @throws {Error} If no active stage is set
 */
async function processLocationUpdates(locations: LocationObject[]) {
  if (locations.length === 0) {
    return;
  }
  if (locations.length === 1) {
    await processLocationUpdate(locations[0]);
    return;
  }
  const activeStage: Stage | null = await getActiveStage();
  if (!activeStage) {
    throw new Error("No active stage set");
  }
  const sortedLocations = locations.sort((a, b) => a.timestamp - b.timestamp);

  let distance = activeStage.distance;
  const updateDistancePromise = async () => {
    const lastLocation = await getLocationBeforeTimestamp(
      activeStage.id,
      sortedLocations[0].timestamp,
    );
    let lastLocationMapPoint = locationObjectToMapPoint(sortedLocations[0]);
    if (lastLocation) {
      lastLocationMapPoint = locationToMapPoint(lastLocation);
    }
    for (const location of sortedLocations) {
      const locationMapPoint = locationObjectToMapPoint(location);
      distance += calculateDistance(lastLocationMapPoint, locationMapPoint);
      lastLocationMapPoint = locationMapPoint;
    }
  };

  await Promise.all([
    createLocations(activeStage.id, sortedLocations),
    updateDistancePromise(),
  ]);

  await setStageDistance(activeStage.id, distance);

  await setStageAvgSpeed(activeStage.id, getStageAvgSpeedInKmh(activeStage));
}

function locationObjectToMapPoint(location: LocationObject): MapPoint {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}

function locationToMapPoint(location: Location): MapPoint {
  return {
    latitude: location.latitude,
    longitude: location.longitude,
  };
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
      try {
        await processLocationUpdates(data.locations);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error processing locations update:", err.message);
        }
      }
    } else {
      console.warn("No data received in location task.");
    }
  },
);
