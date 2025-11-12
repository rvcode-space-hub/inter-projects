import { generateText } from "ai";
import { google } from "@ai-sdk/google";


export async function POST(req) {
  try {
    const { prompt } = await req.json();

   const model = google("models/gemini-2.5-flash", {
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 1024,
    });

    return new Response(JSON.stringify({ response: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
