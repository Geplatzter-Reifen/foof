import * as locationUtil from "../locationUtil";
import { parseCoordinates } from "@/utils/locationUtil";
describe("LocationUtil", () => {
  const wiesbaden = {
    latitude: 50.0826,
    longitude: 8.24,
  };
  const frankfurt = {
    latitude: 50.111629,
    longitude: 8.682547,
  };
  const distanceWiesbadenFrankfurt = 31.73; // km

  it("should calculate the distance between two points", () => {
    const distance = locationUtil.calculateDistance(wiesbaden, frankfurt);
    expect(distance).toBeCloseTo(distanceWiesbadenFrankfurt);
  });
  it("should throw an error if the location is invalid", () => {
    const invalidLocation = {
      latitude: 91,
      longitude: 181,
    };
    expect(() =>
      locationUtil.calculateDistance(wiesbaden, invalidLocation),
    ).toThrow("Invalid location");
  });

  describe("parseCoordinates", () => {
    it("should parse coordinates correctly", () => {
      const input = "50.0977, 8.21725";
      const result = parseCoordinates(input);
      expect(result).toEqual({
        latitude: 50.0977,
        longitude: 8.21725,
      });
    });
    it("should return null for a too low latitude", () => {
      const input = "-91.0, 8.21725";
      const result = parseCoordinates(input);
      expect(result).toBeNull();
    });
    it("should return null for a too high latitude", () => {
      const input = "91.0, 8.21725";
      const result = parseCoordinates(input);
      expect(result).toBeNull();
    });
    it("should return null for a too low longitude", () => {
      const input = "90.0, -181.0";
      const result = parseCoordinates(input);
      expect(result).toBeNull();
    });
    it("should return null for a too high longitude", () => {
      const input = "90.0, 181.0";
      const result = parseCoordinates(input);
      expect(result).toBeNull();
    });
  });
});
