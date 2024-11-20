import { Q } from "@nozbe/watermelondb";
import { database } from "@/model/createDatabase";
import { Tour } from "@/model/model";

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

export const deleteAllTours = () => {
  void database.write(async () => {
    const tours = await getAllTours();
    tours.forEach((tour) => tour.destroyPermanently());
  });
};
