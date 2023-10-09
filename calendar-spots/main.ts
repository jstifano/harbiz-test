import { readCalendarFile } from "./utils/fileUtilities"
import { Calendar } from './classes/Calendar'
import { getUTCDateInSpecificFormat } from "./utils/dateUtilities"
import { DATE_FORMAT } from "./constants"
import { getOneMiniSlot} from "./utils/calendarUtilities"
import { ResultSlot } from "./types/ResultSlot"

export const getAvailableSpots = (calendar: number, date: string, duration: number) => {
	try {

		// If some of the required args don't exist, we return an empty array
		if (!calendar || !date || !duration) {
			return []
		}

		const calendarFile = readCalendarFile(calendar)
		const calendarObj = new	Calendar(
			calendarFile.durationAfter,
			calendarFile.durationBefore,
			calendarFile.slots,
			calendarFile.sessions
		)

		let arrSlot: ResultSlot[] = [];

		calendarObj.calculateRealSpots(date).forEach(slot => {
			let resultSlot: (ResultSlot | null) = null, 
			start = slot.start

			do {
				resultSlot = getOneMiniSlot(
					start, 
					slot.end, 
					date, 
					calendarObj.getDurationBefore,
					duration,
					calendarObj.getDurationAfter
				)
				if (resultSlot) {
					arrSlot.push(resultSlot);
					start = getUTCDateInSpecificFormat(resultSlot.endHour, DATE_FORMAT.hoursAndMinutes)
				}
			} while (resultSlot);
			return arrSlot;
		});
	} catch(e: any) {
		console.log("Error >>>", e)
	}
}
