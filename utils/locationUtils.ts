import type { FeatureCollection, Position } from "geojson";
import * as Location from "expo-location";
import { Alert } from "react-native";

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
    const [lon, lat] = coord;
    bounds = {
      ne: [Math.max(bounds.ne[0], lon), Math.max(bounds.ne[1], lat)],
      sw: [Math.min(bounds.sw[0], lon), Math.min(bounds.sw[1], lat)],
    };
  }
  return bounds;
}

//get current location
export async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    Alert.alert("Permission denied", "Allow the app to use location services", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
    return; // Exit the function if permission is not granted
  }

  try {
    const { coords } = await Location.getCurrentPositionAsync();
    if (coords) {
      return coords;
    }
  } catch (error) {
    console.log("Error getting location:", error);
  }
}
