import { Location } from "@/database/model/model";
import { getCoordinateString } from "@/utils/locationUtils";

export const fetchPlaceName = async (location: Location) => {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_API_KEY ?? null;
  const lon: number = location.longitude;
  const lat: number = location.latitude;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }
    const data = await response.json();
    return data.features[0]?.place_name || getCoordinateString(location);
  } catch (error) {
    console.error("Fehler beim Reverse Geocoding:", error);
    return "Fehler beim Abrufen des Ortsnamens";
  }
};
