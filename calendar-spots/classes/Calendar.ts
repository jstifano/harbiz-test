import { DATE_FORMAT } from "../constants";
import { Slot } from "../types/Slot"
import { SlotDate } from "../types/SlotDate";
import { getDateISO, getUTCValueOf } from "../utils/dateUtilities"

export const Calendar = class Calendar {
  private durationAfter: number;
  private durationBefore: number;
  private slots: Slot[] = []
  private sessions: Slot[] = []

  constructor(durationAfter: number, durationBefore: number, slots: Slot[], sessions: Slot[]) {
    this.durationAfter = durationAfter
    this.durationBefore = durationBefore
    this.slots = slots
    this.sessions = sessions
  }

  /***************************************
   * SET/GET para atributo durationAfter *
   ***************************************/
  set setDurationAfter(durationAfter: number) {
    this.durationAfter = durationAfter
  }

  get getDurationAfter() {
    return this.durationAfter
  }

  /***************************************
   * SET/GET para atributo durationBefore*
   ***************************************/
  set setDurationBefore(durationBefore: number) {
    this.durationBefore = durationBefore
  }

  get getDurationBefore() {
    return this.durationBefore
  }

  get getSlots() {
    return this.slots
  }

  get getSessionSlots() {
    return this.sessions
  }

  public getSlotsByDate(date: string) {
    return this.slots[date]
  }
  
  public getSessionsByDate(date: string) {
    return this.sessions[date]
  }

  public calculateRealSpots(date: string) {

    let noConflicts = true, 
    realSpots: SlotDate[] = [], 
    daySlots: SlotDate[] = []
    
    for (const key in this.getSlots) {
      if (key === date) {
        daySlots = this.getSlotsByDate(date)
      }
    }

    daySlots.forEach((daySlot: SlotDate) => {
			if (this.getSessionSlots && this.getSessionsByDate(date)) {
        const dateISO = getDateISO(date)
        let start = getUTCValueOf(`${dateISO} ${daySlot.start}`, DATE_FORMAT.hoursAndMinutes)
        let end = getUTCValueOf(`${dateISO} ${daySlot.end}`, DATE_FORMAT.hoursAndMinutes)

				this.getSessionsByDate(date).forEach((sessionSlot: SlotDate) => {
					let sessionStart = getUTCValueOf(`${dateISO} ${sessionSlot.start}`, DATE_FORMAT.hoursAndMinutes)
					let sessionEnd = getUTCValueOf(`${dateISO} ${sessionSlot.end}`, DATE_FORMAT.hoursAndMinutes)

					if (sessionStart > start && sessionEnd < end) {
						realSpots.push({ start: daySlot.start, end: sessionSlot.start})
						realSpots.push({ start: sessionSlot.end, end: daySlot.end})
						noConflicts = false
					} else if (sessionStart === start && sessionEnd < end) {
						realSpots.push({ start: sessionSlot.end, end: daySlot.end})
						noConflicts = false
					} else if (sessionStart > start && sessionEnd === end) {
						realSpots.push({ start: daySlot.start, end: sessionSlot.start })
						noConflicts = false
					} else if (sessionStart === start && sessionEnd === end) {
						noConflicts = false
					}
				})

				if (noConflicts) {
          console.log("No Conflicts >>>")
					realSpots.push(daySlot)
				}
			} else {
				realSpots.push(daySlot)
			}
		})
    return realSpots
  }
}