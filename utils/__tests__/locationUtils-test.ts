import * as locationUtil from "../locationUtils";
import type { FeatureCollection, LineString, Point } from "geojson";
import { point, lineString, featureCollection } from "@turf/helpers";

import {
  getCorrectedLatitude,
  validateUndefinedCoordinates,
} from "../locationUtils";
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
        { name: "Route from Wiesbaden to Frankfurt" },
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

    it("should calculate the bounds of a GeoJSON feature collection with a zigzag line", () => {
      const zigzagLine = lineString(
        [
          [8.24, 50.0826],
          [8.5, 50.1],
          [8.3, 50.2],
          [8.7, 50.3],
          [8.4, 50.4],
        ],
        { name: "Zigzag Line" },
      );
      const geoJson: FeatureCollection = featureCollection<LineString>([
        zigzagLine,
      ]);
      const bounds = locationUtil.calculateBounds(geoJson);
      expect(bounds).toEqual({
        ne: [8.7, 50.4],
        sw: [8.24, 50.0826],
      });
    });

    it("should throw an error if no valid coordinates are found", () => {
      const invalidGeoJson: FeatureCollection = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [],
            },
          },
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [],
            },
          },
        ],
      };
      expect(() => locationUtil.calculateBounds(invalidGeoJson)).toThrow(
        "No valid coordinates found",
      );
    });
  });

  describe("getCorrectedLatitude", () => {
    it("should correct latitudes north of Flensburg", () => {
      expect(getCorrectedLatitude(60)).toEqual(54.789356);
    });
    it("should correct latitudes south of Oberstdorf", () => {
      expect(getCorrectedLatitude(40)).toEqual(47.408333325);
    });
    it("should not correct latitudes between Flensburg and Oberstdorf", () => {
      expect(getCorrectedLatitude(50.3)).toEqual(50.3);
    });
  });

  describe("validateUndefinedCoordinates", () => {
    it("should throw an error if all coordinates are undefined", () => {
      expect(() =>
        validateUndefinedCoordinates(
          undefined,
          undefined,
          undefined,
          undefined,
        ),
      ).toThrow("Bitte gib eine gültige Start- und Endposition an.");
    });

    it("should throw an error if start coordinates are undefined", () => {
      expect(() =>
        validateUndefinedCoordinates(undefined, 50.0, 8.0, 50.0),
      ).toThrow("Bitte gib eine gültige Startposition an.");
    });

    it("should throw an error if end coordinates are undefined", () => {
      expect(() =>
        validateUndefinedCoordinates(8.0, 50.0, undefined, undefined),
      ).toThrow("Bitte gib eine gültige Endposition an.");
    });

    it("should return the coordinates if all are defined", () => {
      const result = validateUndefinedCoordinates(8.0, 50.0, 9.0, 51.0);
      expect(result).toEqual({
        startLongitude: 8.0,
        startLatitude: 50.0,
        endLongitude: 9.0,
        endLatitude: 51.0,
      });
    });
  });
});
