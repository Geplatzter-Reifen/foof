import * as dateUtil from "../dateUtils";

describe("dateUtil", () => {
  const startDate = new Date("2024-11-29T20:30:00.000");
  const startDateNum = startDate.getTime();
  const endDate = new Date("2024-11-30T11:20:00.000");
  describe("formatDate", () => {
    it("should format date correctly", () => {
      expect(dateUtil.formatDate(startDate, dateUtil.DateFormat.DATE)).toBe(
        "29.11.2024",
      );
      expect(dateUtil.formatDate(startDateNum, dateUtil.DateFormat.DATE)).toBe(
        "29.11.2024",
      );
    });
    it("should format time correctly", () => {
      expect(dateUtil.formatDate(startDate, dateUtil.DateFormat.TIME)).toBe(
        "20:30",
      );
      expect(dateUtil.formatDate(startDateNum, dateUtil.DateFormat.TIME)).toBe(
        "20:30",
      );
    });
    it("should format date and time correctly", () => {
      expect(
        dateUtil.formatDate(startDate, dateUtil.DateFormat.DATE_TIME),
      ).toBe("29.11.2024 20:30");
      expect(
        dateUtil.formatDate(startDateNum, dateUtil.DateFormat.DATE_TIME),
      ).toBe("29.11.2024 20:30");
    });
  });
  describe("getDurationFormatted", () => {
    it("should format duration correctly", () => {
      expect(dateUtil.getDurationFormatted(startDate, endDate)).toBe("14h 50m");
    });
    it("should not work with end date before", () => {
      expect(() => dateUtil.getDurationFormatted(endDate, startDate)).toThrow();
    });
  });
  describe("getDurationMsFormatted", () => {
    it("should format duration correctly for < 24h", () => {
      expect(dateUtil.getDurationMsFormatted(54420123)).toBe("15h 7m");
    });
    it("should format duration correctly for 24h", () => {
      expect(dateUtil.getDurationMsFormatted(86400000)).toBe("1d 0h 0m");
    });
    it("should format duration correctly for > 24h", () => {
      expect(dateUtil.getDurationMsFormatted(91567654)).toBe("1d 1h 26m");
    });
  });
});
