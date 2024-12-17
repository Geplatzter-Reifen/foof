import { createLocation } from "../data/locationService";
import { createStage } from "../data/stageService";
import { createTour } from "../data/tourService";
import { isFinished } from "../StageConnection/stageConnection";
import {
  flensburg,
  hannover,
  oberstdorf,
  wuerzburg,
} from "../StageConnection/data";

describe("stageConnection", () => {
  describe("isFinished", () => {
    it("should return false", async () => {
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
      await createLocation(stage1.id, flensburg.latitude, flensburg.longitude);
      await createLocation(stage1.id, hannover.latitude, hannover.longitude);

      const stage2 = await createStage(
        tour.id,
        "Test Stage 2",
        new Date("2024-01-02T20:00:00.000").getTime(),
        new Date("2024-01-02T21:00:00.000").getTime(),
        true,
      );

      await createLocation(stage2.id, wuerzburg.latitude, wuerzburg.longitude);
      await createLocation(
        stage2.id,
        oberstdorf.latitude,
        oberstdorf.longitude,
      );

      // Act
      const result = await isFinished(tour);

      // Assert
      expect(result).toBe(true);
    });
  });
});
