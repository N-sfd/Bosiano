export const atelierConfig = {
  mode:
    Boolean(process.env.ATELIER_AI_URL && process.env.ATELIER_AI_KEY) ||
    Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY)
      ? "ai"
      : "lite",
  aiEnabled: Boolean(
    (process.env.ATELIER_AI_URL && process.env.ATELIER_AI_KEY) ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_API_KEY
  ),
};
