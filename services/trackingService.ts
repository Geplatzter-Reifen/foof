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
import { createLocation } from "@/services/data/locationService";
import { calculateDistance, MapPoint } from "@/utils/locationUtils";
import { Stage, Tour } from "@/database/model/model";

export const LOCATION_TASK_NAME = "location-task";

let lastLocation: LocationObject | undefined = undefined;
let lastActiveStageId: string | undefined = undefined;

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
  const currentLocation: MapPoint = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
  await createLocation(
    activeStage.id,
    currentLocation.latitude,
    currentLocation.longitude,
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
      await processLocationUpdate(location);
    } catch (err) {
      // @ts-ignore
      console.error("Error processing location update:", err.message);
    }
  } else {
    console.warn("No data received in location task.");
  }
});
