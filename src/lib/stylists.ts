import type { StylistProfile } from "./types";

export const stylists: StylistProfile[] = [
  {
    id: "stylist-camille",
    name: "Camille Auclair",
    title: "Senior Editor & Stylist",
    bio: "Specialises in soft tailoring and capsule wardrobes for city life.",
    specialties: ["virtual", "wardrobe", "occasion"],
    languages: ["English", "French"],
    avatar: "cat-women",
    rating: 4.9,
    availableSlots: ["Wed 29 Jul · 10:00", "Wed 29 Jul · 14:30", "Thu 30 Jul · 11:00", "Fri 31 Jul · 16:00"],
  },
  {
    id: "stylist-marco",
    name: "Marco Bianchi",
    title: "Menswear & Travel Stylist",
    bio: "Riviera packing lists, elevated workwear, and gift consultations.",
    specialties: ["virtual", "gift", "in-store"],
    languages: ["English", "Italian"],
    avatar: "cat-men",
    rating: 4.8,
    availableSlots: ["Thu 30 Jul · 09:30", "Thu 30 Jul · 15:00", "Sat 1 Aug · 12:00"],
  },
  {
    id: "stylist-ada",
    name: "Ada Nwosu",
    title: "Occasion & Heritage Stylist",
    bio: "Wedding guest dressing, cultural craft, and statement accessories.",
    specialties: ["occasion", "wardrobe", "in-store"],
    languages: ["English"],
    avatar: "journal-okoro",
    rating: 5.0,
    availableSlots: ["Fri 31 Jul · 11:30", "Fri 31 Jul · 17:00", "Mon 3 Aug · 10:00", "Tue 4 Aug · 13:00"],
  },
  {
    id: "stylist-sofie",
    name: "Sofie Lund",
    title: "Conscious Wardrobe Consultant",
    bio: "Sustainability-led edits, repairs strategy, and fewer-better planning.",
    specialties: ["wardrobe", "virtual", "gift"],
    languages: ["English", "Danish"],
    avatar: "journal-sustainability",
    rating: 4.9,
    availableSlots: ["Wed 29 Jul · 12:00", "Sat 1 Aug · 10:30", "Mon 3 Aug · 15:30"],
  },
];

export const appointmentTypes = [
  {
    id: "virtual" as const,
    label: "Virtual styling",
    copy: "Video consult with shared product boards",
    duration: "45 min",
  },
  {
    id: "in-store" as const,
    label: "In-store styling",
    copy: "Bond Street atelier · private fitting room",
    duration: "60 min",
  },
  {
    id: "occasion" as const,
    label: "Occasion styling",
    copy: "Wedding, gala, or travel event looks",
    duration: "60 min",
  },
  {
    id: "wardrobe" as const,
    label: "Wardrobe consultation",
    copy: "Audit what you own; plan what to add",
    duration: "75 min",
  },
  {
    id: "gift" as const,
    label: "Gift consultation",
    copy: "Curated gifts with budget and taste notes",
    duration: "30 min",
  },
];

export function getStylist(id: string) {
  return stylists.find((s) => s.id === id);
}
