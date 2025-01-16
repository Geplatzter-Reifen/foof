import { Model, Query, Relation } from "@nozbe/watermelondb";
import {
  field,
  text,
  writer,
  relation,
  children,
} from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

class Tour extends Model {
  static table = "tours"; // bind the model to specific table
  static associations: Associations = {
    stages: { type: "has_many", foreignKey: "tour_id" },
    routes: { type: "has_many", foreignKey: "tour_id" },
  };
  // @ts-ignore
  @text("title") title: string;
  // @ts-ignore
  @field("is_active") isActive: boolean;
  // @ts-ignore
  @field("started_at") startedAt?: number;
  // @ts-ignore
  @field("finished_at") finishedAt?: number;
  // @ts-ignore
  @children("stages") stages: Query<Stage>;
  // @ts-ignore
  @children("routes") routes: Query<Route>;

  //@ts-ignore
  @writer async addStage(
    title: string,
    startedAt?: number,
    finishedAt?: number,
    distance?: number,
    active: boolean = false,
  ) {
    return this.collections.get<Stage>("stages").create((stage) => {
      stage.title = title;
      stage.startedAt = startedAt ?? Date.now();
      if (finishedAt) {
        stage.finishedAt = finishedAt;
      }
      if (distance) {
        stage.distance = distance;
      }
      stage.isActive = active;
      stage.tour.set(this);
    });
  }
}

class Stage extends Model {
  static table = "stages";
  static associations: Associations = {
    tours: { type: "belongs_to", key: "tour_id" },
    locations: { type: "has_many", foreignKey: "stage_id" },
    routes: { type: "has_many", foreignKey: "stage_id" },
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
  @relation("tours", "tour_id") tour: Relation<Tour>;
  // @ts-ignore
  @children("locations") locations: Query<Location>;
  // @ts-ignore
  @children("routes") routes: Query<Route>;
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
  @field("recorded_at") recordedAt: number;
  // @ts-ignore
  @relation("stages", "stage_id") stage: Relation<Stage>;
}

class Route extends Model {
  static table = "routes";
  static associations: Associations = {
    tours: { type: "belongs_to", key: "tour_id" },
    stages: { type: "belongs_to", key: "stage_id" },
  };
  // @ts-ignore
  @field("geojson") geoJson: string;
  // @ts-ignore
  @relation("tours", "tour_id") tour: Relation<Tour>;
  // @ts-ignore
  @relation("stages", "stage_id") stage: Relation<Stage>;
}

export { Tour, Stage, Location, Route };
