type StageMockConstructorArgs = {
  latitude: number;
  longitude: number;
  recordedAt?: number;
  stage: { id: string; name: string };
  collections: any;
};

export class MockStage {
  constructor({
    latitude = 50.0826,
    longitude = 8.24,
    recordedAt = new Date("2024-12-03 12:00").getTime(),
    stage = { id: "mock-stage-id", name: "Mock Stage" },
    collections = {},
  }: Partial<StageMockConstructorArgs> = {}) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.recordedAt = recordedAt;
    this.stage = stage;
    this.collections = collections;
  }
  static table = "stages";

  static associations = {
    tours: { type: "belongs_to", key: "tour_id" },
    locations: { type: "has_many", foreignKey: "stage_id" },
  };

  // Properties
  latitude: number;
  longitude: number;
  recordedAt?: number;
  stage;
  collections;
}
