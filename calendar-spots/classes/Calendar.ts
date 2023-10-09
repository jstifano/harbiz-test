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

  public calculateRealSpots(date: string, dateISO: string) {
    try {
      let realSpots: SlotDate[] = [], 
      daySlots: SlotDate[] = this.getSlotsByDate(date)

      daySlots.forEach((daySlot: SlotDate) => {
        if (this.getSessionSlots && this.getSessionsByDate(date)) {

          let noConflicts = true
          this.getSessionsByDate(date).forEach((sessionSlot: SlotDate) => {
            let sessionStart = getUTCValueOf(`${dateISO} ${sessionSlot.start}`, DATE_FORMAT.hoursAndMinutes, false)
            let sessionEnd = getUTCValueOf(`${dateISO} ${sessionSlot.end}`, DATE_FORMAT.hoursAndMinutes, false)
            let start = getUTCValueOf(`${dateISO} ${daySlot.start}`, DATE_FORMAT.hoursAndMinutes, false)
            let end = getUTCValueOf(`${dateISO} ${daySlot.end}`, DATE_FORMAT.hoursAndMinutes, false)

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
            realSpots.push(daySlot)
          }
        } else {
          realSpots.push(daySlot)
        }
      })
      return realSpots
    } catch(e: any) {
      // In case any error, we just return empty to prevent any failure
      return []
    }
  }
}