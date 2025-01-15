import { database } from "@/database";
import { Q } from "@nozbe/watermelondb";
import { Location, Stage } from "@/database/model/model";

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

export const createLocationWithRecordedAt = async (
  stageId: string,
  latitude: number,
  longitude: number,
  recordedAt: number,
): Promise<Location> => {
  return database.write(async () => {
    const stage = await database.get<Stage>("stages").find(stageId);
    return database.get<Location>("locations").create((location) => {
      location.stage.set(stage);
      location.latitude = latitude;
      location.longitude = longitude;
      location.recordedAt = recordedAt;
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
