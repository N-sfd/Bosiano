export type CareServiceId =
  | "tailoring"
  | "shoe-repair"
  | "bag-restoration"
  | "leather-care"
  | "garment-cleaning"
  | "authentication";

export interface CareService {
  id: CareServiceId;
  name: string;
  description: string;
  fromPrice: number;
  turnaround: string;
  pickup: boolean;
}

export const careServices: CareService[] = [
  {
    id: "tailoring",
    name: "Tailoring & alterations",
    description: "Hems, waist suppression, sleeve adjustments, and couture finishing.",
    fromPrice: 45,
    turnaround: "5–8 days",
    pickup: true,
  },
  {
    id: "shoe-repair",
    name: "Shoe repair",
    description: "Resole, heel tips, stretch, and colour refresh for luxury footwear.",
    fromPrice: 55,
    turnaround: "7–10 days",
    pickup: true,
  },
  {
    id: "bag-restoration",
    name: "Bag restoration",
    description: "Structural repair, edge paint, hardware polish, and lining refresh.",
    fromPrice: 120,
    turnaround: "10–14 days",
    pickup: true,
  },
  {
    id: "leather-care",
    name: "Leather care",
    description: "Clean, condition, and protect vegetable-tanned and nappa leather.",
    fromPrice: 35,
    turnaround: "3–5 days",
    pickup: true,
  },
  {
    id: "garment-cleaning",
    name: "Garment cleaning",
    description: "Specialist cleaning for silk, cashmere, wool, and delicate finishes.",
    fromPrice: 28,
    turnaround: "3–4 days",
    pickup: true,
  },
  {
    id: "authentication",
    name: "Product authentication",
    description: "Expert verification for designer pieces purchased elsewhere or gifted.",
    fromPrice: 75,
    turnaround: "2–3 days",
    pickup: false,
  },
];

export const carePickupSlots = [
  "Tomorrow 09:00–12:00",
  "Tomorrow 13:00–17:00",
  "Thu 30 Jul 09:00–12:00",
  "Fri 31 Jul 13:00–17:00",
  "Drop off at Bond Street",
];
