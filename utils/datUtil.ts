import { format } from 'date-fns';

export const DATE: string = "dd.MM.yyyy"
export const TIME: string = "HH:mm"
export const TIME_UHR: string = "HH:mm Uhr"
export const DATE_TIME: string = "dd.MM.yyyy HH:mm"

export function dateFormat(date: Date, formatString: string): string {
  return format(date, formatString);
}