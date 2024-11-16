import { Trip } from "@/model/model";
import { getDurationFormatted, getDurationInMs, TIME } from "@/utils/dateUtil";

// Distance //
export function getTripDistanceString(trip: Trip, precision?: number): string {
  return trip.distance.toFixed(precision ?? 1) + " km";
}

// Duration //
export function getTripDuration(trip: Trip): number {
  const start = new Date(trip.startedAt);
  const end = new Date(trip.finishedAt ?? Date.now());

  return getDurationInMs(start, end);
}
export function getTripDurationString(trip: Trip): string {
  const start = new Date(trip.startedAt);
  const end = new Date(trip.finishedAt ?? Date.now());

  return getDurationFormatted(start, end, TIME);
}

// Average Speed //
export function getTripAvgSpeedInKmh(trip: Trip): number {
  const hours = getTripDuration(trip) / (1000 * 60 * 60);

  return trip.distance / hours;
}
export function getTripAvgSpeedString(trip: Trip, precision?: number): string {
  return getTripAvgSpeedInKmh(trip).toFixed(precision ?? 1) + " km/h";
}
