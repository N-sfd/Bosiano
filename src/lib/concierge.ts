import type { SupportTicket } from "./types";

export type ConciergeChannel = "chat" | "whatsapp" | "email" | "phone" | "video" | "ai";

export interface ConciergeMessage {
  id: string;
  role: "user" | "ai" | "agent" | "system";
  text: string;
  at: number;
}

export const conciergeChannels: {
  id: ConciergeChannel;
  label: string;
  copy: string;
  href?: string;
}[] = [
  { id: "chat", label: "Live chat", copy: "Average reply under 2 minutes" },
  { id: "whatsapp", label: "WhatsApp", copy: "+44 20 7946 0100", href: "https://wa.me/442079460100" },
  { id: "email", label: "Email", copy: "concierge@bosiano.com", href: "mailto:concierge@bosiano.com" },
  { id: "phone", label: "Phone", copy: "+1 212 555 0188 · 9am–9pm ET", href: "tel:+12125550188" },
  { id: "video", label: "Video consultation", copy: "Private FaceTime-style desk" },
  { id: "ai", label: "AI assistant", copy: "Instant answers · human handoff anytime" },
];

export const aiQuickReplies = [
  "Where is my order?",
  "Help with sizing",
  "Book alterations",
  "Speak to a human",
  "Private Client support",
];

export function aiReply(prompt: string, isPrivateClient: boolean): string {
  const q = prompt.toLowerCase();
  if (/human|agent|person|handoff/.test(q)) {
    return isPrivateClient
      ? "Connecting you to the Private Client queue — Elena will join shortly."
      : "Connecting you to a Bosiano specialist. Hold on a moment.";
  }
  if (/order|track|shipping/.test(q)) {
    return "Your latest order is out for delivery. Track live in Account → Orders, or I can open tracking for you.";
  }
  if (/size|fit/.test(q)) {
    return "I can open Size Advisor on any PDP, or book a virtual fit check. Prefer AI guidance or a stylist?";
  }
  if (/alter|tailor|repair|care/.test(q)) {
    return "Alterations & Care covers tailoring, shoe repair, bag restoration, leather care, cleaning, and authentication — with pickup.";
  }
  if (/private|concierge|pc/.test(q)) {
    return isPrivateClient
      ? "You're in the Private Client support queue with priority routing and dedicated agents."
      : "Private Client unlocks a dedicated support queue. Gold members get priority; Private Client gets concierge.";
  }
  return "I can help with orders, sizing, stores, styling, and care services — or hand you to a human anytime.";
}

export const sampleTickets: SupportTicket[] = [
  { id: "SUP-2041", subject: "Return label reprint", status: "pending", updatedAt: "Yesterday" },
  { id: "SUP-1988", subject: "Gift wrap for anniversary order", status: "resolved", updatedAt: "12 Jul" },
];
