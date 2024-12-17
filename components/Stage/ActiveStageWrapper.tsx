import { getAllLocationsByStageIdQuery } from "@/services/data/locationService";
import { withObservables } from "@nozbe/watermelondb/react";
import { Location } from "@/database/model/model";
import StageMapLine from "@/components/Tour/StageMapLine";

/**
 * ActiveStageWrapper Component
 *
 * This component renders a line on the map for an active stage, using its associated locations.
 * - If there are fewer than 2 locations, it renders nothing (`null`).
 * - Passes the locations and stage ID to the `StageMapLine` component to display a line with a starting point.
 *
 * @param {Object} props - Component properties.
 * @param {Location[]} props.locations - An array of location objects for the stage.
 * @returns {JSX.Element | null} A StageMapLine component or null if there are insufficient locations.
 */

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

/**
 * Enhanced Component with Observables
 *
 * This HOC (Higher-Order Component) wraps `ActiveStageWrapper` with reactive data fetching.
 * - `withObservables` observes changes in the database for the given `stageId`.
 * - It fetches all locations for the specified stage using `getAllLocationsByStageIdQuery`.
 *
 * @param {string} stageId - The ID of the stage to fetch locations for.
 * @returns {Object} Props passed to `ActiveStageWrapper`:
 *   - locations: An array of Location objects fetched reactively from the database.
 */
const enhance = withObservables(
  ["stageId"], // Props used by withObservables
  ({ stageId }: { stageId: string }) => ({
    locations: getAllLocationsByStageIdQuery(stageId),
  }),
);

export const StageLine = enhance(ActiveStageWrapper);
