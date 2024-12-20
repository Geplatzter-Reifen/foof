import { createLocationWithRecordedAt } from "../../data/locationService";
import { createStage } from "../../data/stageService";
import { createTour } from "../../data/tourService";
import { isFinished } from "../stageConnection";
import { flensburg, hannover, oberstdorf } from "../data";

describe("stageConnection", () => {
  describe("isFinished", () => {
    it("should return true when a continous route from flensburg to oberstdorf is in the database", async () => {
      // Arrange
      const tour = await createTour(
        "Test Tour",
        new Date("2024-01-01T20:30:00.000").getTime(),
      );

      const stage1 = await createStage(
        tour.id,
        "Test Stage 1",
        new Date("2024-01-01T20:30:00.000").getTime(),
        new Date("2024-01-01T21:00:00.000").getTime(),
      );
      await createLocationWithRecordedAt(
        stage1.id,
        flensburg.latitude,
        flensburg.longitude,
        new Date("2024-01-01T20:30:00.000").getTime(),
      );
      await createLocationWithRecordedAt(
        stage1.id,
        hannover.latitude,
        hannover.longitude,
        new Date("2024-01-01T21:30:00.000").getTime(),
      );

      const stage2 = await createStage(
        tour.id,
        "Test Stage 2",
        new Date("2024-01-02T20:00:00.000").getTime(),
        new Date("2024-01-02T21:00:00.000").getTime(),
        true,
      );

      await createLocationWithRecordedAt(
        stage2.id,
        hannover.latitude,
        hannover.longitude,
        new Date("2024-01-02T20:00:00.000").getTime(),
      );
      await createLocationWithRecordedAt(
        stage2.id,
        oberstdorf.latitude,
        oberstdorf.longitude,
        new Date("2024-01-02T21:00:00.000").getTime(),
      );

      // Act
      const result = await isFinished(tour);

      // Assert
      expect(result).toBe(true);
    });
  });
});
