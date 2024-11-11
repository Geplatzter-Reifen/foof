import {
  createTrip,
  getActiveJourney,
  getJourneyByJourneyId,
} from "@/model/database_functions";

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
