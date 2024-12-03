import { MockStage } from "./stage";

type TourMockConstructorArgs = {
  title: string;
  isActive: boolean;
  startedAt?: number;
  finishedAt?: number;
  routes: { id: string; name: string };
  collections: any;
  stages: any;
};

export class MockTour {
  constructor({
    title = "Mock Title",
    isActive = true,
    startedAt = new Date("2024-12-03 12:00").getTime(),
    finishedAt = undefined,
    stages = {
      fetch: jest.fn().mockReturnValue([new MockStage(), new MockStage()]),
    },
    routes = { id: "mock-route-id", name: "Mock Route" },
    collections = {},
  }: Partial<TourMockConstructorArgs> = {}) {
    this.title = title;
    this.isActive = isActive;
    this.startedAt = startedAt;
    this.finishedAt = finishedAt;
    this.routes = routes;
    this.stages = stages;
    this.collections = collections;
  }
  static table = "tours"; // bind the model to specific table
  static associations = {
    stages: { type: "has_many", foreignKey: "tour_id" },
    routes: { type: "has_many", foreignKey: "tour_id" },
  };

  // Properties
  title: string;
  isActive: boolean;
  startedAt: number;
  finishedAt?: number;
  stages;
  routes;
  collections;
}
