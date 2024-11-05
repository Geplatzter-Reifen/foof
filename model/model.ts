import { Model } from "@nozbe/watermelondb";
import { field, relation, text, writer } from "@nozbe/watermelondb/decorators";
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

  //@ts-ignore
  @writer async addTrip(title: string) {
    return await this.collections.get<Trip>("trips").create((trip) => {
      trip.title = title;
      trip.startedAt = Date.now();
      trip.journey.set(this);
    });
  }

  get trips() {
    return this.collections.get<Trip>("trips").query();
  }
}

class Trip extends Model {
  static table = "trips";
  static associations: Associations = {
    journeys: { type: "belongs_to", key: "journey_id" },
    locations: { type: "has_many", foreignKey: "trip_id" },
  };
  // @ts-ignore
  @text("title") title: string;
  // @ts-ignore
  @field("started_at") startedAt: number;
  // @ts-ignore
  @field("finished_at") finishedAt: number;
  // @ts-ignore
  @relation("journey", "journey_id") journey;
  // @ts-ignore
  @writer async addLocation(latitude: number, longitude: number) {
    return await this.collections
      .get<Location>("locations")
      .create((location) => {
        location.latitude = latitude;
        location.longitude = longitude;
        location.recordedAt = Date.now();
        location.trip.set(this);
      });
  }
}

class Location extends Model {
  static table = "locations";
  static associations: Associations = {
    trips: { type: "belongs_to", key: "trip_id" },
  };
  // @ts-ignore
  @field("latitude") latitude: number;
  // @ts-ignore
  @field("longitude") longitude: number;
  // @ts-ignore
  @field("recorded_at") recordedAt: number;
  // @ts-ignore
  @relation("trip", "trip_id") trip;
}

export { Journey, Trip, Location };
