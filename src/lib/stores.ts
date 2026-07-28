export interface Boutique {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  hours: string;
  phone: string;
  lat: number;
  lng: number;
  services: string[];
  hero: string;
  events: { id: string; title: string; when: string; description: string }[];
  floors: { name: string; note: string }[];
}

export const boutiques: Boutique[] = [
  {
    id: "nyc",
    slug: "madison",
    name: "Bosiano Madison",
    city: "New York",
    address: "680 Madison Avenue, New York, NY 10065",
    hours: "Mon–Sat 10–8 · Sun 12–6",
    phone: "+1 212 555 0188",
    lat: 40.7648,
    lng: -73.9722,
    services: ["Fitting rooms", "Alterations", "Personal shopping", "Same-day delivery"],
    hero: "about-hero",
    events: [
      {
        id: "ev-nyc-1",
        title: "Soft Tailoring trunk show",
        when: "Fri 31 Jul · 18:00",
        description: "Maison Vérane stylists in-store with complimentary alterations booking.",
      },
      {
        id: "ev-nyc-2",
        title: "Private Client aperitivo",
        when: "Thu 6 Aug · 19:00",
        description: "Invitation-only tasting of autumn arrivals.",
      },
    ],
    floors: [
      { name: "Ground", note: "New arrivals · Bags · Concierge desk" },
      { name: "Level 1", note: "Womenswear · Fitting suites" },
      { name: "Level 2", note: "Menswear · Alterations atelier" },
    ],
  },
  {
    id: "ldn",
    slug: "mayfair",
    name: "Bosiano Mayfair",
    city: "London",
    address: "14 Mount Street, London W1K 2RF",
    hours: "Mon–Sat 10–7 · Sun 12–5",
    phone: "+44 20 7946 0100",
    lat: 51.5095,
    lng: -0.1478,
    services: ["Fitting rooms", "Click & collect", "Care services", "Styling appointments"],
    hero: "rewards-hero",
    events: [
      {
        id: "ev-ldn-1",
        title: "Italian craftsmanship evening",
        when: "Sat 1 Aug · 17:00",
        description: "SÀNSO leather atelier stories with live care demos.",
      },
    ],
    floors: [
      { name: "Ground", note: "Designers · Jewellery · Client lounge" },
      { name: "Lower", note: "Shoes · Care & restoration" },
    ],
  },
  {
    id: "par",
    slug: "saint-honore",
    name: "Bosiano Saint-Honoré",
    city: "Paris",
    address: "250 Rue Saint-Honoré, 75001 Paris",
    hours: "Mon–Sat 10:30–7:30",
    phone: "+33 1 42 00 00 18",
    lat: 48.8646,
    lng: 2.3312,
    services: ["Fitting rooms", "Reserve in store", "Associate chat", "Digital receipts"],
    hero: "verane-hero",
    events: [
      {
        id: "ev-par-1",
        title: "Runway to reality styling hour",
        when: "Wed 29 Jul · 16:00",
        description: "Editors translate autumn runway into wearable edits.",
      },
    ],
    floors: [
      { name: "Rez-de-chaussée", note: "Women · Editorial looks" },
      { name: "Entresol", note: "Men · Private Client salon" },
    ],
  },
  {
    id: "mil",
    slug: "brera",
    name: "Bosiano Brera",
    city: "Milan",
    address: "Via Madonnina 12, 20121 Milano",
    hours: "Mon–Sat 10–7",
    phone: "+39 02 1234 5678",
    lat: 45.4719,
    lng: 9.1872,
    services: ["Fitting rooms", "Authentication", "Leather care", "Event calendar"],
    hero: "sanso-hero",
    events: [
      {
        id: "ev-mil-1",
        title: "Bag restoration clinic",
        when: "Tue 4 Aug · 11:00",
        description: "Book a free leather health check with our care atelier.",
      },
    ],
    floors: [
      { name: "Piano terra", note: "Essentials · Bags" },
      { name: "Primo", note: "Tailoring · Fitting" },
    ],
  },
];

export function getBoutique(idOrSlug: string) {
  return boutiques.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
}

export function fittingSlots(storeId: string) {
  const base = ["Today 14:00", "Today 16:30", "Tomorrow 11:00", "Tomorrow 15:00", "Fri 11:30"];
  return base.map((s, i) => `${s} · ${storeId.toUpperCase()}-${i + 1}`);
}
