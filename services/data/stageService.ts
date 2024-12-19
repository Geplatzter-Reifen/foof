import { database } from "@/database";
import { Q } from "@nozbe/watermelondb";
import { Stage, Tour } from "@/database/model/model";
import { getAllLocationsByStageId } from "@/services/data/locationService";

// CREATE

export const createStage = async (
  tourId: string,
  title: string,
  startedAt?: number,
  finishedAt?: number,
  active: boolean = false,
  distance?: number,
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
  return tour.addStage(title, startedAt, finishedAt, distance, active);
};

/** creates a Stage and sets it active */
export const startStage = async (tourId: string) => {
  const title: string = `Etappe ${(await getAllStagesByTourId(tourId)).length + 1}`;

  return createStage(tourId, title, Date.now(), undefined, true);
};

// READ

export const getAllStagesByTourIdQuery = (tourId: string) => {
  return database.get<Stage>("stages").query(Q.where("tour_id", tourId));
};
export const getAllStagesByTourId = (tourId: string) => {
  return getAllStagesByTourIdQuery(tourId).fetch();
};

export const getStageByStageId = (stageId: string) => {
  return database.get<Stage>("stages").find(stageId);
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

// UPDATE

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

// DELETE

export const deleteStage = async (stageId: string) => {
  void database.write(async () => {
    const stage = await getStageByStageId(stageId);
    const locations = await getAllLocationsByStageId(stage.id);
    for (const location of locations) {
      await location.destroyPermanently();
    }
    await stage.destroyPermanently();
    await stage.destroyPermanently();
  });
};
