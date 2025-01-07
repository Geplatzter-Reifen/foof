import * as StatisticsService from "../statisticsService";
import { MockStage } from "@/__mocks__/stage";
import {
  getTourProgress,
  mergeIntervalsForTesting,
} from "../statisticsService";
import { createStage } from "@/services/data/stageService";
import { createTour } from "@/services/data/tourService";
import { createLocation } from "@/services/data/locationService";
import { flensburg, oberstdorf } from "@/services/StageConnection/data";

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
  describe("Distance", () => {
    describe("getTourDistance", () => {
      it("should return 0 for an empty tour", () => {
        expect(StatisticsService.getTourDistance([])).toBe(0);
      });

      it("should return the sum of all stages' distances", () => {
        // @ts-ignore
        expect(StatisticsService.getTourDistance(stages)).toBeCloseTo(242.32);
      });
    });

    describe("getTourDistanceString", () => {
      it("should return the correct tour distance string", () => {
        // @ts-ignore
        expect(StatisticsService.getTourDistanceString(stages)).toBe(
          "242.3 km",
        );
      });
      it("should return the correct tour distance string, with correct precision", () => {
        // @ts-ignore
        expect(StatisticsService.getTourDistanceString(stages, 2)).toBe(
          "242.32 km",
        );
      });
    });

    describe("getStageDistanceString", () => {
      it("should return the correct distance string for a stage", () => {
        // @ts-ignore
        expect(StatisticsService.getStageDistanceString(stageOne)).toBe(
          "42.2 km",
        );
      });
      it("should return the correct distance string for a stage, with correct precision", () => {
        // @ts-ignore
        expect(StatisticsService.getStageDistanceString(stageOne, 3)).toBe(
          "42.195 km",
        );
      });
    });
  });

  describe("Duration", () => {
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

    describe("getTourDurationString", () => {
      it("should return the correct duration string for a stage", () => {
        // @ts-ignore
        expect(StatisticsService.getTourDurationString(stages)).toBe("10h 37m");
      });
    });

    describe("getStageDuration", () => {
      it("should return the correct duration for a stage", () => {
        // @ts-ignore
        expect(StatisticsService.getStageDuration(stageOne)).toBe(3600000);
      });
      it("should return the correct duration for a stage with only a start", () => {
        // @ts-ignore
        expect(StatisticsService.getStageDuration(stageOnlyStart)).toBe(
          21600000,
        );
      });
    });

    describe("getStageDurationString", () => {
      it("should return the correct duration string for a stage", () => {
        // @ts-ignore
        expect(StatisticsService.getStageDurationString(stageOne)).toBe(
          "1h 0m",
        );
      });
      it("should return the correct duration string for a stage with only a start", () => {
        // @ts-ignore
        expect(StatisticsService.getStageDurationString(stageOnlyStart)).toBe(
          "6h 0m",
        );
      });
      it("should return the correct duration string for a stage with minutes", () => {
        // @ts-ignore
        expect(StatisticsService.getStageDurationString(stageTwo)).toBe(
          "9h 37m",
        );
      });
    });
  });

  describe("Average Speed", () => {
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
        expect(StatisticsService.getTourAverageSpeed(tourWithNoDuration)).toBe(
          0,
        );
      });

      it("should return the correct average speed for a tour", () => {
        // @ts-ignore
        expect(StatisticsService.getTourAverageSpeed(stages)).toBeCloseTo(
          22.82,
        );
      });
    });

    describe("getTourAvgSpeedString", () => {
      it("should return the correct average speed string for a tour", () => {
        // @ts-ignore
        expect(StatisticsService.getTourAverageSpeedString(stages)).toBe(
          "22.8 km/h",
        );
      });
      it("should return the correct average speed string for a tour, with the right precision", () => {
        // @ts-ignore
        expect(StatisticsService.getTourAverageSpeedString(stages, 2)).toBe(
          "22.82 km/h",
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

  describe("Tour Progress", () => {
    describe("mergeIntervals", () => {
      it("should not merge intervals that don't overlap", () => {
        const intervals: [number, number][] = [
          [48, 49],
          [50, 51],
          [52, 53],
        ];
        expect(mergeIntervalsForTesting(intervals)).toEqual(intervals);
      });
      it("should merge two overlapping intervals into one", () => {
        const intervals: [number, number][] = [
          [53, 54],
          [48, 51],
          [50, 52],
        ];
        const expected = [
          [48, 52],
          [53, 54],
        ];
        expect(mergeIntervalsForTesting(intervals)).toEqual(expected);
      });
      it("should merge two intervals where one is inside the other", () => {
        const intervals: [number, number][] = [
          [48, 53],
          [50, 51],
        ];
        const expected = [[48, 53]];
        expect(mergeIntervalsForTesting(intervals)).toEqual(expected);
      });
      it("should merge two intervals that are almost joined", () => {
        const intervals: [number, number][] = [
          [49.003, 51],
          [48, 49],
        ];
        expect(mergeIntervalsForTesting(intervals)).toEqual([[48, 51]]);
      });
      it("should return an empty array if an empty array was given", () => {
        expect(mergeIntervalsForTesting([])).toEqual([]);
      });
    });

    describe("getTourProgress", () => {
      it("returns 0 for stages outside of the valid latitude area", async () => {
        const tour = await createTour("Progress Test Tour");
        const northStage = await createStage(tour.id, "North Stage");
        const southStage = await createStage(tour.id, "South Stage");
        await createLocation(northStage.id, 60, 8);
        await createLocation(northStage.id, 61, 8);
        await createLocation(southStage.id, 40, 8);
        await createLocation(southStage.id, 41, 8);

        expect(await getTourProgress([northStage, southStage])).toBe(0);
      });
      it("returns 0 for stages without locations", async () => {
        const tour = await createTour("Progress Test Tour");
        const stage1 = await createStage(tour.id, "Stage 1");
        const stage2 = await createStage(tour.id, "Stage 2");

        expect(await getTourProgress([stage1, stage2])).toBe(0);
      });
      it("returns 0 for stages with same start and end point", async () => {
        const tour = await createTour("Progress Test Tour");
        const stage = await createStage(tour.id, "Stage");
        await createLocation(stage.id, 50, 8);
        await createLocation(stage.id, 50, 8);

        expect(await getTourProgress([stage])).toBe(0);
      });
      it("returns 1 for a stage from Flensburg to Oberstdorf", async () => {
        const tour = await createTour("Progress Test Tour");
        const stage = await createStage(tour.id, "Stage");
        await createLocation(stage.id, flensburg.latitude, flensburg.longitude);
        await createLocation(
          stage.id,
          oberstdorf.latitude,
          oberstdorf.longitude,
        );

        expect(await getTourProgress([stage])).toBe(1);
      });
      it("returns 1 for a stage from just south of F to just north of O", async () => {
        const tour = await createTour("Progress Test Tour");
        const stage = await createStage(tour.id, "Stage");
        await createLocation(
          stage.id,
          flensburg.latitude - 0.01,
          flensburg.longitude,
        );
        await createLocation(
          stage.id,
          oberstdorf.latitude + 0.01,
          oberstdorf.longitude,
        );
      });
      it("returns 1 for two partly overlapping stages from Flensburg to Oberstdorf", async () => {
        const tour = await createTour("Progress Test Tour");
        const stage1 = await createStage(tour.id, "Stage 1");
        const stage2 = await createStage(tour.id, "Stage 2");
        await createLocation(
          stage1.id,
          flensburg.latitude,
          flensburg.longitude,
        );
        await createLocation(stage1.id, 50, 8);
        await createLocation(stage2.id, 51, 8);
        await createLocation(
          stage2.id,
          oberstdorf.latitude,
          oberstdorf.longitude,
        );

        expect(await getTourProgress([stage1, stage2])).toBe(1);
      });
      it("returns 1 for two joining stages from Flensburg to Oberstdorf", async () => {
        const tour = await createTour("Progress Test Tour");
        const stage1 = await createStage(tour.id, "Stage 1");
        const stage2 = await createStage(tour.id, "Stage 2");
        await createLocation(
          stage1.id,
          flensburg.latitude,
          flensburg.longitude,
        );
        await createLocation(stage1.id, 50, 8);
        await createLocation(stage2.id, 50, 8);
        await createLocation(
          stage2.id,
          oberstdorf.latitude,
          oberstdorf.longitude,
        );

        expect(await getTourProgress([stage1, stage2])).toBe(1);
      });
      it("returns 1 for a stage from north of F to south of O", async () => {
        const tour = await createTour("Progress Test Tour");
        const stage = await createStage(tour.id, "Stage");
        await createLocation(stage.id, 55, 8);
        await createLocation(stage.id, 47, 8);

        expect(await getTourProgress([stage])).toBe(1);
      });
      it("returns 0.5 for two unjoined stages that add up to half the tour", async () => {
        const tour = await createTour("Progress Test Tour");
        const stage1 = await createStage(tour.id, "Stage 1");
        const stage2 = await createStage(tour.id, "Stage 2");
        await createLocation(
          stage1.id,
          flensburg.latitude,
          flensburg.longitude,
        );
        await createLocation(stage1.id, 52.94, 8);
        await createLocation(stage2.id, 49.25, 8);
        await createLocation(
          stage2.id,
          oberstdorf.latitude,
          oberstdorf.longitude,
        );

        expect(await getTourProgress([stage1, stage2])).toBeCloseTo(0.5);
      });
      it("returns 0.5 for two overlapping stages that add up to half the tour", async () => {
        const tour = await createTour("Progress Test Tour");
        const stage1 = await createStage(tour.id, "Stage 1");
        const stage2 = await createStage(tour.id, "Stage 2");
        await createLocation(
          stage1.id,
          flensburg.latitude,
          flensburg.longitude,
        );
        await createLocation(stage1.id, 52, 8);
        await createLocation(stage2.id, 53, 8);
        await createLocation(stage2.id, 51.098, 8);
        expect(await getTourProgress([stage1, stage2])).toBeCloseTo(0.5);
      });
      it("returns 0 for empty stage list", async () => {
        expect(await getTourProgress([])).toBe(0);
      });
    });
  });
});
