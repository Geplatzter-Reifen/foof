import {
  parseCoordinates,
  ensurePermissions,
  validateManualStageInput,
} from "@/services/trackingService";

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

  describe("validateManualStageInput", () => {
    const mockStartTime = new Date("2025-01-01T10:00:00Z");
    const mockEndTime = new Date("2025-01-01T11:00:00Z");
    const invalidStartTime = new Date("2025-01-01T12:00:00Z");
    const invalidEndTime = new Date("2025-01-01T09:00:00Z");

    it("should not throw an error for valid input", () => {
      expect(() =>
        validateManualStageInput(
          "Stage Name",
          mockStartTime,
          mockEndTime,
          { latitude: 50.0, longitude: 8.0 },
          { latitude: 51.0, longitude: 9.0 },
        ),
      ).not.toThrow();
    });

    it("should throw an error for empty stage name", () => {
      expect(() =>
        validateManualStageInput(
          "",
          mockStartTime,
          mockEndTime,
          { latitude: 50.0, longitude: 8.0 },
          { latitude: 51.0, longitude: 9.0 },
        ),
      ).toThrow("Bitte gib einen Tournamen an");
    });

    it("should throw an error for invalid coordinates", () => {
      expect(() =>
        validateManualStageInput(
          "Stage Name",
          mockStartTime,
          mockEndTime,
          null,
          { latitude: 51.0, longitude: 9.0 },
        ),
      ).toThrow("Ungültiges Koordinatenformat");
    });

    it("should throw an error for invalid times", () => {
      expect(() =>
        validateManualStageInput(
          "Stage Name",
          invalidStartTime,
          invalidEndTime,
          { latitude: 50.0, longitude: 8.0 },
          { latitude: 51.0, longitude: 9.0 },
        ),
      ).toThrow("Start und Endzeit sind ungültig");
    });
  });
});
