import moment from "moment"
import { DATE_FORMAT } from "../constants";

export const getDateISO = date => moment(date, DATE_FORMAT.shortDayFirst).format(DATE_FORMAT.longYearFirst)
export const getUTCValueOf = (date: string, type: string, isUtc: boolean = false) => {
  if (isUtc) {
    return moment.utc(date, type).valueOf()
  } 
  return moment(date).valueOf()
}
export const getUTCDate = (date: string) => moment.utc(date).toDate()
export const getUTCDateInSpecificFormat = (date: (string | Date), type: string) => moment.utc(date).format(type)

export const getMomentHour = (hour: string, date: string) => {
  return moment(date + ' ' + hour)
}

export const addMinutes = (hour: moment.Moment, minutes: number) => {
  return moment(hour).add(minutes, 'minutes').format(DATE_FORMAT.hoursAndMinutes);
}

export const removeMinutes = (hour: string, minutes: string) => {
  return moment(hour).subtract(minutes, 'minutes').format(DATE_FORMAT.hoursAndMinutes);
}