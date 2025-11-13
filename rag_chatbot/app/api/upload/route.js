import { unstable_parseMultipartFormData, File } from 'next/server';
import fs from "fs";
import { extractText } from "../../../lib/extractText";
import { chunkText } from "../../../lib/chunkText";
import initPinecone from "../../../lib/pineconeClient";
import { generateEmbedding } from "../../../lib/embeddings";

export const config = { api: { bodyParser: false } };

function batchArray(array, batchSize) {
  const batches = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
}

export const POST = async (req) => {
  try {
    const formData = await unstable_parseMultipartFormData(req, (file) => {
      const tempPath = `./tmp/${file.name}`;
      fs.writeFileSync(tempPath, file.arrayBuffer());
      return tempPath;
    });

    const filePath = formData.get('file');
    if (!filePath) return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });

    const text = await extractText(filePath, filePath.split('.').pop());
    const chunks = chunkText(text);
    const index = await initPinecone();

    const BATCH_SIZE = 10;
    const chunkBatches = batchArray(chunks, BATCH_SIZE);

    for (const batch of chunkBatches) {
      const embeddings = await Promise.all(
        batch.map(async (chunk) => {
          try {
            const vector = await generateEmbedding(chunk);
            return { id: `${Date.now()}-${Math.random()}`, values: vector, metadata: { text: chunk } };
          } catch {
            return null;
          }
        })
      );

      const valid = embeddings.filter(Boolean);
      if (valid.length) await index.upsert(valid);
    }

    fs.unlinkSync(filePath);
    return new Response(JSON.stringify({ message: "File processed and uploaded to Pinecone" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error processing the file" }), { status: 500 });
  }
};
