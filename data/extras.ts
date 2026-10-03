export type ExtraId = "chauffeur" | "airport" | "childSeat" | "driver" | "insurance";
export interface Extra {
  id: ExtraId;
  price: number; // EGP
  unit: "perDay" | "flat";
}
export const extras: Extra[] = [
  { id: "chauffeur", price: 1500, unit: "perDay" },
  { id: "airport", price: 600, unit: "flat" },
  { id: "childSeat", price: 150, unit: "perDay" },
  { id: "driver", price: 200, unit: "perDay" },
  { id: "insurance", price: 500, unit: "perDay" },
];
