import { Location } from "@/database/model/model";
import MapboxGL from "@rnmapbox/maps";
import StageMapLine from "@/components/Tour/StageMapLine";
import { StyleSheet } from "react-native";
import customStyles from "@/constants/styles";

export default function StageMapView({
  stageId,
  locations,
}: {
  stageId: string;
  locations: Location[];
}) {
  // Find the outermost coordinates & set as bounds
  let minLat = Infinity,
    maxLat = -Infinity,
    minLng = Infinity,
    maxLng = -Infinity;
  locations.forEach((loc) => {
    if (loc.latitude < minLat) minLat = loc.latitude;
    if (loc.latitude > maxLat) maxLat = loc.latitude;
    if (loc.longitude < minLng) minLng = loc.longitude;
    if (loc.longitude > maxLng) maxLng = loc.longitude;
  });
  const bounds = {
    ne: [maxLng, maxLat],
    sw: [minLng, minLat],
  };

  return (
    <MapboxGL.MapView
      scaleBarEnabled={false}
      style={{ ...styles.map, ...customStyles.basicCard }}
    >
      {/* Kamera hält sich an die Bounds */}
      <MapboxGL.Camera
        minZoomLevel={5}
        animationMode="none"
        bounds={bounds}
        padding={{
          paddingTop: 60,
          paddingBottom: 60,
          paddingLeft: 60,
          paddingRight: 60,
        }}
      />
      {/* Linie, die die gefahrene Strecke der Etappe anzeigt */}
      {locations.length > 1 && (
        <StageMapLine locations={locations} stageId={stageId} key={stageId} />
      )}
    </MapboxGL.MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
