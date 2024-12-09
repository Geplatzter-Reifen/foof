import { getAllLocationsByStageIdQuery } from "@/services/data/locationService";
import { withObservables } from "@nozbe/watermelondb/react";
import { Location } from "@/model/model";
import StageMapLine from "@/components/Tour/StageMapLine";

const ActiveStageWrapper = ({ locations }: { locations: Location[] }) => {
  if (locations.length <= 1) {
    return null;
  }

  return (
    <StageMapLine
      locations={locations}
      stageId={locations[0].id}
      active={true}
    />
  );
};

const enhance = withObservables(
  ["stageId"], // Props used by withObservables
  ({ stageId }: { stageId: string }) => ({
    locations: getAllLocationsByStageIdQuery(stageId),
  }),
);

export const StageLine = enhance(ActiveStageWrapper);
