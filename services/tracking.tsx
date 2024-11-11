import { createTrip, getActiveJourney } from "@/model/database_functions";

export async function createManualTrip(
  startingCoordinatesString: string,
  endCoordinatesString: string,
) {
  // TODO Fehlerbehandlung, falls keine Journey vorhanden
  let activeJourney = await getActiveJourney();
  if (activeJourney === null) {
    throw Error("No active journey retrieved");
  }
  let trip = await createTrip(activeJourney.id, "Strecke");
  let startingCoordinates = parseCoordinates(startingCoordinatesString);
  let endCoordinates = parseCoordinates(endCoordinatesString);
  if (startingCoordinates === null || endCoordinates === null) {
    throw Error("Coordinates could not be parsed");
  }
  await trip.addLocation(
    startingCoordinates?.latitude,
    startingCoordinates?.longitude,
  );
  await trip.addLocation(endCoordinates?.latitude, endCoordinates?.longitude);
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
