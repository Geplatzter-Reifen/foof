import { Stage, Tour } from "@/database/model/model";
import {
  getDurationFormatted,
  getDurationInMs,
  getDurationMsFormatted,
} from "@/utils/dateUtils";
import { getAllLocationsByStageId } from "@/services/data/locationService";

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
const fLat = 54.7937;
const oLat = 47.4099;

type Interval = { startLat: number; endLat: number };

/** Returns latitude between Flensburg and Oberstdorf */
function getCorrectedLatitude(coordLat: number): number {
  if (coordLat >= fLat) return fLat;
  if (coordLat <= oLat) return oLat;

  return coordLat;
}

/** Merges overlapping Stage Intervals */
function mergeIntervals(intervals: Interval[]): Interval[] {
  if (!intervals.length) return [];

  // Sortiere Intervalle basierend auf dem kleineren Breitengrad (nördlichster zuerst)
  intervals.sort((a, b) => a.startLat - b.startLat);

  const merged: Interval[] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const currentStart = intervals[i].startLat;
    const currentEnd = intervals[i].endLat;
    const lastStart = merged[merged.length - 1].startLat;
    const lastEnd = merged[merged.length - 1].endLat;

    // Falls der Startpunkt der aktuellen Etappe nördlicher ist als der Endpunkt der letzten gemergten Etappe
    if (currentStart <= lastEnd) {
      // zusammenführen
      merged[merged.length - 1] = {
        startLat: lastStart,
        endLat: Math.max(lastEnd, currentEnd),
      };
    } else {
      merged.push({ startLat: currentStart, endLat: currentEnd });
    }
  }

  return merged;
}

/** Calculates the Progress of a Tour by Projecting Stages onto the Latitude-Line between Flensburg and Oberstdorf */
export async function getTourProgress(stages: Stage[]) {
  // speichert von jeder Etappe Start- und Ziel-Breitengrad, wobei Start immer über End liegt
  const intervals: Interval[] = [];

  for (const stage of stages) {
    if (!stage.isActive) {
      const locations = await getAllLocationsByStageId(stage.id);
      if (locations.length >= 2) {
        const startLat = getCorrectedLatitude(locations[0].latitude);
        const endLat = getCorrectedLatitude(
          locations[locations.length - 1].latitude,
        );

        const start = Math.min(startLat, endLat);
        const end = Math.max(startLat, endLat);

        if (start !== end) {
          intervals.push({ startLat: start, endLat: end });
        }
      }
    }
  }

  // Wenn sich Etappen überlappen, verschmelze sie zu einer
  const mergedIntervals = mergeIntervals(intervals);

  // Gesamtlänge der Intervalle berechnen
  let totalLat = 0;
  mergedIntervals.forEach((interval) => {
    totalLat += interval.endLat - interval.startLat;
  });

  return totalLat / (fLat - oLat);
}
