import { database } from "@/database";
import { Q } from "@nozbe/watermelondb";
import { Tour, Route } from "@/database/model/model";

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
