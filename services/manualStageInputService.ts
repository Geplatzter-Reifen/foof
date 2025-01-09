import { calculateDistance, MapPoint } from "@/utils/locationUtils";
import { Stage, Tour } from "@/database/model/model";
import { getActiveTour, getTourByTourId } from "@/services/data/tourService";
import { createStage, setStageAvgSpeed } from "@/services/data/stageService";
import { getStageAvgSpeedInKmh } from "@/services/statisticsService";

// Validate input for manual stage creation
function validateManualStageInput(
  stageName: string,
  startTime: Date,
  endTime: Date,
  startingCoordinates: MapPoint | null,
  endCoordinates: MapPoint | null,
): void {
  if (!stageName || stageName.trim() === "") {
    throw new Error("Bitte gib einen Tournamen an");
  }
  if (startingCoordinates === null || endCoordinates === null) {
    throw new Error("Ungültiges Koordinatenformat");
  }
  if (endTime < startTime) {
    throw new Error("Start und Endzeit sind ungültig");
  }
}

// Create a new stage and save locations
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
