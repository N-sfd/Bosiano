import type { Order } from "./types";

export const orders: Order[] = [
  {
    id: "BSN-48213",
    date: "2026-07-21",
    status: "out-for-delivery",
    total: 1530,
    items: [
      { name: "Sculpted Wool Blazer", brand: "Maison Vérane", image: "sculpted-wool-blazer-0-0", price: 1290, qty: 1, size: "S" },
      { name: "Signet Vermeil Ring", brand: "SÀNSO", image: "signet-vermeil-ring-0-0", price: 210, qty: 1, size: "7" },
    ],
    timeline: [
      { label: "Order placed", date: "Jul 21, 9:14 AM", done: true },
      { label: "Payment confirmed", date: "Jul 21, 9:15 AM", done: true },
      { label: "Preparing your order", date: "Jul 21, 2:40 PM", done: true },
      { label: "Shipped", date: "Jul 22, 8:02 AM", done: true },
      { label: "Out for delivery", date: "Jul 27, 7:30 AM", done: true },
      { label: "Delivered", date: "Expected today by 6 PM", done: false },
    ],
    tracking: "1Z-BSN-9921-4408-217",
    eta: "Today, by 6:00 PM",
    address: "12 Marlowe Court, London W1K 3QA",
  },
  {
    id: "BSN-47788",
    date: "2026-07-09",
    status: "delivered",
    total: 690,
    items: [
      { name: "Fluid Silk Slip Dress", brand: "Belrose", image: "fluid-silk-slip-dress-0-0", price: 690, qty: 1, size: "S" },
    ],
    timeline: [
      { label: "Order placed", date: "Jul 9, 4:22 PM", done: true },
      { label: "Payment confirmed", date: "Jul 9, 4:23 PM", done: true },
      { label: "Shipped", date: "Jul 10, 11:00 AM", done: true },
      { label: "Delivered", date: "Jul 12, 1:15 PM", done: true },
    ],
    tracking: "1Z-BSN-8814-2290-771",
    eta: "Delivered Jul 12",
    address: "12 Marlowe Court, London W1K 3QA",
  },
  {
    id: "BSN-46520",
    date: "2026-06-28",
    status: "delivered",
    total: 560,
    items: [
      { name: "Minimalist Leather Sneaker", brand: "SÀNSO", image: "minimalist-leather-sneaker-0-0", price: 340, qty: 1, size: "41" },
      { name: "Twisted Hoop Earrings", brand: "Belrose", image: "twisted-hoop-earrings-0-0", price: 165, qty: 1, size: "One Size" },
    ],
    timeline: [
      { label: "Order placed", date: "Jun 28, 10:03 AM", done: true },
      { label: "Shipped", date: "Jun 29, 9:00 AM", done: true },
      { label: "Delivered", date: "Jul 1, 3:45 PM", done: true },
    ],
    tracking: "1Z-BSN-7710-1180-553",
    eta: "Delivered Jul 1",
    address: "12 Marlowe Court, London W1K 3QA",
  },
];

export function getOrder(id: string) {
  return orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
}
