import { Location } from "@/database/model/model";
import { getCoordinateString } from "@/utils/locationUtils";
import type { FeatureCollection } from "geojson";

/** Fetches the Name of a Location from the Mapbox Reverse Geocoding API
 * @param {Location} location - The geographic coordinates (latitude and longitude) of the location.
 * @returns {Promise<string>} The name of the location as a string. Coordinate String if there was no address provided
 * @throws {Error} If some other error occurs.
 */
export const fetchPlaceName = async (location: Location): Promise<string> => {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_API_KEY ?? null;
  const lon: number = location.longitude;
  const lat: number = location.latitude;
  const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lon}&latitude=${lat}&language=de&access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Failed to fetch location data:", response.statusText);
      return getCoordinateString(location);
    }
    const data: FeatureCollection = await response.json();
    return (
      data.features[0]?.properties?.full_address ??
      getCoordinateString(location)
    );
  } catch (error) {
    console.error("Fehler beim Reverse Geocoding:", error);
    return getCoordinateString(location);
  }
};
