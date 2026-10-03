/**
 * FLEET DATA — one file, 15 cars.
 *
 * Images: every car renders a generated studio illustration by default.
 * To use real photos, drop files in /public/cars/ and set `images`, e.g.
 *   images: ["/cars/mercedes-c-class-1.jpg", "/cars/mercedes-c-class-2.jpg"]
 * (or use a remote URL — allow its host in next.config.ts).
 */
export type Category = "Sedan" | "SUV" | "Executive";
export type Availability = "available" | "limited" | "reserved";
export type Feature =
  | "leather" | "panoramic" | "adaptiveCruise" | "carplay" | "ambient" | "parkAssist"
  | "heated" | "burmester" | "airSuspension" | "hud" | "camera360" | "keyless"
  | "massage" | "sevenSeats" | "awd" | "hybrid" | "rearEntertainment" | "bowers";

export interface Car {
  slug: string;
  brand: "Mercedes-Benz" | "BMW" | "Audi" | "Lexus" | "Volvo" | "Land Rover";
  model: string;
  year: number;
  category: Category;
  body: "sedan" | "suv";
  color: string; // paint colour for the generated illustration
  daily: number; // EGP
  weekly: number;
  monthly: number;
  seats: number;
  transmission: "Automatic";
  fuel: "Petrol" | "Diesel" | "Hybrid";
  engine: string;
  power: string;
  features: Feature[];
  status: Availability;
  images?: string[];
}

