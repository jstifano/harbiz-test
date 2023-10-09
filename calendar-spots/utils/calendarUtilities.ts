import { 
  getUTCValueOf, 
  getMomentHour, 
  addMinutes, 
  getDateISO,
  getUTCDate
} from "./dateUtilities";
import { DATE_FORMAT } from "../constants";

export const getOneMiniSlot = (
  startSlot: string, 
  endSlot: string,
  durationBefore: number,
  duration: number,
  durationAfter: number,
  isoDate: string
) => {
  
  let startHourFirst = getMomentHour(startSlot, isoDate),
  startHour = startHourFirst.format(DATE_FORMAT.hoursAndMinutes),
  endHour = addMinutes(startHourFirst, (durationBefore + duration + durationAfter)),
  clientStartHour = addMinutes(startHourFirst, durationBefore),
  clientEndHour = addMinutes(startHourFirst, duration)

  if (getUTCValueOf(endHour, DATE_FORMAT.hoursAndMinutes, true) > getUTCValueOf(endSlot, DATE_FORMAT.hoursAndMinutes, true)) {
    return null;
  }

  const objSlot = {
    startHour: getUTCDate(`${isoDate} ${startHour}`),
    endHour: getUTCDate(`${isoDate} ${endHour}`),
    clientStartHour: getUTCDate(`${isoDate} ${clientStartHour}`),
    clientEndHour: getUTCDate(`${isoDate} ${clientEndHour}`)
  }
  
  return objSlot;
}