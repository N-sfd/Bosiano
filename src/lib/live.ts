import type { LiveEvent } from "./types";

export const liveEvents: LiveEvent[] = [
  {
    id: "live-1",
    slug: "verane-soft-tailoring",
    title: "Soft Tailoring Live with Maison Vérane",
    host: "Léa Vérane",
    hostRole: "Creative Director",
    status: "live",
    startsAt: "2026-07-28T16:00:00",
    durationMin: 45,
    viewers: 1284,
    hero: "verane-hero",
    description: "Watch Léa style the Sculpted Wool Blazer three ways — boardroom, weekend, evening — and shop live.",
    productIds: ["sculpted-wool-blazer", "pleated-wide-leg-trouser", "sculptural-heeled-mule"],
    designerId: "maison-verane",
  },
  {
    id: "live-2",
    slug: "riviera-golden-hour",
    title: "Riviera Golden Hour with Solène",
    host: "Clara Moreau",
    hostRole: "House Stylist",
    status: "upcoming",
    startsAt: "2026-07-30T18:30:00",
    durationMin: 40,
    hero: "solene-hero",
    description: "Pack a seven-piece Riviera edit live — linen, silk, and one perfect sneaker.",
    productIds: ["riviera-linen-shirt", "poplin-tiered-maxi-dress", "silk-twill-scarf", "minimalist-leather-sneaker"],
    designerId: "solene",
  },
  {
    id: "live-3",
    slug: "okoro-heritage-weaves",
    title: "Heritage Weaves: Okoro Atelier Tour",
    host: "Ifeoma Okoro",
    hostRole: "Founder",
    status: "replay",
    startsAt: "2026-07-20T15:00:00",
    durationMin: 52,
    viewers: 3420,
    hero: "okoro-hero",
    description: "A studio walkthrough of adire dyeing and aso-oke weaving — then shop the featured pieces.",
    productIds: ["adire-wrap-midi-skirt", "handwoven-aso-oke-clutch"],
    designerId: "okoro",
  },
  {
    id: "live-4",
    slug: "editors-evening-edit",
    title: "Editors’ Evening Edit",
    host: "Camille Auclair",
    hostRole: "Bosiano Editor",
    status: "replay",
    startsAt: "2026-07-12T19:00:00",
    durationMin: 35,
    viewers: 2105,
    hero: "look-romantic-evening",
    description: "Slip dresses, sculptural mules, and quiet jewellery for late summer evenings.",
    productIds: ["fluid-silk-slip-dress", "sculptural-heeled-mule", "twisted-hoop-earrings", "crescent-shoulder-bag"],
  },
];

export function getLiveEvent(slug: string) {
  return liveEvents.find((e) => e.slug === slug || e.id === slug);
}

export function liveByStatus(status?: LiveEvent["status"]) {
  if (!status) return liveEvents;
  return liveEvents.filter((e) => e.status === status);
}
