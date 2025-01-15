import { Location, Stage } from "@/database/model/model";
import MapboxGL from "@rnmapbox/maps";
import { StageMapLine } from "@/components/Map/StageMapLine";
import { StyleSheet } from "react-native";
import customStyles from "@/constants/styles";

export default function StageMapView({
  stage,
  locations,
}: {
  stage: Stage;
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
      {/* Camera stays within bounds */}
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
      {/* line that shows the driven route of the stage */}
      <StageMapLine stage={stage} stageLocations={locations} key={stage.id} />
    </MapboxGL.MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
