import { validateManualStageInputForTesting } from "@/services/manualStageInputService";

describe("validateManualStageInputForTesting", () => {
  const mockStartTime = new Date("2025-01-01T10:00:00Z");
  const mockEndTime = new Date("2025-01-01T11:00:00Z");
  const invalidStartTime = new Date("2025-01-01T12:00:00Z");
  const invalidEndTime = new Date("2025-01-01T09:00:00Z");

  it("should not throw an error for valid input", () => {
    expect(() =>
      validateManualStageInputForTesting(
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
      validateManualStageInputForTesting(
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
      validateManualStageInputForTesting(
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
      validateManualStageInputForTesting(
        "Stage Name",
        invalidStartTime,
        invalidEndTime,
        { latitude: 50.0, longitude: 8.0 },
        { latitude: 51.0, longitude: 9.0 },
      ),
    ).toThrow("Start und Endzeit sind ungültig");
  });
});
