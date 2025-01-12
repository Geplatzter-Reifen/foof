import type { FeatureCollection, Position } from "geojson";
import { flensburg, oberstdorf } from "@/services/StageConnection/data";
import { Location } from "@/database/model/model";

export type MapPoint = {
  latitude: number;
  longitude: number;
};

export function isLocationValid(location: MapPoint): boolean {
  return (
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    location.longitude >= -180 &&
    location.longitude <= 180
  );
}

/** Calculates the distance between two point in km */
export function calculateDistance(
  location1: MapPoint,
  location2: MapPoint,
): number {
  if (!isLocationValid(location1) || !isLocationValid(location2)) {
    throw new Error("Invalid location");
  }
  const R = 6371; // Erdradius in Kilometern

  const lat1 = location1.latitude * (Math.PI / 180); // Umrechnung in Bogenmaß
  const lon1 = location1.longitude * (Math.PI / 180);
  const lat2 = location2.latitude * (Math.PI / 180);
  const lon2 = location2.longitude * (Math.PI / 180);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  // Haversine-Formel
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Entfernung in Kilometern
  return R * c;
}

/**
 * Calculate the bounds of a GeoJSON feature collection (only for Points and LineStrings)
 * @param geoJson The GeoJSON feature collection
 * @returns The bounds of the GeoJSON feature collection
 */
export function calculateBounds(geoJson: FeatureCollection): {
  ne: number[];
  sw: number[];
} {
  let bounds = {
    ne: [-Infinity, -Infinity],
    sw: [Infinity, Infinity],
  };

  for (const feature of geoJson.features) {
    if (feature.geometry.type === "Point") {
      const coords = feature.geometry.coordinates;
      bounds = updateBounds([coords], bounds);
    } else if (feature.geometry.type === "LineString") {
      const coords = feature.geometry.coordinates;
      bounds = updateBounds(coords, bounds);
    }
  }
  if (
    bounds.ne[0] === -Infinity ||
    bounds.ne[1] === -Infinity ||
    bounds.sw[0] === Infinity ||
    bounds.sw[1] === Infinity
  ) {
    throw new Error("No valid coordinates found");
  }
  return bounds;
}

/**
 * Calculate the bounds of a set of coordinates
 * @param coords New coordinates
 * @param bounds The current bounds
 * @returns The updated bounds
 */
function updateBounds(
  coords: Position[],
  bounds: { ne: number[]; sw: number[] },
): { ne: number[]; sw: number[] } {
  for (const coord of coords) {
    if (coord.length === 2) {
      const [lon, lat] = coord;
      bounds = {
        ne: [Math.max(bounds.ne[0], lon), Math.max(bounds.ne[1], lat)],
        sw: [Math.min(bounds.sw[0], lon), Math.min(bounds.sw[1], lat)],
      };
    }
  }
  return bounds;
}

/** Corrects a Latitude to be between Flensburg and Oberstdorf */
export function getCorrectedLatitude(coordLat: number): number {
  if (coordLat <= oberstdorf.latitude) return oberstdorf.latitude;
  if (coordLat >= flensburg.latitude) return flensburg.latitude;

  return coordLat;
}

/** Converts a Location's Coordinates into a formatted String */
export function getCoordinateString(loc: Location) {
  const toDMS = (coord: number, posChar: string, negChar: string) => {
    const absolute = Math.abs(coord);
    const degrees = Math.floor(absolute);
    const minutes = Math.floor((absolute - degrees) * 60);
    const seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(2);
    const direction = coord >= 0 ? posChar : negChar;
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  const lat = toDMS(loc.latitude, "N", "S");
  const lon = toDMS(loc.longitude, "E", "W");

  return `${lat}, ${lon}`;
}

type Locations = {
  startLongitude: number;
  startLatitude: number;
  endLongitude: number;
  endLatitude: number;
};

/**
 * Validates the coordinates and throws an error if they are undefined.
 * @throws Error if coordinates are undefined
 * @returns The coordinates if they are all defined
 */
export const validateUndefinedCoordinates = (
  startLongitude: number | undefined,
  startLatitude: number | undefined,
  endLongitude: number | undefined,
  endLatitude: number | undefined,
): Locations => {
  if (
    (startLongitude === undefined || startLatitude === undefined) &&
    (endLongitude === undefined || endLatitude === undefined)
  ) {
    throw new Error("Bitte gib eine gültige Start- und Endposition an.");
  } else if (startLongitude === undefined || startLatitude === undefined) {
    throw new Error("Bitte gib eine gültige Startposition an.");
  } else if (endLongitude === undefined || endLatitude === undefined) {
    throw new Error("Bitte gib eine gültige Endposition an.");
  }
  return {
    startLongitude,
    startLatitude,
    endLongitude,
    endLatitude,
  };
};
