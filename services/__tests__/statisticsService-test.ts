import { getTourDuration } from "../statisticsService";
import { MockStage } from "@/__mocks__/stage";

describe("getTourDuration", () => {
  const stageOne = new MockStage({
    startedAt: new Date("2021-01-01 10:00").getTime(),
    finishedAt: new Date("2021-01-01 11:00").getTime(),
  });
  const stageTwo = new MockStage({
    startedAt: new Date("2021-01-02 11:00").getTime(),
    finishedAt: new Date("2021-01-02 20:37").getTime(),
  });
  const stages = [stageOne, stageTwo];

  it("should return 0 for an empty tour", () => {
    expect(getTourDuration([])).toBe(0);
  });

  it("should return the sum of all stages' durations", () => {
    // @ts-ignore
    expect(getTourDuration(stages)).toBe(38220000);
  });

  it("should return correct value if a stage has no finishedAt", () => {
    const stage = new MockStage({
      startedAt: new Date("2021-01-01 10:00").getTime(),
    });
    // @ts-ignore
    expect(getTourDuration([stage])).toBeGreaterThan(0);
  });
});
