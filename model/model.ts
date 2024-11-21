import { Model } from "@nozbe/watermelondb";
import { field, text, writer, relation } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

class Tour extends Model {
  static table = "tours"; // bind the model to specific table
  static associations: Associations = {
    stages: { type: "has_many", foreignKey: "tour_id" },
  };
  // @ts-ignore
  @text("title") title: string;
  // @ts-ignore
  @field("is_active") isActive: boolean;
  // @ts-ignore
  @field("started_at") startedAt?: number;
  // @ts-ignore
  @field("finished_at") finishedAt?: number;

  //@ts-ignore
  @writer async addStage(title: string, startedAt?: number) {
    return this.collections.get<Stage>("stages").create((stage) => {
      stage.title = title;
      stage.startedAt = startedAt ?? Date.now();
      stage.tour.set(this);
    });
  }

  get stages() {
    return this.collections.get<Stage>("stages").query();
  }
}

class Stage extends Model {
  static table = "stages";
  static associations: Associations = {
    tours: { type: "belongs_to", key: "tour_id" },
    locations: { type: "has_many", foreignKey: "stage_id" },
  };
  // @ts-ignore
  @text("title") title: string;
  // @ts-ignore
  @field("is_active") isActive: boolean;
  // @ts-ignore
  @field("started_at") startedAt: number;
  // @ts-ignore
  @field("finished_at") finishedAt?: number;
  // @ts-ignore
  @field("distance") distance: number;
  // @ts-ignore
  @field("avg_speed") avgSpeed: number;
  // @ts-ignore
  @relation("tour", "tour_id") tour;
  // @ts-ignore
  @writer async addLocation(
    latitude: number,
    longitude: number,
    recordedAt?: number,
  ) {
    return this.collections.get<Location>("locations").create((location) => {
      location.latitude = latitude;
      location.longitude = longitude;
      location.recordedAt = recordedAt ?? Date.now();
      location.stage.set(this);
    });
  }
}

class Location extends Model {
  static table = "locations";
  static associations: Associations = {
    stages: { type: "belongs_to", key: "stage_id" },
  };
  // @ts-ignore
  @field("latitude") latitude: number;
  // @ts-ignore
  @field("longitude") longitude: number;
  // @ts-ignore
  @field("speed") speed: number;
  // @ts-ignore
  @field("recorded_at") recordedAt?: number;
  // @ts-ignore
  @relation("stage", "stage_id") stage;
}

export { Tour, Stage, Location };
