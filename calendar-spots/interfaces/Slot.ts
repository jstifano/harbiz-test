import { SlotDate } from "./SlotDate"

// Interfaz dinámica para controlar la fecha dinámica de cada slot del calendario
export interface Slot {
  [date: string]: SlotDate[] | [] // Nos aseguramos que soportamos un arreglo vacío
}