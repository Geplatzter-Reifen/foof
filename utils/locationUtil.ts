import { Location } from "@/model/model";

function calculateDistance(location1: Location, location2: Location): number {
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
