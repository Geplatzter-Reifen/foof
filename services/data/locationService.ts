import { database } from "@/model/createDatabase";
import { Q } from "@nozbe/watermelondb";
import { Location, Stage } from "@/model/model";

// CREATE

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

// READ

export const getAllLocationsByStageIdQuery = (stageId: string) => {
  return database
    .get<Location>("locations")
    .query(Q.where("stage_id", stageId));
};
export const getAllLocationsByStageId = (stageId: string) => {
  return getAllLocationsByStageIdQuery(stageId).fetch();
};
