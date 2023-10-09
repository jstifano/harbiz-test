import fs from 'fs'

export const readCalendarFile = (calendar: number) => {
  const rawdata: Buffer = fs.readFileSync(`./calendars/calendar.${calendar.toString()}.json`);
  return JSON.parse(rawdata.toString());
}