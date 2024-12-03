import * as StatisticsService from "../statisticsService";
import { MockStage } from "@/__mocks__/stage";

describe("statisticsService", () => {
  beforeEach(() => {
    jest
      .spyOn(global.Date, "now")
      .mockImplementation(() => new Date("2024-01-01 21:00").getTime());
  });
  const stageOne = new MockStage({
    startedAt: new Date("2024-01-01 10:00").getTime(),
    finishedAt: new Date("2024-01-01 11:00").getTime(),
  });
  const stageTwo = new MockStage({
    startedAt: new Date("2024-01-02 11:00").getTime(),
    finishedAt: new Date("2024-01-02 20:37").getTime(),
    distance: 200.125,
  });
  const stageOnlyStart = new MockStage({
    startedAt: new Date("2024-01-01 15:00").getTime(),
  });
  const stages = [stageOne, stageTwo];
  describe("getStageDistanceString", () => {
    it("should return the correct distance for a stage", () => {
      // @ts-ignore
      expect(StatisticsService.getStageDistanceString(stageOne)).toBe(
        "42.2 km",
      );
    });
    it("should return the correct distance for a stage, with correct precision", () => {
      // @ts-ignore
      expect(StatisticsService.getStageDistanceString(stageOne, 3)).toBe(
        "42.195 km",
      );
    });
  });

  describe("getTourDuration", () => {
    it("should return 0 for an empty tour", () => {
      expect(StatisticsService.getTourDuration([])).toBe(0);
    });

    it("should return the sum of all stages' durations", () => {
      // @ts-ignore
      expect(StatisticsService.getTourDuration(stages)).toBe(38220000);
    });

    it("should return correct value if a stage has no finishedAt", () => {
      const stage = new MockStage({
        startedAt: new Date("2024-01-01 15:00").getTime(),
      });
      // @ts-ignore
      expect(StatisticsService.getTourDuration([stage])).toBe(21600000);
    });
  });

  describe("getTourDistance", () => {
    it("should return 0 for an empty tour", () => {
      expect(StatisticsService.getTourDistance([])).toBe(0);
    });

    it("should return the sum of all stages' distances", () => {
      // @ts-ignore
      expect(StatisticsService.getTourDistance(stages)).toBeCloseTo(242.32);
    });
  });

  describe("getTourAverageSpeed", () => {
    it("should return 0 for an empty tour", () => {
      expect(StatisticsService.getTourDistance([])).toBe(0);
    });

    it("should return 0 for a tour with no duration", () => {
      const tourWithNoDuration = [
        new MockStage({
          startedAt: new Date("2024-01-01 15:00").getTime(),
          finishedAt: new Date("2024-01-01 15:00").getTime(),
        }),
      ];
      // @ts-ignore
      expect(StatisticsService.getTourAverageSpeed(tourWithNoDuration)).toBe(0);
    });

    it("should return the correct average speed for a tour", () => {
      // @ts-ignore
      expect(StatisticsService.getTourAverageSpeed(stages)).toBeCloseTo(22.82);
    });
  });

  describe("getStageDuration", () => {
    it("should return the correct duration for a stage", () => {
      // @ts-ignore
      expect(StatisticsService.getStageDuration(stageOne)).toBe(3600000);
    });
    it("should return the correct duration for a stage with only a start", () => {
      // @ts-ignore
      expect(StatisticsService.getStageDuration(stageOnlyStart)).toBe(21600000);
    });
  });

  describe("getStageDurationString", () => {
    it("should return the correct duration string for a stage", () => {
      // @ts-ignore
      expect(StatisticsService.getStageDurationString(stageOne)).toBe(
        "01:00 h",
      );
    });
    it("should return the correct duration string for a stage with only a start", () => {
      // @ts-ignore
      expect(StatisticsService.getStageDurationString(stageOnlyStart)).toBe(
        "06:00 h",
      );
    });
  });

  describe("getStageAvgSpeedInKmh", () => {
    it("should return the correct average speed for a stage", () => {
      // @ts-ignore
      expect(StatisticsService.getStageAvgSpeedInKmh(stageOne)).toBe(42.195);
    });
    it("should return the correct average speed for a stage with only a start", () => {
      // @ts-ignore
      expect(StatisticsService.getStageAvgSpeedInKmh(stageOnlyStart)).toBe(
        7.0325,
      );
    });
  });

  describe("getStageAvgSpeedString", () => {
    it("should return the correct average speed string for a stage", () => {
      // @ts-ignore
      expect(StatisticsService.getStageAvgSpeedString(stageOne)).toBe(
        "42.2 km/h",
      );
    });
    it("should return the correct average speed string for a stage with better precission", () => {
      // @ts-ignore
      expect(StatisticsService.getStageAvgSpeedString(stageOne, 2)).toBe(
        "42.20 km/h",
      );
    });
    it("should return the correct average speed string for a stage with only a start", () => {
      // @ts-ignore
      expect(StatisticsService.getStageAvgSpeedString(stageOnlyStart)).toBe(
        "7.0 km/h",
      );
    });
  });
});
