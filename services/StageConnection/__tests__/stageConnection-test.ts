import { createLocation } from "../../data/locationService";
import { createStage } from "../../data/stageService";
import { createTour, getTourByTourId } from "../../data/tourService";
import {
  tourIsFinished,
  areHeadAndTailInFlensburgAndOberstdorf,
  isLocationInRadius,
  getFirstLocation,
  getLastLocation,
} from "../stageConnection";
import { flensburg, hannover, wuerzburg, oberstdorf, wiesbaden } from "../data";
import { Location, Tour } from "@/database/model/model";
import { MapPoint } from "@/utils/locationUtils";

const dateNowMock = new Date("2024-01-01 21:00").getTime();

describe("stageConnection", () => {
  describe("isFinished", () => {
    let tour: Tour;
    beforeEach(async () => {
      tour = await createTour(
        "Test Tour",
        new Date("2024-01-01T20:30:00.000").getTime(),
      );
      jest.spyOn(global.Date, "now").mockImplementation(() => dateNowMock);
    });
    it("should return true when a continous route from flensburg to oberstdorf exists", async () => {
      // Flensburg -> Hannover -> Oberstdorf
      // Arrange
      await createStageWithTwoLocations(
        tour.id,
        "Test Stage 1",
        flensburg,
        hannover,
      );
      await createStageWithTwoLocations(
        tour.id,
        "Test Stage 2",
        hannover,
        oberstdorf,
      );

      // Act
      const result = await tourIsFinished(tour);

      // Assert
      expect(result).toBeTruthy();
      tour = await getTourByTourId(tour.id);
      expect(tour.finishedAt).toBe(dateNowMock);
    });
    it("should return true when a direct route from flensburg to oberstdorf exists", async () => {
      // Flensburg -> Oberstdorf
      // Arrange
      await createStageWithTwoLocations(
        tour.id,
        "Test Stage 1",
        flensburg,
        oberstdorf,
      );

      // Act
      const result = await tourIsFinished(tour);

      // Assert
      expect(result).toBeTruthy();
      tour = await getTourByTourId(tour.id);
      expect(tour.finishedAt).toBe(dateNowMock);
    });
    it("should return true when a scrambled route from flensburg to oberstdorf exists", async () => {
      //Hannover -> Flensburg; Hannover -> Wuerzburg; Wuerzburg -> Wiesbaden; Oberstdorf -> Wiesbaden
      // Arrange
      await createStageWithTwoLocations(
        tour.id,
        "Test Stage 1",
        hannover,
        flensburg,
      );
      await createStageWithTwoLocations(
        tour.id,
        "Test Stage 2",
        hannover,
        wuerzburg,
      );
      await createStageWithTwoLocations(
        tour.id,
        "Test Stage 3",
        wuerzburg,
        wiesbaden,
      );
      await createStageWithTwoLocations(
        tour.id,
        "Test Stage 4",
        oberstdorf,
        wiesbaden,
      );
      // Act
      const result = await tourIsFinished(tour);

      // Assert
      expect(result).toBeTruthy();
      tour = await getTourByTourId(tour.id);
      expect(tour.finishedAt).toBe(dateNowMock);
    });
    it("should return false when no continous route from flensburg to oberstdorf exists", async () => {
      // Würzburg -> Hannover
      // Arrange
      await createStageWithTwoLocations(
        tour.id,
        "Test Stage 1",
        wuerzburg,
        hannover,
      );

      // Act
      const status = await tourIsFinished(tour);

      // Assert
      expect(status).toBe(false);
      tour = await getTourByTourId(tour.id);
      expect(tour.finishedAt).toBeNull();
    });
    it("should return false when no stages exist", () => {
      // Arrange

      // Act
      const status = tourIsFinished(tour);

      // Assert
      expect(status).resolves.toBeFalsy();
    });
  });
  describe("areHeadAndTailInFlensburgAndOberstdorf", () => {
    it("should return true when head and tail are in Flensburg and Oberstdorf", () => {
      // Arrange
      const head = flensburg;
      const tail = oberstdorf;

      // Act
      const result = areHeadAndTailInFlensburgAndOberstdorf(head, tail);

      // Assert
      expect(result).toBeTruthy();
    });
    it("should return false when head is not in Flensburg", () => {
      // Arrange
      const head = hannover;
      const tail = oberstdorf;

      // Act
      const result = areHeadAndTailInFlensburgAndOberstdorf(head, tail);

      // Assert
      expect(result).toBeFalsy();
    });
    it("should return false when tail is not in Oberstdorf", () => {
      // Arrange
      const head = flensburg;
      const tail = hannover;

      // Act
      const result = areHeadAndTailInFlensburgAndOberstdorf(head, tail);

      // Assert
      expect(result).toBeFalsy();
    });
  });
  describe("isLocationInRadius", () => {
    it("should return true when two locations are in a radius of 5", () => {
      // Arrange
      const locationA = flensburg;
      const locationB = {
        latitude: flensburg.latitude + 0.0001,
        longitude: flensburg.longitude + 0.0001,
      };

      // Act
      const result = isLocationInRadius(locationA, locationB, 5);

      // Assert
      expect(result).toBeTruthy();
    });
    it("should return false when two locations are not in a radius of 5", () => {
      // Arrange
      const locationA = flensburg;
      const locationB = hannover;

      // Act
      const result = isLocationInRadius(locationA, locationB, 5);

      // Assert
      expect(result).toBeFalsy();
    });
  });
  describe("getFirstLocation", () => {
    it("should return the first location in the array", () => {
      // Arrange
      const locations = [
        { latitude: 1, longitude: 1, recordedAt: 1 },
        { latitude: 2, longitude: 2, recordedAt: 2 },
        { latitude: 3, longitude: 3, recordedAt: 3 },
      ];

      // Act
      const result = getFirstLocation(locations);

      // Assert
      expect(result).toEqual({ latitude: 1, longitude: 1 });
    });
    it("should throw an error when the array is empty", () => {
      // Arrange
      const locations: Location[] = [];
      // Act
      const result = () => getFirstLocation(locations);

      // Assert
      expect(result).toThrow("No locations found");
    });
  });
  describe("getFirstLocation", () => {
    it("should return the first location in the array", () => {
      // Arrange
      const locations = [
        { latitude: 1, longitude: 1, recordedAt: 1 },
        { latitude: 3, longitude: 3, recordedAt: 3 },
        { latitude: 2, longitude: 2, recordedAt: 2 },
      ];

      // Act
      const result = getLastLocation(locations);

      // Assert
      expect(result).toEqual({ latitude: 3, longitude: 3 });
    });
    it("should throw an error when the array is empty", () => {
      // Arrange
      const locations: Location[] = [];
      // Act
      const result = () => getLastLocation(locations);

      // Assert
      expect(result).toThrow("No locations found");
    });
  });
});

/**
 * Creates a stage with two locations, the start and end of the stage.
 */
async function createStageWithTwoLocations(
  tourId: string,
  stageName: string,
  start: MapPoint,
  stop: MapPoint,
): Promise<void> {
  const stage = await createStage(
    tourId,
    stageName,
    new Date("2024-01-01T20:30:00.000").getTime(),
    new Date("2024-01-01T21:00:00.000").getTime(),
    true,
  );

  await createLocation(
    stage.id,
    start.latitude,
    start.longitude,
    new Date("2024-01-01T20:30:00.000").getTime(),
  );
  await createLocation(
    stage.id,
    stop.latitude,
    stop.longitude,
    new Date("2024-01-01T21:00:00.000").getTime(),
  );
}
