import { differenceInMilliseconds, format } from "date-fns";

export const DATE: string = "dd.MM.yyyy";
export const TIME: string = "HH:mm";
export const TIME_UHR: string = "HH:mm Uhr";
export const DATE_TIME: string = "dd.MM.yyyy HH:mm";

export function dateFormat(date: Date | number, formatString: string): string {
  if (typeof date === "number") {
    return format(new Date(date), formatString);
  }

  return format(date, formatString);
}

export function getDurationInMs(start: Date, end: Date) {
  return differenceInMilliseconds(end, start);
}

export function getDurationFormatted(start: Date, end: Date): string {
  const totalMinutes = Math.ceil(getDurationInMs(start, end) / 60000);

  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");

  return `${hours}:${minutes} h`;
}
