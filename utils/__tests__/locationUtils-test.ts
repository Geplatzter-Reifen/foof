import * as locationUtil from "../locationUtils";
import type { FeatureCollection, LineString, Point } from "geojson";
import { point, lineString, featureCollection } from "@turf/helpers";
describe("LocationUtil", () => {
  describe("calculateDistance", () => {
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

  describe("calculateBounds", () => {
    it("should calculate the bounds of a GeoJSON feature collection", () => {
      const point1 = point([8.24, 50.0826], { name: "Wiesbaden" });
      const point2 = point([8.682547, 50.111629], { name: "Frankfurt" });
      const line = lineString(
        [
          [8.24, 50.0826],
          [8.682547, 50.111629],
          [8.982547, 50.231629],
        ],
        { name: "Route von Wiesbaden nach Frankfurt" },
      );
      const geoJson: FeatureCollection = featureCollection<Point | LineString>([
        point1,
        point2,
        line,
      ]);
      const bounds = locationUtil.calculateBounds(geoJson);
      expect(bounds).toEqual({
        ne: [8.982547, 50.231629],
        sw: [8.24, 50.0826],
      });
    });
  });
});
