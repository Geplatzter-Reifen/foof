import { database } from "@/database";
import { Q } from "@nozbe/watermelondb";
import { Location } from "@/database/model/model";
import { LocationObject } from "expo-location";

/**
 * Creates a new location for a stage
 * @param stageId - The id of the stage
 * @param latitude - The latitude of the location
 * @param longitude - The longitude of the location
 * @param recordedAt - If not provided, the current time is used
 */
export const createLocation = async (
  stageId: string,
  latitude: number,
  longitude: number,
  recordedAt?: number,
): Promise<Location> => {
  return database.write(async () => {
    return database.get<Location>("locations").create((location) => {
      location.stage.id = stageId;
      location.latitude = latitude;
      location.longitude = longitude;
      location.recordedAt = recordedAt ?? Date.now();
    });
  });
};

/**
 * Creates multiple locations as a batch for a stage
 * @param stageId - The id of the stage
 * @param locations - The array of location objects
 */
export const createLocations = async (
  stageId: string,
  locations: LocationObject[],
) => {
  return database.write(async () => {
    const locationCollection = database.get<Location>("locations");
    const batchActions: Location[] = [];

    for (const location of locations) {
      batchActions.push(
        locationCollection.prepareCreate((dbLocation) => {
          dbLocation.stage.id = stageId;
          dbLocation.latitude = location.coords.latitude;
          dbLocation.longitude = location.coords.longitude;
          dbLocation.recordedAt = location.timestamp;
        }),
      );
    }

    return database.batch(batchActions);
  });
};

export type sortOrder = "asc" | "desc" | "none";

/**
 * Returns a query for all locations of a stage
 * @param stageId - The id of the stage
 * @param sortOrder - The order of the locations (asc or desc or none) (default: asc)
 */
export const getAllLocationsByStageIdQuery = (
  stageId: string,
  sortOrder: sortOrder = "asc",
) => {
  const locationCollection = database.get<Location>("locations");
  if (sortOrder === "none") {
    return locationCollection.query(Q.where("stage_id", stageId));
  }
  return locationCollection.query(
    Q.where("stage_id", stageId),
    Q.sortBy("recorded_at", sortOrder),
  );
};

/**
 * Returns all locations of a stage
 * @param stageId - The id of the stage
 * @param sortOrder - The order of the locations (asc or desc or none) (default: asc)
 */
export const getAllLocationsByStageId = (
  stageId: string,
  sortOrder: sortOrder = "asc",
) => {
  return getAllLocationsByStageIdQuery(stageId, sortOrder).fetch();
};
