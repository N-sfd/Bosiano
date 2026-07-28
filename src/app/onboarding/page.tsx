import type { Metadata } from "next";
import { OnboardingQuiz } from "@/components/onboarding/OnboardingQuiz";

export const metadata: Metadata = {
  title: "Style Quiz — Personalize Bosianos",
  description: "Tell us your style, designers, sizes, colors, budget, and occasions.",
};

export default function OnboardingPage() {
  return <OnboardingQuiz />;
}
