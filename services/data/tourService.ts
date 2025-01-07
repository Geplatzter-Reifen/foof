import { Q } from "@nozbe/watermelondb";
import { database } from "@/database";
import { Tour } from "@/database/model/model";
import { getAllStagesByTourId } from "@/services/data/stageService";
import { getAllLocationsByStageId } from "@/services/data/locationService";

// CREATE

export const createTour = async (
  title: string,
  startedAt?: number,
): Promise<Tour> => {
  return database.write(async () => {
    return database.get<Tour>("tours").create((tour) => {
      tour.title = title;
      tour.isActive = false;
      if (startedAt) {
        tour.startedAt = startedAt;
      }
    });
  });
};

// READ

export const getAllToursQuery = database.get<Tour>("tours").query();
export const getAllTours = () => getAllToursQuery.fetch();

export const getTourByTourIdQuery = (tourId: string) => {
  return database.get<Tour>("tours").query(Q.where("id", tourId));
};
export const getTourByTourId = (tourId: string) => {
  return database.get<Tour>("tours").find(tourId);
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

// UPDATE

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

export const updateFinishedAtFromTour = async (
  tour: Tour,
  finishedAt: number,
) => {
  await database.write(async () => {
    await tour.update(() => {
      tour.finishedAt = finishedAt;
    });
  });
};

export const removeFinishedAtFromTour = async (tour: Tour) => {
  await database.write(async () => {
    await tour.update(() => {
      tour.finishedAt = undefined;
    });
  });
};

// DELETE

export const deleteTour = (tourId: string) => {
  void database.write(async () => {
    const tour = await getTourByTourId(tourId);
    const stages = await getAllStagesByTourId(tour.id);
    for (const stage of stages) {
      const locations = await getAllLocationsByStageId(stage.id);
      for (const location of locations) {
        await location.destroyPermanently();
      }
      await stage.destroyPermanently();
    }
    await tour.destroyPermanently();
  });
};

export const deleteAllTours = () => {
  void database.write(async () => {
    const tours = await getAllTours();
    for (const tour of tours) {
      const stages = await getAllStagesByTourId(tour.id);
      for (const stage of stages) {
        const locations = await getAllLocationsByStageId(stage.id);
        for (const location of locations) {
          await location.destroyPermanently();
        }
        await stage.destroyPermanently();
      }
      await tour.destroyPermanently();
    }
  });
};
