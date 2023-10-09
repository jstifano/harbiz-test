// Interfaz genérica para hacer extensible la función getAvailableSpots
export interface GenericFunction<A, B, C, D> {
  (calendar: A, date: B, duration: C): D;
}