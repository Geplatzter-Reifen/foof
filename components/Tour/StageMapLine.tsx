import { Location } from "@/model/model";
import MapboxGL from "@rnmapbox/maps";
import { lineString } from "@turf/helpers";
import { useTheme } from "@ui-kitten/components";

const StageMapLine = ({
  locations,
  stageID,
}: {
  locations: Location[];
  stageId: number;
}) => {
  const theme = useTheme();
  const locationsUnpacked = locations.map((loc) => ({
    latitude: loc.latitude,
    longitude: loc.longitude,
  }));
  const coords = locationsUnpacked.map((location) => [
    location.longitude,
    location.latitude,
  ]);

  console.log("coords in line-->" + coords);
  console.log("id for the line-->" + stageID);
  const stage = lineString(coords, { name: "Stage" });
  return (
    <MapboxGL.ShapeSource id={`lineSource-${stageID}`} shape={stage}>
      <MapboxGL.LineLayer
        id={`lineLayer-${stageID}`}
        style={{
          lineColor: theme["color-primary-500"],
          lineWidth: 7, // Thickness
          lineOpacity: 1, // Transparency
          lineCap: "round",
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

export default StageMapLine;
