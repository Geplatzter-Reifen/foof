import { database } from "@/database";
import { Q } from "@nozbe/watermelondb";
import { Location, Stage } from "@/database/model/model";

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
    const stage = await database.get<Stage>("stages").find(stageId);
    return database.get<Location>("locations").create((location) => {
      location.stage.set(stage);
      location.latitude = latitude;
      location.longitude = longitude;
      location.recordedAt = recordedAt ?? Date.now();
    });
  });
};

/**
 * Returns a query for all locations of a stage
 * @param stageId - The id of the stage
 * @param sortOrder - The order of the locations (asc or desc or none) (default: asc)
 */
export const getAllLocationsByStageIdQuery = (
  stageId: string,
  sortOrder: "asc" | "desc" | "none" = "asc",
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
  sortOrder: "asc" | "desc" | "none" = "asc",
) => {
  return getAllLocationsByStageIdQuery(stageId, sortOrder).fetch();
};
