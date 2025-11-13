import { getEmbedding } from "@ai-sdk/google";

export async function generateEmbedding(text) {
    const client = getEmbedding();
    const response = await client.embeddings.create({   
        model: "text-embedding-3-small",
        input: text,
    });
    return response.data[0].embedding;
}
