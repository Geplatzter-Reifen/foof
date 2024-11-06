import { database } from "./createDatabase";
import { Journey, Trip, Location } from "./model";
import { Q } from "@nozbe/watermelondb";

const createJourney = async (title: string): Promise<Journey> => {
  return database.write(async () => {
    return database.get<Journey>("journeys").create((journey) => {
      journey.title = title;
      journey.startedAt = Date.now();
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

const getJourneyByJourneyIdQuery = (journeyId: string) => {
  return database.get<Journey>("journeys").query(Q.where("id", journeyId));
};

const getJourneyByJourneyId = (journeyId: string) => {
  return database.get<Journey>("journeys").find(journeyId);
};

const getAllTripsByJourneyId = (journeyId: string) => {
  return database
    .get<Trip>("trips")
    .query(Q.where("journey_id", journeyId))
    .fetch();
};
const getAllLocationsByTripId = (tripId: string) => {
  return database
    .get<Location>("locations")
    .query(Q.where("trip_id", tripId))
    .fetch();
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
  getJourneyByJourneyId,
  getJourneyByJourneyIdQuery,
  getAllTripsByJourneyId,
  getAllLocationsByTripId,
  deleteAllJourneys,
};
