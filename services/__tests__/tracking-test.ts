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
  });
});
