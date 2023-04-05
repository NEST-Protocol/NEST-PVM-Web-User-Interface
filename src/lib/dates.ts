import { addMinutes, format as formatDateFn } from "date-fns";

export function formatTVDate(date: Date) {
  // https://github.com/date-fns/date-fns/issues/1401#issuecomment-578580199
  return formatDateFn(addMinutes(date, date.getTimezoneOffset()), "dd MMM yyyy");
}

export function formatTVTime(date: Date) {
  return formatDateFn(addMinutes(date, date.getTimezoneOffset()), "H:mm");
}
