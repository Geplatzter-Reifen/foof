import { database } from "./createDatabase";
import { Journey, Trip, Location } from "./model";

const createJourney = async (title: string): Promise<Journey> => {
  return database.write(async () => {
    return database.get<Journey>("journeys").create((journey) => {
      journey.title = title;
    });
  });
};

const createTrip = async (journeyId: string, title: string): Promise<Trip> => {
  return database.write(async () => {
    const journey = await database.get<Journey>("journeys").find(journeyId);
    return database.get<Trip>("trips").create((trip) => {
      trip.journey.set(journey);
      trip.title = title;
    });
  });
};

const createLocation = async (
  tripId: string,
  latitude: number,
  longitude: number,
): Promise<Location> => {
  return database.write(async () => {
    const trip = await database.get<Trip>("trips").find(tripId);
    return database.get<Location>("locations").create((location) => {
      location.trip.set(trip);
      location.latitude = latitude;
      location.longitude = longitude;
      location.recordedAt = Date.now();
    });
  });
};

const getAllJourneysQuery = database.get<Journey>("journeys").query();
const getAllJourneys = () => getAllJourneysQuery.fetch();

const getAllTripsByJourneyId = (journeyId: string) => {
  return database.get<Trip>("trips").find(journeyId);
};
const getAllLocationsByTripId = (tripId: string) => {
  return database.get<Location>("locations").find(tripId);
};

const deleteAllJourneys = () => {
  void database.write(async () => {
    const journeys = await getAllJourneys();
    journeys.forEach((journey) => journey.destroyPermanently());
  });
};

export {
  createJourney,
  createTrip,
  createLocation,
  getAllJourneysQuery,
  getAllJourneys,
  getAllTripsByJourneyId,
  getAllLocationsByTripId,
  deleteAllJourneys,
};
