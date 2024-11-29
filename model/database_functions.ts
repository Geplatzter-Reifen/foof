import { database } from "./createDatabase";
import { Tour, Stage, Location, Route } from "./model";
import { Q } from "@nozbe/watermelondb";

export const createTour = async (title: string): Promise<Tour> => {
  return database.write(async () => {
    return database.get<Tour>("tours").create((tour) => {
      tour.title = title;
      tour.isActive = false;
    });
  });
};

export const setTourActive = async (tourId: string) => {
  await database.write(async () => {
    const allTours = await database.get<Tour>("tours").query().fetch();
    for (const tour of allTours) {
      if (tour.isActive) {
        await tour.update(() => {
          tour.isActive = false;
        });
      }
    }
    const tour = await database.get<Tour>("tours").find(tourId);
    await tour.update(() => {
      tour.isActive = true;
    });
  });
};

export const setTourInactive = async (tourId: string) => {
  await database.write(async () => {
    const tour = await database.get<Tour>("tours").find(tourId);
    await tour.update(() => {
      tour.isActive = false;
    });
  });
};

/** Sets the route for a tour. Creates a new route if none exists, updates the existing route otherwise. */
export const setTourRoute = async (tourId: string, geoJson: string) => {
  return database.write(async () => {
    const existingRoute = await database
      .get<Route>("routes")
      .query(Q.where("tour_id", tourId))
      .fetch();

    if (existingRoute.length === 0) {
      const tour = await database.get<Tour>("tours").find(tourId);
      return database.get<Route>("routes").create((route) => {
        route.tour.set(tour);
        route.geoJson = geoJson;
      });
    } else {
      return existingRoute[0].update((route) => {
        route.geoJson = geoJson;
      });
    }
  });
};

/** Returns the route for a tour, or null if no route exists. */
export const getTourRoute = async (tourId: string) => {
  const route = await database
    .get<Route>("routes")
    .query(Q.where("tour_id", tourId))
    .fetch();
  if (route.length === 0) {
    return null;
  }
  return route[0];
};

export const getActiveTour = async (): Promise<Tour | null> => {
  const activeTours = await database
    .get<Tour>("tours")
    .query(Q.where("is_active", true), Q.take(1))
    .fetch();
  if (activeTours.length === 0) {
    return null;
  } else {
    return activeTours[0];
  }
};

export const createStage = async (
  tourId: string,
  title: string,
  startedAt?: number,
  finishedAt?: number,
): Promise<Stage> => {
  return database.write(async () => {
    const tour = await database.get<Tour>("tours").find(tourId);

    // Determine the start date for the tour
    let updatedStartedAt: number;
    // If the tour has no start date, set it to the provided start date or the current datetime
    if (!tour.startedAt) {
      updatedStartedAt = startedAt ?? Date.now();
    }
    // If a start date is provided, and it is earlier than the current start date, update it
    else if (startedAt && startedAt < tour.startedAt) {
      updatedStartedAt = startedAt;
    }
    // Otherwise, keep the existing start date
    else {
      updatedStartedAt = tour.startedAt;
    }
    // Update the tour's start date
    await tour.update(() => {
      tour.startedAt = updatedStartedAt;
    });

    return database.get<Stage>("stages").create((stage) => {
      stage.tour.set(tour);
      stage.title = title;
      stage.isActive = false;
      stage.startedAt = Date.now();
      stage.finishedAt = finishedAt;
    });
  });
};

export const deleteStage = async (stageId: string) => {
  void database.write(async () => {
    const stageToDelete = await getStageByStageId(stageId);
    await stageToDelete.destroyPermanently();
  });
};

export const setStageDistance = async (stageId: string, distance: number) => {
  void database.write(async () => {
    const stage = await getStageByStageId(stageId);
    await stage.update(() => {
      stage.distance = distance;
    });
  });
};

export const setStageAvgSpeed = async (stageId: string, speed: number) => {
  void database.write(async () => {
    const stage = await getStageByStageId(stageId);
    await stage.update(() => {
      stage.avgSpeed = speed;
    });
  });
};

export const finishStage = async (stageId: string, finishTime?: number) => {
  void database.write(async () => {
    const stageToFinish = await getStageByStageId(stageId);
    await stageToFinish.update(() => {
      stageToFinish.finishedAt = finishTime ?? Date.now();
      stageToFinish.isActive = false;
    });
  });
};

export const setStageActive = async (stageId: string) => {
  await database.write(async () => {
    const allStages = await database.get<Stage>("stages").query().fetch();
    for (const stage of allStages) {
      if (stage.isActive) {
        await stage.update(() => {
          stage.isActive = false;
        });
      }
    }
    const stage = await database.get<Stage>("stages").find(stageId);
    await stage.update(() => {
      stage.isActive = true;
    });
  });
};

export const getActiveStage = async (): Promise<Stage | null> => {
  const activeStages = await database
    .get<Stage>("stages")
    .query(Q.where("is_active", true), Q.take(1))
    .fetch();
  if (activeStages.length === 0) {
    return null;
  } else {
    return activeStages[0];
  }
};

export const createLocation = async (
  stageId: string,
  latitude: number,
  longitude: number,
): Promise<Location> => {
  return database.write(async () => {
    const stage = await database.get<Stage>("stages").find(stageId);
    return database.get<Location>("locations").create((location) => {
      location.stage.set(stage);
      location.latitude = latitude;
      location.longitude = longitude;
      location.recordedAt = Date.now();
    });
  });
};

export const initializeDatabase = async () => {
  let existingTour = await getAllTours();
  if (existingTour.length === 0) {
    let initial_tour = await createTour("Meine Tour");
    await setTourActive(initial_tour.id);
  }
};

export const getAllToursQuery = database.get<Tour>("tours").query();
export const getAllTours = () => getAllToursQuery.fetch();

export const getTourByTourIdQuery = (tourId: string) => {
  return database.get<Tour>("tours").query(Q.where("id", tourId));
};

export const getTourByTourId = (tourId: string) => {
  return database.get<Tour>("tours").find(tourId);
};

export const updateTourNameById = async (
  tourId: string,
  newTourName: string,
) => {
  await database.write(async () => {
    const tour = await getTourByTourId(tourId);
    await tour.update(() => {
      tour.title = newTourName;
    });
  });
};

export const getAllStagesByTourIdQuery = (tourId: string) => {
  return database.get<Stage>("stages").query(Q.where("tour_id", tourId));
};
export const getAllStagesByTourId = (tourId: string) => {
  return getAllStagesByTourIdQuery(tourId).fetch();
};

export const getStageByStageId = (stageId: string) => {
  return database.get<Stage>("stages").find(stageId);
};

export const getAllLocationsByStageIdQuery = (stageId: string) => {
  return database
    .get<Location>("locations")
    .query(Q.where("stage_id", stageId));
};
export const getAllLocationsByStageId = (stageId: string) => {
  return getAllLocationsByStageIdQuery(stageId).fetch();
};

export const deleteAllTours = () => {
  void database.write(async () => {
    const tours = await getAllTours();
    tours.forEach((tour) => tour.destroyPermanently());
  });
};
