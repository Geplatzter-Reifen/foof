import { database } from "./createDatabase";
import { Tour, Stage, Location } from "./model";
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
  active: boolean = false,
): Promise<Stage> => {
  // if stage to be active, deactivate all active stages
  if (active) {
    await setActiveStageInactive();
  }

  const tour = await database.get<Tour>("tours").find(tourId);

  // Update Tour Start if necessary
  if (!tour.startedAt) {
    await database.write(async () => {
      await tour.update(() => {
        tour.startedAt = startedAt ?? Date.now();
      });
    });
  } else if (startedAt && startedAt < tour.startedAt) {
    await database.write(async () => {
      await tour.update(() => {
        tour.startedAt = startedAt;
      });
    });
  }

  // Create Stage
  return tour.addStage(title, startedAt, finishedAt, active);
};

export const deleteStage = async (stageId: string) => {
  void database.write(async () => {
    const stageToDelete = await getStageByStageId(stageId);
    await stageToDelete.destroyPermanently();
  });
};

export const startStage = async (tourId: string) => {
  const title: string = `Etappe ${(await getAllStagesByTourId(tourId)).length + 1}`;
  console.log(title);

  return createStage(tourId, title, Date.now(), undefined, true);
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

const setActiveStageInactive = async () => {
  await database.write(async () => {
    const allStages = await database
      .get<Stage>("stages")
      .query(Q.where("is_active", true))
      .fetch();
    for (const stage of allStages) {
      await stage.update(() => {
        stage.isActive = false;
      });
    }
  });
};

const setStageInactive = async (stageId: string) => {
  await database.write(async () => {
    const stage = await database.get<Stage>("stages").find(stageId);
    await stage.update(() => {
      stage.isActive = false;
    });
  });
};

const setStageActive = async (stageId: string) => {
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
