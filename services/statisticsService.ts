import { Stage } from "@/model/model";
import { getDurationFormatted, getDurationInMs } from "@/utils/dateUtil";

// Distance //
export function getStageDistanceString(
  stage: Stage,
  precision?: number,
): string {
  return stage.distance.toFixed(precision ?? 1) + " km";
}

/** Returns the total duration of a tour in milliseconds.*/
export function getTourDuration(stages: Stage[]): number {
  return stages.reduce((acc, stage) => acc + getStageDuration(stage), 0);
}

/** Returns the total distance of a tour in km */
export function getTourDistance(stages: Stage[]): number {
  return stages.reduce((acc, stage) => acc + stage.distance, 0);
}

/** Returns the average speed of a tour in km/h */
export function getTourAverageSpeed(stages: Stage[]): number {
  const tourDuration = getTourDuration(stages);
  if (tourDuration === 0) return 0;
  const hours = tourDuration / (1000 * 60 * 60);
  return getTourDistance(stages) / hours;
}

/** Duration */
export function getStageDuration(stage: Stage): number {
  const start = new Date(stage.startedAt);
  const end = new Date(stage.finishedAt ?? Date.now());

  return getDurationInMs(start, end);
}
export function getStageDurationString(stage: Stage): string {
  const start = new Date(stage.startedAt);
  const end = new Date(stage.finishedAt ?? Date.now());

  return getDurationFormatted(start, end);
}

/** Average Speed */
export function getStageAvgSpeedInKmh(stage: Stage): number {
  const hours = getStageDuration(stage) / (1000 * 60 * 60);

  return stage.distance / hours;
}

export function getStageAvgSpeedString(
  stage: Stage,
  precision?: number,
): string {
  return getStageAvgSpeedInKmh(stage).toFixed(precision ?? 1) + " km/h";
}
