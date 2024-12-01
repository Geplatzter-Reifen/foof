import { Location } from "@/model/model";
import MapboxGL from "@rnmapbox/maps";
import { lineString } from "@turf/helpers";

const StageMapLine = ({
  locations,
  stageID,
}: {
  locations: Location[];
  stageId: number;
}) => {
  console.log("locations:", locations); // Debugging
  const coords = locations.map((location) => [
    location.longitude,
    location.latitude,
  ]);

  const stage = lineString(coords, { name: "Stage" });
  return (
    <MapboxGL.ShapeSource id="lineSource" shape={stage}>
      <MapboxGL.LineLayer
        id={stageID}
        style={{
          lineColor: "#ff0000", // Red color for the line
          lineWidth: 4, // Thickness
          lineOpacity: 0.8, // Transparency
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

export default StageMapLine;
