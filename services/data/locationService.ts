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

// READ

export const getAllLocationsByStageIdQuery = (stageId: string) => {
  return database
    .get<Location>("locations")
    .query(Q.where("stage_id", stageId));
};
export const getAllLocationsByStageId = (stageId: string) => {
  return getAllLocationsByStageIdQuery(stageId).fetch();
};

//gets the location of a stage the has the earliest "startedAt" timestamp
export const getFirstLocationByTourId = async (tourId: string) => {
  const stages = await database
    .get<Stage>("stages")
    .query(Q.where("tour_id", tourId))
    .fetch();
  const stage = stages.reduce((prev, current) =>
    prev.startedAt < current.startedAt ? prev : current,
  );
  return getAllLocationsByStageId(stage.id);
};
