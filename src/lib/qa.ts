import type { ProductQuestion } from "./types";
import { products } from "./products";

const questionBank = [
  {
    question: "Does this run true to size?",
    answer: "Most customers find it true to size. If you're between sizes, our AI size advisor on this page can help.",
  },
  {
    question: "Is the colour true to the photos?",
    answer: "Yes — we photograph in natural light. Slight variation can occur between screens.",
  },
  {
    question: "Can I have this gift-wrapped?",
    answer: "Gift wrapping is available at checkout for a complimentary Bosianos presentation box.",
  },
  {
    question: "Where was this made?",
    answer: "Country of manufacture is listed under Product origin on this page.",
  },
];

export function getProductQuestions(productId: string): ProductQuestion[] {
  const idx = products.findIndex((p) => p.id === productId);
  if (idx < 0) return [];
  return questionBank.map((q, i) => ({
    id: `${productId}-q-${i}`,
    productId,
    author: ["Maya R.", "James L.", "Sofia K.", "Elena V."][(idx + i) % 4],
    question: q.question,
    answer: q.answer,
    answeredBy: "Bosianos Concierge",
    date: `2026-0${(i % 6) + 1}-${10 + ((idx + i) % 18)}`,
  }));
}
