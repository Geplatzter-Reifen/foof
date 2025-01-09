import { Stage, Tour } from "@/database/model/model";
import {
  getDurationFormatted,
  getDurationInMs,
  getDurationMsFormatted,
} from "@/utils/dateUtils";
import { getAllLocationsByStageId } from "@/services/data/locationService";
import { flensburg, oberstdorf } from "@/services/StageConnection/data";
import { getCorrectedLatitude } from "@/utils/locationUtils";
import {
  removeFinishedAtFromTour,
  updateFinishedAtFromTour,
} from "@/services/data/tourService";

/* DISTANCE */
/** Returns the total TOUR distance in km */
export function getTourDistance(stages: Stage[]): number {
  return stages.reduce((acc, stage) => acc + stage.distance, 0);
}

/** Returns the total TOUR distance in km as a STRING*/
export function getTourDistanceString(stages: Stage[], precision?: number) {
  return getTourDistance(stages).toFixed(precision ?? 1) + " km";
}

/** Returns the STAGE distance in km as a STRING */
export function getStageDistanceString(
  stage: Stage,
  precision?: number,
): string {
  return stage.distance.toFixed(precision ?? 1) + " km";
}

/* DURATION */
/** Returns the total TOUR duration in milliseconds.*/
export function getTourDuration(stages: Stage[]): number {
  return stages.reduce((acc, stage) => acc + getStageDuration(stage), 0);
}
/** Returns the total TOUR duration in milliseconds as a STRING.*/
export function getTourDurationString(stages: Stage[]): string {
  const tourDuration = getTourDuration(stages);

  return getDurationMsFormatted(tourDuration);
}

/** Returns the STAGE duration in milliseconds */
export function getStageDuration(stage: Stage): number {
  const start = new Date(stage.startedAt);
  const end = new Date(stage.finishedAt ?? Date.now());

  return getDurationInMs(start, end);
}

/** Returns the STAGE duration in milliseconds as a string */
export function getStageDurationString(stage: Stage): string {
  const start = new Date(stage.startedAt);
  const end = new Date(stage.finishedAt ?? Date.now());

  return getDurationFormatted(start, end);
}

/* AVERAGE SPEED */
/** Returns the average TOUR speed in km/h */
export function getTourAverageSpeed(stages: Stage[]): number {
  const tourDuration = getTourDuration(stages);
  if (tourDuration === 0) return 0;
  const hours = tourDuration / (1000 * 60 * 60);
  return getTourDistance(stages) / hours;
}

/** Returns the average TOUR speed in km/h as a STRING */
export function getTourAverageSpeedString(
  stages: Stage[],
  precision?: number,
): string {
  return getTourAverageSpeed(stages).toFixed(precision ?? 1) + " km/h";
}

/** Returns the average STAGE speed in km/h */
export function getStageAvgSpeedInKmh(stage: Stage): number {
  const hours = getStageDuration(stage) / (1000 * 60 * 60);

  return stage.distance / hours;
}

/** Returns the average STAGE speed in km/h as a STRING */
export function getStageAvgSpeedString(
  stage: Stage,
  precision?: number,
): string {
  return getStageAvgSpeedInKmh(stage).toFixed(precision ?? 1) + " km/h";
}

/* TOUR PROGRESS */

/** Calculates the Progress of a Tour by Projecting Stages onto the Latitude-Line between Flensburg and Oberstdorf */
export async function getTourProgress(stages: Stage[]): Promise<number> {
  if (!stages.length) return 0;

  // Array for saving Latitude of each Stage's start and end point
  const intervals: [number, number][] = [];

  for (const stage of stages) {
    // get the stage's locations
    const locations = await getAllLocationsByStageId(stage.id);

    if (locations.length < 2) continue;

    // correct the latitudes to be between F and O
    const startLat = getCorrectedLatitude(locations[0].latitude);
    const endLat = getCorrectedLatitude(
      locations[locations.length - 1].latitude,
    );

    // start should be the southern latitude
    const start = Math.min(startLat, endLat);
    const end = Math.max(startLat, endLat);

    // add the stage's start and end points to the array
    if (start !== end) {
      intervals.push([start, end]);
    }
  }

  // if intervals join/overlap, merge them into one
  const mergedIntervals = mergeIntervals(intervals);

  // calculate the intervals' total length
  let totalLat = 0;
  mergedIntervals.forEach((interval) => {
    totalLat += interval[1] - interval[0];
  });

  const result = Math.min(
    1,
    totalLat / (flensburg.latitude - oberstdorf.latitude - 0.02),
  );

  const tour: Tour = await stages[0].tour.fetch();
  if (result >= 1 && !tour.finishedAt) {
    await updateFinishedAtFromTour(tour, Date.now());
  }
  if (result < 1 && tour.finishedAt) {
    await removeFinishedAtFromTour(tour);
  }

  return result;
}

/** Merges overlapping Stage Intervals.
 *  Each interval has to start with the smaller (southern) latitude */
function mergeIntervals(intervals: [number, number][]): [number, number][] {
  if (!intervals.length) return [];

  // sort intervals based on ascending end point latitude (south to north)
  intervals.sort((a, b) => a[0] - b[0]);

  const merged: [number, number][] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const [currentStart, currentEnd] = intervals[i];
    const [lastStart, lastEnd] = merged[merged.length - 1];

    // if start of current stage and end of last stage are close to each other, merge the stages
    if (currentStart <= lastEnd + 0.01) {
      merged[merged.length - 1] = [lastStart, Math.max(lastEnd, currentEnd)];
    } else {
      merged.push([currentStart, currentEnd]);
    }
  }

  return merged;
}
export { mergeIntervals as mergeIntervalsForTesting };
