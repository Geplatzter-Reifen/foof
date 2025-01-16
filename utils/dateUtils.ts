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
  const totalMinutes = Math.floor(ms / 60000);

  const days = Math.floor(totalMinutes / 1440); // 1 Tag = 1440 Minuten
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  let dayPart = "";
  let hoursPart = "";
  if (hours >= 1) {
    hoursPart = `${hours}h `;
  }
  if (days >= 1) {
    dayPart = `${days}d `;
    hoursPart = `${hours}h `;
  }
  return `${dayPart}${hoursPart}${minutes}m`;
}
