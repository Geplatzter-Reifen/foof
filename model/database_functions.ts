import { Q } from "@nozbe/watermelondb";
import { database } from "./createDatabase";
import { Journey, Trip, Location } from "./model";

export const createJourney = async (title: string): Promise<Journey> => {
  return database.write(async () => {
    return database.get<Journey>("journeys").create((journey) => {
      journey.title = title;
      journey.isActive = false;
    });
  });
};

export const setJourneyActive = async (journeyId: string) => {
  await database.write(async () => {
    const journey = await database.get<Journey>("journeys").find(journeyId);
    await journey.update(() => {
      journey.isActive = true;
    });
  });
};

export const setJourneyInactive = async (journeyId: string) => {
  await database.write(async () => {
    const journey = await database.get<Journey>("journeys").find(journeyId);
    await journey.update(() => {
      journey.isActive = false;
    });
  });
};

export const getActiveJourney = async (): Promise<Journey | null> => {
  const activeJourneys = await database
    .get<Journey>("journeys")
    .query(Q.where("is_active", true), Q.take(1))
    .fetch();
  if (activeJourneys.length === 0) {
    return null;
  } else {
    return activeJourneys[0];
  }
};

export const createTrip = async (
  journeyId: string,
  title: string,
): Promise<Trip> => {
  return database.write(async () => {
    const journey = await database.get<Journey>("journeys").find(journeyId);
    return database.get<Trip>("trips").create((trip) => {
      trip.journey.set(journey);
      trip.title = title;
    });
  });
};

export const createLocation = async (
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

export const getAllJourneysQuery = database.get<Journey>("journeys").query();
const getAllJourneys = () => getAllJourneysQuery.fetch();

export const getAllTripsByJourneyId = (journeyId: string) => {
  return database.get<Trip>("trips").find(journeyId);
};
export const getAllLocationsByTripId = (tripId: string) => {
  return database.get<Location>("locations").find(tripId);
};

export const deleteAllJourneys = () => {
  void database.write(async () => {
    const journeys = await getAllJourneys();
    journeys.forEach((journey) => journey.destroyPermanently());
  });
};
