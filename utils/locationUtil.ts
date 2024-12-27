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
