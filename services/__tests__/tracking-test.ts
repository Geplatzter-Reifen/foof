import { parseCoordinates } from "@/services/tracking";

describe("Tracking", () => {
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
