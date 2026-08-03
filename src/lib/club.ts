export type ClubTierId = "member" | "gold" | "private-client";

export interface ClubTier {
  id: ClubTierId;
  name: string;
  minPoints: number;
  multiplier: number;
  accent: string;
  welcomeReward?: string;
  perks: string[];
}

export const CLUB_TIERS: ClubTier[] = [
  {
    id: "member",
    name: "Member",
    minPoints: 0,
    multiplier: 1,
    accent: "#c7c9cc",
    welcomeReward: "$25 off your first order",
    perks: [
      "Welcome reward",
      "1× points on purchases",
      "Birthday reward",
      "Early sale access",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    minPoints: 2000,
    multiplier: 1.5,
    accent: "#c2a367",
    perks: [
      "1.5× points multiplier",
      "Complimentary express shipping",
      "Priority support",
      "Exclusive products",
    ],
  },
  {
    id: "private-client",
    name: "Private Client",
    minPoints: 5000,
    multiplier: 2,
    accent: "#6b6156",
    perks: [
      "Personal stylist",
      "Early designer access",
      "Premium delivery",
      "Private events",
      "Invitation-only collections",
      "Concierge service",
    ],
  },
];

export function tierForPoints(points: number): ClubTier {
  return [...CLUB_TIERS].reverse().find((t) => points >= t.minPoints) ?? CLUB_TIERS[0];
}

export function nextTier(points: number): ClubTier | null {
  const current = tierForPoints(points);
  const idx = CLUB_TIERS.findIndex((t) => t.id === current.id);
  return CLUB_TIERS[idx + 1] ?? null;
}

export function tierProgress(points: number) {
  const current = tierForPoints(points);
  const upcoming = nextTier(points);
  if (!upcoming) return { current, upcoming: null, percent: 100, remaining: 0 };
  const span = upcoming.minPoints - current.minPoints;
  const gained = points - current.minPoints;
  return {
    current,
    upcoming,
    percent: Math.min(100, Math.round((gained / span) * 100)),
    remaining: Math.max(0, upcoming.minPoints - points),
  };
}

export function pointsEarned(subtotal: number, pointsBalance: number) {
  const tier = tierForPoints(pointsBalance);
  return Math.round(subtotal * tier.multiplier);
}

export interface ClubReward {
  id: string;
  title: string;
  copy: string;
  pointsCost?: number;
  tierMin: ClubTierId;
  expiresInDays?: number;
}

/** Catalog of redeemable / claimable rewards shown on the account Club dashboard. */
export const CLUB_REWARDS: ClubReward[] = [
  {
    id: "welcome-25",
    title: "Welcome reward",
    copy: "$25 off your next order over $150",
    tierMin: "member",
    expiresInDays: 90,
  },
  {
    id: "birthday",
    title: "Birthday reward",
    copy: "Double points week + $40 gift",
    tierMin: "member",
    expiresInDays: 30,
  },
  {
    id: "ship-free",
    title: "Complimentary shipping",
    copy: "Express shipping credit on your next order",
    pointsCost: 800,
    tierMin: "member",
  },
  {
    id: "early-sale",
    title: "Early sale access",
    copy: "Shop the sale 48 hours early",
    tierMin: "member",
  },
  {
    id: "exclusive-drop",
    title: "Exclusive product access",
    copy: "Unlock Gold-only capsules this month",
    tierMin: "gold",
  },
  {
    id: "stylist-hour",
    title: "Personal stylist hour",
    copy: "Book a Private Client styling session",
    pointsCost: 2500,
    tierMin: "private-client",
  },
  {
    id: "private-event",
    title: "Private event invite",
    copy: "Invitation-only designer salon",
    tierMin: "private-client",
  },
];

export function availableRewardsFor(points: number): ClubReward[] {
  const tier = tierForPoints(points);
  const order: ClubTierId[] = ["member", "gold", "private-client"];
  const unlocked = order.indexOf(tier.id);
  return CLUB_REWARDS.filter((r) => order.indexOf(r.tierMin) <= unlocked);
}

export const REFERRAL_REWARD = 50;
export const REFERRAL_FRIEND_REWARD = 25;

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  cadence: "month" | "year";
  description: string;
  perks: string[];
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "premium-delivery",
    name: "Unlimited premium delivery",
    price: 79,
    cadence: "year",
    description: "Unlimited express and next-day delivery on every order.",
    perks: ["Unlimited express shipping", "Priority packing", "Carbon-offset delivery"],
  },
  {
    id: "styling",
    name: "Styling membership",
    price: 49,
    cadence: "month",
    description: "Ongoing AI + human stylist edits tailored to your profile.",
    perks: ["Monthly styled looks", "Priority stylist chat", "Fit check reviews"],
  },
  {
    id: "seasonal-consult",
    name: "Seasonal wardrobe consultation",
    price: 180,
    cadence: "year",
    description: "Two private consultations per year with a Bosiano stylist.",
    perks: ["Spring + autumn sessions", "Wardrobe audit", "Purchase plan"],
  },
  {
    id: "early-access",
    name: "Exclusive early access",
    price: 29,
    cadence: "month",
    description: "Shop drops and designer capsules 48 hours early.",
    perks: ["48-hour early access", "Waitlist priority", "Limited drops"],
  },
  {
    id: "care",
    name: "Clothing-care services",
    price: 39,
    cadence: "month",
    description: "Complimentary steaming, repairs, and seasonal storage credits.",
    perks: ["Steam & press credits", "Minor repairs", "Storage discount"],
  },
];
