import { Stage } from "@/database/model/model";
import {
  getDurationFormatted,
  getDurationInMs,
  getDurationMsFormatted,
} from "@/utils/dateUtil";

/** Distance */
/** Returns the stage distance as a string in km */
export function getStageDistanceString(
  stage: Stage,
  precision?: number,
): string {
  return stage.distance.toFixed(precision ?? 1) + " km";
}

/** Returns the total distance of a tour in km */
export function getTourDistance(stages: Stage[]): number {
  return stages.reduce((acc, stage) => acc + stage.distance, 0);
}

/** Duration */
/** Returns the total duration of a tour in milliseconds.*/
export function getTourDuration(stages: Stage[]): number {
  return stages.reduce((acc, stage) => acc + getStageDuration(stage), 0);
}
/** Returns the total duration of a tour as a string.*/
export function getTourDurationString(stages: Stage[]): string {
  const tourDuration = getTourDuration(stages);

  return getDurationMsFormatted(tourDuration);
}

/** Returns the duration of a stage in milliseconds */
export function getStageDuration(stage: Stage): number {
  const start = new Date(stage.startedAt);
  const end = new Date(stage.finishedAt ?? Date.now());

  return getDurationInMs(start, end);
}

/** Returns the duration of a stage as a string */
export function getStageDurationString(stage: Stage): string {
  const start = new Date(stage.startedAt);
  const end = new Date(stage.finishedAt ?? Date.now());

  return getDurationFormatted(start, end);
}

/** Average Speed */
/** Returns the average speed of a tour in km/h */
export function getTourAverageSpeed(stages: Stage[]): number {
  const tourDuration = getTourDuration(stages);
  if (tourDuration === 0) return 0;
  const hours = tourDuration / (1000 * 60 * 60);
  return getTourDistance(stages) / hours;
}

/** Returns the average speed of a tour in km/h as a string */
export function getTourAverageSpeedString(
  stages: Stage[],
  precision?: number,
): string {
  return getTourAverageSpeed(stages).toFixed(precision ?? 1) + " km/h";
}

/** Returns the average speed of a stage in km/h */
export function getStageAvgSpeedInKmh(stage: Stage): number {
  const hours = getStageDuration(stage) / (1000 * 60 * 60);

  return stage.distance / hours;
}

/** Returns the average speed of a stage as a string in km/h */
export function getStageAvgSpeedString(
  stage: Stage,
  precision?: number,
): string {
  return getStageAvgSpeedInKmh(stage).toFixed(precision ?? 1) + " km/h";
}
