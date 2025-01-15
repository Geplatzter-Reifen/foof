import { calculateDistance, MapPoint } from "@/utils/locationUtils";
import { Stage, Tour } from "@/database/model/model";
import { getActiveTour, getTourByTourId } from "@/services/data/tourService";
import { createStage, setStageAvgSpeed } from "@/services/data/stageService";
import { getStageAvgSpeedInKmh } from "@/services/statisticsService";

/**
 * Validates the input for manually creating a stage.
 *
 * @param {string} stageName - The name of the stage.
 * @param {Date} startTime - The start time of the stage.
 * @param {Date} endTime - The end time of the stage.
 * @param {MapPoint} startCoordinate - The starting coordinates.
 * @param {MapPoint} endCoordinate - The ending coordinates.
 * @throws {Error} - Throws an error if input is invalid.
 */
function validateManualStageInput(
  stageName: string,
  startTime: Date,
  endTime: Date,
  startCoordinate: MapPoint,
  endCoordinate: MapPoint,
): void {
  if (!stageName || stageName.trim() === "") {
    throw new Error("Bitte gib einen Tournamen an");
  }
  if (
    startCoordinate.longitude === endCoordinate.longitude &&
    startCoordinate.latitude === startCoordinate.latitude
  ) {
    throw new Error("Die Start- und Endposition dürfen nicht identisch sein.");
  }
  if (endTime < startTime) {
    throw new Error("Start und Endzeit sind ungültig");
  }
}

/**
 * Initializes a new stage with given data.
 *
 * @param {string} tourId - The ID of the tour.
 * @param {string} stageName - The name of the stage.
 * @param {Date} startTime - The start time of the stage.
 * @param {Date} endTime - The end time of the stage.
 * @param {MapPoint} startingCoordinates - The starting coordinates.
 * @param {MapPoint} endCoordinates - The ending coordinates.
 * @returns {Promise<Stage>} The created stage.
 */
async function initializeManualStage(
  tourId: string,
  stageName: string,
  startTime: Date,
  endTime: Date,
  startingCoordinates: MapPoint,
  endCoordinates: MapPoint,
): Promise<Stage> {
  const stage: Stage = await createStage(
    tourId,
    stageName,
    startTime.getTime(),
    endTime.getTime(),
    false,
    calculateDistance(startingCoordinates, endCoordinates),
  );
  await stage.addLocation(
    startingCoordinates.latitude,
    startingCoordinates.longitude,
  );
  await stage.addLocation(endCoordinates?.latitude, endCoordinates?.longitude);

  let speed = getStageAvgSpeedInKmh(stage);

  await setStageAvgSpeed(stage.id, speed);

  return stage;
}

/**
 * Creates a manual stage for a tour.
 *
 * @param {string} stageName - The name of the stage.
 * @param {MapPoint} startingCoordinates - The starting coordinates.
 * @param {MapPoint} endCoordinates - The ending coordinates.
 * @param {Date} startTime - The start time of the stage.
 * @param {Date} endTime - The end time of the stage.
 * @param {string} [tourId] - Optional ID of the tour. Defaults to the active tour.
 * @returns {Promise<Stage>} The created stage.
 * @throws {Error} Throws an error if no active tour is set or input is invalid.
 */
export async function createManualStage(
  stageName: string,
  startingCoordinates: MapPoint,
  endCoordinates: MapPoint,
  startTime: Date,
  endTime: Date,
  tourId?: string,
): Promise<Stage> {
  const tour: Tour | null = tourId
    ? await getTourByTourId(tourId)
    : await getActiveTour();
  if (!tour) {
    throw new Error("Keine Aktive Tour gesetzt");
  }

  validateManualStageInput(
    stageName,
    startTime,
    endTime,
    startingCoordinates,
    endCoordinates,
  );

  return initializeManualStage(
    tour.id,
    stageName,
    startTime,
    endTime,
    startingCoordinates,
    endCoordinates,
  );
}

export const validateManualStageInputForTesting = validateManualStageInput;
