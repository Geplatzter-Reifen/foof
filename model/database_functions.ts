import { database } from "./createDatabase";
import { Journey, Trip, Location } from "./model";
import { Q } from "@nozbe/watermelondb";

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
    const allJourneys = await database.get<Journey>("journeys").query().fetch();
    for (const journey of allJourneys) {
      if (journey.isActive) {
        await journey.update(() => {
          journey.isActive = false;
        });
      }
    }
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
  startedAt?: number,
): Promise<Trip> => {
  return database.write(async () => {
    const journey = await database.get<Journey>("journeys").find(journeyId);
    const trips = await getAllTripsByJourneyId(journeyId);

    // If this is the first trip, set the journey start date to today
    if (trips.length === 0) {
      const journey = await database.get<Journey>("journeys").find(journeyId);
      await journey.update(() => {
        // If a start datetime is provided, use that. Else, use the current datetime.
        journey.startedAt = startedAt ? startedAt : Date.now();
      });
    }

    return database.get<Trip>("trips").create((trip) => {
      trip.journey.set(journey);
      trip.title = title;
      trip.isActive = false;
      trip.startedAt = Date.now();
    });
  });
};

export const deleteTrip = async (tripId: string) => {
  void database.write(async () => {
    const tripToDelete = await getTripByTripId(tripId);
    await tripToDelete.destroyPermanently();
  });
};

export const setTripDistance = async (tripId: string, distance: number) => {
  void database.write(async () => {
    const tripToFinish = await getTripByTripId(tripId);
    await tripToFinish.update(() => {
      tripToFinish.distance = distance;
    });
  });
};

export const finishTrip = async (tripId: string, finishTime: number) => {
  void database.write(async () => {
    const tripToFinish = await getTripByTripId(tripId);
    await tripToFinish.update(() => {
      tripToFinish.finishedAt = finishTime;
    });
  });
};

export const setTripInactive = async (tripId: string) => {
  await database.write(async () => {
    const trip = await database.get<Trip>("trips").find(tripId);
    await trip.update(() => {
      trip.isActive = false;
    });
  });
};

export const setTripActive = async (tripId: string) => {
  await database.write(async () => {
    const trip = await database.get<Trip>("trips").find(tripId);
    await trip.update(() => {
      trip.isActive = true;
    });
  });
};

export const getActiveTrip = async (): Promise<Trip | null> => {
  const activeTrips = await database
    .get<Trip>("trips")
    .query(Q.where("is_active", true), Q.take(1))
    .fetch();
  if (activeTrips.length === 0) {
    return null;
  } else {
    return activeTrips[0];
  }
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
export const getAllJourneys = () => getAllJourneysQuery.fetch();

export const getJourneyByJourneyIdQuery = (journeyId: string) => {
  return database.get<Journey>("journeys").query(Q.where("id", journeyId));
};
export const getJourneyByJourneyId = (journeyId: string) => {
  return database.get<Journey>("journeys").find(journeyId);
};

export const getAllTripsByJourneyIdQuery = (journeyId: string) => {
  return database.get<Trip>("trips").query(Q.where("journey_id", journeyId));
};
export const getAllTripsByJourneyId = (journeyId: string) => {
  return getAllTripsByJourneyIdQuery(journeyId).fetch();
};

export const getTripByTripId = (tripId: string) => {
  return database.get<Trip>("trips").find(tripId);
};

export const getAllLocationsByTripIdQuery = (tripId: string) => {
  return database.get<Location>("locations").query(Q.where("trip_id", tripId));
};
export const getAllLocationsByTripId = (tripId: string) => {
  return getAllLocationsByTripIdQuery(tripId).fetch();
};

export const deleteAllJourneys = () => {
  void database.write(async () => {
    const journeys = await getAllJourneys();
    journeys.forEach((journey) => journey.destroyPermanently());
  });
};
