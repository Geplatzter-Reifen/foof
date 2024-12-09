import * as dateUtil from "../dateUtil";

describe("dateUtil", () => {
  const startDate = new Date("2024-11-29T20:30:00.000");
  const startDateNum = startDate.getTime();
  const endDate = new Date("2024-11-30T11:20:00.000");
  const endDateNum = endDate.getTime();
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
      expect(dateUtil.getDurationFormatted(startDate, endDate)).toBe("14:50 h");
    });
    it("should not work with end date before", () => {
      expect(() => dateUtil.getDurationFormatted(endDate, startDate)).toThrow();
    });
  });
  describe("getTotalMillisecondsString", () => {
    it("should format total milliseconds correctly", () => {
      expect(
        dateUtil.getTotalMillisecondsString(endDateNum - startDateNum),
      ).toBe("14:50 h");
    });
  });
});
