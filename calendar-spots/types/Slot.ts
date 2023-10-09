import { SlotDate } from "./SlotDate"

// Generic Type (Dynamic Key) to manipulate all the slots
export type Slot = {
  [date: string]: SlotDate[] | [] // Make sure supports empty array
}