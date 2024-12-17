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

  return getDurationMsFormatted(getDurationInMs(start, end));
}

export function getDurationMsFormatted(ms: number) {
  const totalMinutes = Math.ceil(ms / 60000);

  const hours = String(Math.floor(totalMinutes / 60));
  const minutes = String(totalMinutes % 60);

  return `${hours}h ${minutes}m`;
}