export const fleet: Car[] = [
  { slug: "mercedes-c-class", brand: "Mercedes-Benz", model: "C-Class", year: 2024, category: "Sedan", body: "sedan", color: "#3a3d44", daily: 4500, weekly: 27000, monthly: 99000, seats: 5, transmission: "Automatic", fuel: "Petrol", engine: "2.0L Turbo", power: "204 hp", features: ["leather", "ambient", "carplay", "parkAssist", "keyless"], status: "available" },
  { slug: "mercedes-e-class", brand: "Mercedes-Benz", model: "E-Class", year: 2024, category: "Executive", body: "sedan", color: "#d5d6d8", daily: 6500, weekly: 39000, monthly: 143000, seats: 5, transmission: "Automatic", fuel: "Petrol", engine: "2.0L Turbo", power: "258 hp", features: ["leather", "panoramic", "burmester", "adaptiveCruise", "ambient", "camera360"], status: "available" },
  { slug: "mercedes-s-class", brand: "Mercedes-Benz", model: "S-Class", year: 2024, category: "Executive", body: "sedan", color: "#16171a", daily: 14000, weekly: 84000, monthly: 308000, seats: 5, transmission: "Automatic", fuel: "Petrol", engine: "3.0L Turbo", power: "435 hp", features: ["massage", "airSuspension", "burmester", "rearEntertainment", "hud", "ambient"], status: "limited" },
  { slug: "mercedes-glc", brand: "Mercedes-Benz", model: "GLC", year: 2024, category: "SUV", body: "suv", color: "#4c5a63", daily: 6000, weekly: 36000, monthly: 132000, seats: 5, transmission: "Automatic", fuel: "Petrol", engine: "2.0L Turbo", power: "258 hp", features: ["panoramic", "leather", "camera360", "carplay", "awd", "ambient"], status: "available" },
  { slug: "mercedes-gle", brand: "Mercedes-Benz", model: "GLE", year: 2024, category: "SUV", body: "suv", color: "#1b1c1f", daily: 9500, weekly: 57000, monthly: 209000, seats: 5, transmission: "Automatic", fuel: "Petrol", engine: "3.0L Turbo", power: "367 hp", features: ["airSuspension", "panoramic", "burmester", "awd", "hud", "massage"], status: "available" },
  { slug: "bmw-3-series", brand: "BMW", model: "3 Series", year: 2024, category: "Sedan", body: "sedan", color: "#2b4a6f", daily: 4300, weekly: 25800, monthly: 94600, seats: 5, transmission: "Automatic", fuel: "Petrol", engine: "2.0L Turbo", power: "255 hp", features: ["leather", "carplay", "parkAssist", "keyless", "adaptiveCruise"], status: "available" },
  { slug: "bmw-5-series", brand: "BMW", model: "5 Series", year: 2024, category: "Executive", body: "sedan", color: "#2a2b2e", daily: 6200, weekly: 37200, monthly: 136400, seats: 5, transmission: "Automatic", fuel: "Petrol", engine: "2.0L Turbo", power: "245 hp", features: ["leather", "panoramic", "adaptiveCruise", "camera360", "ambient", "heated"], status: "available" },
  { slug: "bmw-x3", brand: "BMW", model: "X3", year: 2024, category: "SUV", body: "suv", color: "#7d8085", daily: 5800, weekly: 34800, monthly: 127600, seats: 5, transmission: "Automatic", fuel: "Petrol", engine: "2.0L Turbo", power: "248 hp", features: ["awd", "panoramic", "leather", "carplay", "parkAssist"], status: "reserved" },
  { slug: "bmw-x5", brand: "BMW", model: "X5", year: 2024, category: "SUV", body: "suv", color: "#101113", daily: 9000, weekly: 54000, monthly: 198000, seats: 7, transmission: "Automatic", fuel: "Petrol", engine: "3.0L Turbo", power: "375 hp", features: ["awd", "panoramic", "sevenSeats", "bowers", "hud", "camera360"], status: "available" },
  { slug: "audi-a6", brand: "Audi", model: "A6", year: 2024, category: "Executive", body: "sedan", color: "#5a5f66", daily: 6000, weekly: 36000, monthly: 132000, seats: 5, transmission: "Automatic", fuel: "Petrol", engine: "2.0L Turbo", power: "245 hp", features: ["leather", "adaptiveCruise", "bowers", "ambient", "camera360", "keyless"], status: "available" },
  { slug: "audi-q5", brand: "Audi", model: "Q5", year: 2024, category: "SUV", body: "suv", color: "#e1e2e4", daily: 5600, weekly: 33600, monthly: 123200, seats: 5, transmission: "Automatic", fuel: "Petrol", engine: "2.0L Turbo", power: "261 hp", features: ["awd", "panoramic", "carplay", "leather", "parkAssist"], status: "available" },
  { slug: "audi-q7", brand: "Audi", model: "Q7", year: 2024, category: "SUV", body: "suv", color: "#2d2f33", daily: 8000, weekly: 48000, monthly: 176000, seats: 7, transmission: "Automatic", fuel: "Petrol", engine: "3.0L Turbo", power: "335 hp", features: ["awd", "sevenSeats", "airSuspension", "bowers", "camera360", "panoramic"], status: "limited" },
  { slug: "lexus-es", brand: "Lexus", model: "ES 300h", year: 2024, category: "Executive", body: "sedan", color: "#8a7f72", daily: 5500, weekly: 33000, monthly: 121000, seats: 5, transmission: "Automatic", fuel: "Hybrid", engine: "2.5L Hybrid", power: "215 hp", features: ["hybrid", "leather", "heated", "adaptiveCruise", "ambient", "keyless"], status: "available" },
  { slug: "volvo-xc90", brand: "Volvo", model: "XC90", year: 2024, category: "SUV", body: "suv", color: "#c9cbcc", daily: 7500, weekly: 45000, monthly: 165000, seats: 7, transmission: "Automatic", fuel: "Hybrid", engine: "2.0L Plug-in Hybrid", power: "455 hp", features: ["hybrid", "sevenSeats", "awd", "bowers", "panoramic", "camera360"], status: "available" },
  { slug: "range-rover-evoque", brand: "Land Rover", model: "Range Rover Evoque", year: 2024, category: "SUV", body: "suv", color: "#e8e4dc", daily: 6800, weekly: 40800, monthly: 149600, seats: 5, transmission: "Automatic", fuel: "Petrol", engine: "2.0L Turbo", power: "247 hp", features: ["awd", "panoramic", "leather", "camera360", "carplay", "ambient"], status: "available" },
];

export const getCar = (slug: string) => fleet.find((c) => c.slug === slug);
export const carName = (c: Car) => `${c.brand} ${c.model}`;
export const brands = Array.from(new Set(fleet.map((c) => c.brand)));
export const categories: Category[] = ["Sedan", "SUV", "Executive"];
export const priceBounds = {
  min: Math.min(...fleet.map((c) => c.daily)),
  max: Math.max(...fleet.map((c) => c.daily)),
};
