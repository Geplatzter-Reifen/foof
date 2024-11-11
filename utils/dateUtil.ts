import { format } from "date-fns";

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

export function getDuration(
  start: Date,
  end: Date,
  formatString: string,
): string {
  const startMs = start.getTime();
  const endMs = end.getTime();

  const durationMs = endMs - startMs;

  return dateFormat(durationMs, formatString);
}
