import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import {
  createLocation,
  createTrip,
  getActiveJourney,
  getActiveTrip,
  getJourneyByJourneyId,
  setTripActive,
  setTripDistance,
  setTripInactive,
} from "@/model/database_functions";
import { calculateDistance } from "@/utils/locationUtil";

const LOCATION_TASK_NAME = "background-location-task";

export async function createManualTrip(
  tripName: string,
  startingCoordinatesString: string,
  endCoordinatesString: string,
  journeyId?: string,
) {
  if (!tripName || tripName.trim() === "") {
    throw new Error("Bitte gib einen Streckennamen an");
  }

  const journey = journeyId
    ? await getJourneyByJourneyId(journeyId)
    : await getActiveJourney();

  if (journey === null) {
    throw new Error("Keine Aktive Reise gesetzt");
  }

  let startingCoordinates = parseCoordinates(startingCoordinatesString);
  let endCoordinates = parseCoordinates(endCoordinatesString);

  if (startingCoordinates === null || endCoordinates === null) {
    throw new Error("Ungültiges Koordinatenformat");
  }

  let trip = await createTrip(journey.id, tripName);

  await trip.addLocation(
    startingCoordinates?.latitude,
    startingCoordinates?.longitude,
  );
  await trip.addLocation(endCoordinates?.latitude, endCoordinates?.longitude);
  await setTripDistance(
    trip.id,
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
        let activeJourney = await getActiveJourney();
        if (!activeJourney) {
          throw new Error("No active journey set");
        }
        let trip = await createTrip(activeJourney.id, "Strecke");
        await setTripActive(trip.id);

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
    let trip = await getActiveTrip();
    await setTripInactive(trip!.id);
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
    // @ts-ignore
    const { locations } = data;
    console.log("New background location: ", locations[0]);
    console.log("New background location: ", data);
    let activeTrip = await getActiveTrip();
    if (!activeTrip) {
      throw new Error("No active trip set");
    }
    await createLocation(
      activeTrip.id,
      locations[0].coords.latitude,
      locations[0].coords.longitude,
    );
  }
});
