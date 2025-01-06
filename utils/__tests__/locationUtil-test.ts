import * as locationUtil from "../locationUtils";
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
});
