import { ensurePermissions } from "@/services/trackingService";
import * as Location from "expo-location";

jest.mock("@/services/data/stageService", () => ({
  createStage: jest.fn(),
  setStageDistance: jest.fn(),
  setStageAvgSpeed: jest.fn(),
  startStage: jest.fn(),
  finishStage: jest.fn(),
  getActiveStage: jest.fn(),
}));

jest.mock("@/services/data/locationService", () => ({
  createLocation: jest.fn(),
}));

jest.mock("@/services/data/tourService", () => ({
  getTourByTourId: jest.fn(),
  getActiveTour: jest.fn(),
}));

jest.mock("expo-location");
jest.mock("expo-task-manager");

describe("Tracking", () => {
  describe("ensurePermissions", () => {
    it("should resolve if permissions are granted", async () => {
      // @ts-ignore
      Location.requestForegroundPermissionsAsync.mockResolvedValue({
        status: "granted",
      });

      await expect(ensurePermissions()).resolves.not.toThrow();
    });

    it("should throw an error if permissions are denied", async () => {
      // @ts-ignore
      Location.requestForegroundPermissionsAsync.mockResolvedValue({
        status: "denied",
      });

      await expect(ensurePermissions()).rejects.toThrow(
        "Location permissions not granted",
      );
    });
  });
});
