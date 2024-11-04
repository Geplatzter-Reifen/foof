import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

class Journey extends Model {
  static table = "journeys"; // bind the model to specific table
  static associations: Associations = {
    trips: { type: "has_many", foreignKey: "journey_id" },
  };
  // @ts-ignore
  @text("title") title: string;
  // @ts-ignore
  @field("started_at") startedAt: number;
  // @ts-ignore
  @field("finished_at") finishedAt: number;
}

class Trip extends Model {
  static table = "trips";
  static associations: Associations = {
    journeys: { type: "belongs_to", key: "journey_id" },
  };
  // @ts-ignore
  @text("title") title: string;
  // @ts-ignore
  @field("started_at") startedAt: number;
  // @ts-ignore
  @field("finished_at") finishedAt: number;
}

export { Journey, Trip };
