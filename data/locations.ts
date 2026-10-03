export type LocationId = "cairo" | "newCairo" | "sheikhZayed" | "alexandria" | "hurghada" | "sharm";
export interface Location {
  id: LocationId;
  lat: number;
  lon: number;
  airport?: boolean;
}
export const locations: Location[] = [
  { id: "cairo", lat: 30.0444, lon: 31.2357 },
  { id: "newCairo", lat: 30.0074, lon: 31.4913 },
  { id: "sheikhZayed", lat: 30.0131, lon: 30.9736 },
  { id: "alexandria", lat: 31.2001, lon: 29.9187 },
  { id: "hurghada", lat: 27.2579, lon: 33.8116, airport: true },
  { id: "sharm", lat: 27.9158, lon: 34.33, airport: true },
];
export const pickupOptions = [
  ...locations.map((l) => l.id as string),
  "cairoAirport", "hurghadaAirport", "sharmAirport",
];
