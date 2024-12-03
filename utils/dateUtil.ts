import { differenceInMilliseconds, format } from "date-fns";

export enum DateFormat {
  DATE = "dd.MM.yyyy",
  TIME = "HH:mm",
  DATE_TIME = "dd.MM.yyyy HH:mm",
}

export function formatDate(
  date: Date | number,
  formatString: DateFormat,
): string {
  if (typeof date === "number") {
    return format(new Date(date), formatString);
  }

  return format(date, formatString);
}

export function getDurationInMs(start: Date, end: Date) {
  return differenceInMilliseconds(end, start);
}

export function getDurationFormatted(start: Date, end: Date): string {
  if (end < start) {
    throw new Error("End date is before start date");
  }

  const totalMinutes = Math.ceil(getDurationInMs(start, end) / 60000);

  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");

  return `${hours}:${minutes} h`;
}

export function getTotalMillisecondsString(totalMilliseconds: number): string {
  if (totalMilliseconds < 0) {
    throw new Error("Total milliseconds must be positive");
  }
  const totalMinutes = Math.ceil(totalMilliseconds / 60000);

  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");

  return `${hours}:${minutes} h`;
}
