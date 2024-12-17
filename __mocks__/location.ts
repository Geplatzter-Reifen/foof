import { MockStage } from "./stage";

type LocationMockConstructorArgs = {
  latitude: number;
  longitude: number;
  recordedAt?: number;
  stage: MockStage[];
  collections: any;
};

export class MockLocation {
  constructor({
    latitude = 50.0826,
    longitude = 8.24,
    recordedAt = new Date("2024-12-03 12:00").getTime(),
    stage = [new MockStage()],
    collections = {},
  }: Partial<LocationMockConstructorArgs> = {}) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.recordedAt = recordedAt;
    this.stage = stage;
    this.collections = collections;
  }
  static table = "stages";

  static associations = {
    stages: { type: "belongs_to", key: "stage_id" },
  };

  // Properties
  latitude: number;
  longitude: number;
  recordedAt?: number;
  stage;
  collections;
}
