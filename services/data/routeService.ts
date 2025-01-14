import { database } from "@/database";
import { Q } from "@nozbe/watermelondb";
import { Tour, Route } from "@/database/model/model";

// READ

/**
 * @param tourId The id of the tour
 * @returns The route for the tour, or null if no route exists
 */
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

// UPDATE

/**
 * Sets the route for a tour. Creates a new route if none exists, updates the existing route otherwise.
 * @param tourId The id of the tour
 * @param geoJson The GeoJSON string of the route
 * @returns The created or updated route
 */
export const setTourRoute = async (tourId: string, geoJson: string) => {
  return database.write(async () => {
    // Check if a route for the tour already exists
    const existingRoute = await database
      .get<Route>("routes")
      .query(Q.where("tour_id", tourId))
      .fetch();

    if (existingRoute.length === 0) {
      // Create a new route
      const tour = await database.get<Tour>("tours").find(tourId);
      return database.get<Route>("routes").create((route) => {
        route.tour.set(tour);
        route.geoJson = geoJson;
      });
    } else {
      // Update the existing route
      return existingRoute[0].update((route) => {
        route.geoJson = geoJson;
      });
    }
  });
};

// DELETE

/** Deletes a Tour's Route
 * @param tourId The id of the tour
 */
export const deleteRoute = async (tourId: string) => {
  void database.write(async () => {
    const routes = await database
      .get<Route>("routes")
      .query(Q.where("tour_id", tourId))
      .fetch();
    routes.forEach((r) => r.destroyPermanently());
  });
};
