import { google } from "@ai-sdk/google";
import { embed } from "ai";

export async function generateEmbedding(text) {
  if (!text || typeof text !== "string") return [];

  // ✅ New recommended method
  const model = google.textEmbedding("text-embedding-004", {
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  const { embedding } = await embed({
    model,
    value: text,
  });

  return embedding;
}
