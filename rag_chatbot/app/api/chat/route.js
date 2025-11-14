import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { searchVectors } from "@/lib/vectorStore";
import { generateEmbedding } from "@/lib/embeddings";

export async function POST(req) {


  try {
    const { query } = await req.json();

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ response: "Please enter a question." }),
        { status: 200 }
      );
    }

 const queryEmbedding = await generateEmbedding(query);
  const results = searchVectors(queryEmbedding, 5);
   const context = results.map(r => r.text).join("\n\n---\n\n");

    const model = google("models/gemini-2.5-flash", {
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

const prompt = `
You are an AI assistant. Use ONLY the context below to answer the question.
If the context does not contain the answer, reply: "Not found in document".

Context:
${context || "No context available"}

Question:
${query}
`;

    console.log("Prompt sent to model:", prompt);

    const { text } = await generateText({
      model,
      messages: [{ role: "user", content: query }],
      maxTokens: 1024,
    });

    return new Response(
      JSON.stringify({ response: text }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("CHAT ERROR:", error);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}






















