import { loadVectors, saveVectors } from "@/lib/vectorStore";
import { generateEmbedding } from "@/lib/embeddings";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, text } = body || {};

    // --- Validation ---
    if (!text) {
      return Response.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const vector = await generateEmbedding(text);

    if (!Array.isArray(vector)) {
      return Response.json(
        { error: "Embedding failed, received invalid format" },
        { status: 500 }
      );
    }

    // --- Load DB ---
    let db = loadVectors();

    const newItem = {
      id: id || Date.now().toString(),
      text,
      values: vector,
    };

    db.push(newItem);

    saveVectors(db);

    return Response.json({
      success: true,
      message: "Vector stored successfully",
      item: newItem,
    });
  } catch (err) {
    console.error("Vector Store Error:", err);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
