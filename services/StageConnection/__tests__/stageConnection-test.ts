import { createLocationWithRecordedAt } from "../../data/locationService";
import { createStage } from "../../data/stageService";
import { createTour } from "../../data/tourService";
import { isFinished } from "../stageConnection";
import { flensburg, hannover, wuerzburg, oberstdorf, wiesbaden } from "../data";
import { Tour } from "@/database/model/model";
import { MapPoint } from "@/utils/locationUtil";

describe("stageConnection", () => {
  describe("isFinished", () => {
    let tour: Tour;
    beforeEach(async () => {
      tour = await createTour(
        "Test Tour",
        new Date("2024-01-01T20:30:00.000").getTime(),
      );
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
      const result = await isFinished(tour);

      // Assert
      expect(result).toBeTruthy();
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
      const result = await isFinished(tour);

      // Assert
      expect(result).toBeTruthy();
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
      const result = await isFinished(tour);

      // Assert
      expect(result).toBeTruthy();
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
      const status = await isFinished(tour);

      // Assert
      expect(status).toBe(false);
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

  await createLocationWithRecordedAt(
    stage.id,
    start.latitude,
    start.longitude,
    new Date("2024-01-01T20:30:00.000").getTime(),
  );
  await createLocationWithRecordedAt(
    stage.id,
    stop.latitude,
    stop.longitude,
    new Date("2024-01-01T21:00:00.000").getTime(),
  );
}
