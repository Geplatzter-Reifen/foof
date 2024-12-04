import * as ColorUtils from "../colorUtil";

describe("ColorUtil", () => {
  describe("isHexValid", () => {
    it("should return true if hex is valid", () => {
      const result = ColorUtils.isHexValid("#FF0000");
      expect(result).toBe(true);
    });
    it("should return false if hex is invalid", () => {
      const result = ColorUtils.isHexValid("#FF00000");
      expect(result).toBe(false);
    });
  });
  describe("hexToRgb", () => {
    it.each([
      ["#FF0000", { r: 255, g: 0, b: 0 }],
      ["#00FF00", { r: 0, g: 255, b: 0 }],
      ["#0000FF", { r: 0, g: 0, b: 255 }],
    ])("should convert %s to %o", (hex, expected) => {
      const result = ColorUtils.hexToRgb(hex);
      expect(result).toEqual(expected);
    });

    it.each([
      ["#FF00000", "Invalid hex"],
      ["#FF000", "Invalid hex"],
      ["FF0000", "Invalid hex"],
      ["Invalid Hex", "Invalid hex"],
    ])("should throw error if hex is invalid", (hex, expected) => {
      expect(() => ColorUtils.hexToRgb(hex)).toThrow("Invalid hex");
    });
  });
  describe("hexToRgba", () => {
    it.each([
      ["#FF0000", 0, "rgba(255, 0, 0, 0)"],
      ["#00FF00", 1, "rgba(0, 255, 0, 1)"],
      ["#0000FF", 0.5, "rgba(0, 0, 255, 0.5)"],
    ])("should convert %s to %o", (hex, alpha, expected) => {
      const result = ColorUtils.hexToRgba(hex, alpha);
      expect(result).toEqual(expected);
    });
  });
});
