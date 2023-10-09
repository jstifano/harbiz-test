import { readCalendarFile } from "./utils/fileUtilities"
import { Calendar } from './classes/Calendar'
import { getUTCDateInSpecificFormat, getDateISO } from "./utils/dateUtilities"
import { DATE_FORMAT } from "./constants"
import { getOneMiniSlot} from "./utils/calendarUtilities"
import { ResultSlot } from "./interfaces/ResultSlot"
import { GenericFunction } from "./interfaces/GenericFunction"

export const getAvailableSpots: GenericFunction<number, string, number, ResultSlot[]> = (calendar, date, duration) => {
	
	// Uso de programación defensiva a través de try/catch
	try {

		// Si alguno de los parámetros no existe, retornamos un arreglo vacío para no romper la ejecución
		if (!calendar || !date || !duration) {
			return []
		}

		const dateISO = getDateISO(date)
		const calendarFile = readCalendarFile(calendar)
		const calendarObj = new	Calendar(
			calendarFile.durationAfter,
			calendarFile.durationBefore,
			calendarFile.slots,
			calendarFile.sessions
		)

		let arrSlot: ResultSlot[] = [];

		calendarObj.calculateRealSpots(date, dateISO).forEach(slot => {
			let resultSlot: (ResultSlot | null) = null, 
			start = slot.start

			do {
				resultSlot = getOneMiniSlot(
					start, 
					slot.end,
					calendarObj.getDurationBefore,
					duration,
					calendarObj.getDurationAfter,
					dateISO
				)
				if (resultSlot) {
					arrSlot.push(resultSlot);
					start = getUTCDateInSpecificFormat(resultSlot.endHour, DATE_FORMAT.hoursAndMinutes)
				}
			} while (resultSlot);
			return arrSlot
		});
		return arrSlot
	} catch(e: any) {
		return []
	}
}
