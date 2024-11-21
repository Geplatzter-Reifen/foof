import { calculateAverageSpeed } from "@/services/statistics/statisticsFunctions";

it("calculates average speed for same speeds", () => {
  let speeds = [10.0, 10.0, 10.0];
  expect(calculateAverageSpeed(speeds)).toBe(10.0);
});

it("calculates average speed for different speeds", () => {
  let speeds = [10.0, 20.0];
  expect(calculateAverageSpeed(speeds)).toBe(15.0);
});

it("returns 0 if there are no speeds", () => {
  let speeds: number[] = [];
  expect(calculateAverageSpeed(speeds)).toBe(0);
});
