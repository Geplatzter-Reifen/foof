import { getActiveTour } from "@/services/data/tourService";
import { getAllLocationsByStageIdQuery } from "@/services/data/locationService";
import { withObservables } from "@nozbe/watermelondb/react";
import { Location } from "@/model/model";
import StageMapLine from "@/components/Tour/StageMapLine";

const ActiveStageWrapper = ({ locations }: { locations: Location[] }) => {
  console.log("locations in stage wrapper -->" + locations);
  // const activeTourID = getActiveTour();
  // if (!activeTourID) {
  //   return;
  // }
  if (locations.length <= 1) {
    return null;
  }

  return (
    <StageMapLine locations={locations} stageId={Number(locations[0].id)} />
  );
};

const enhance = withObservables(
  ["stageId"], // Props used by withObservables
  ({ stageId }: { stageId: string }) => ({
    locations: getAllLocationsByStageIdQuery(stageId),
  }),
);

export const StageLine = enhance(ActiveStageWrapper);
