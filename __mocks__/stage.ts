type StageMockConstructorArgs = {
  title: string;
  isActive: boolean;
  startedAt: number;
  finishedAt: number | undefined;
  distance: number;
  avgSpeed: number;
  tour: { id: string; name: string };
  collections: any;
};

export class MockStage {
  constructor({
    title = "Mock Title",
    isActive = true,
    startedAt = new Date("2024-12-03 12:00").getTime(),
    finishedAt = undefined,
    distance = 42.195,
    avgSpeed = 10.5,
    tour = { id: "mock-tour-id", name: "Mock Tour" },
    collections = {
      get: jest.fn(() => ({
        create: jest.fn((fn) => {
          const mockLocation = {
            latitude: 0,
            longitude: 0,
            recordedAt: Date.now(),
            stage: { set: jest.fn() },
          };
          fn(mockLocation);
          return Promise.resolve(mockLocation);
        }),
      })),
    },
  }: Partial<StageMockConstructorArgs> = {}) {
    this.title = title;
    this.isActive = isActive;
    this.startedAt = startedAt;
    this.finishedAt = finishedAt;
    this.distance = distance;
    this.avgSpeed = avgSpeed;
    this.tour = tour;
    this.collections = collections;
  }
  static table = "stages";

  static associations = {
    tours: { type: "belongs_to", key: "tour_id" },
    locations: { type: "has_many", foreignKey: "stage_id" },
  };

  // Properties
  // Properties
  title: string;
  isActive: boolean;
  startedAt: number;
  finishedAt?: number;
  distance: number;
  avgSpeed: number;
  tour;
  collections;
}
