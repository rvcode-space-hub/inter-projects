import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "vectors.json");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export function loadVectors() {
  try {
    if (!fs.existsSync(filePath)) return [];

    const raw = fs.readFileSync(filePath, "utf8").trim();
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("VectorStore Load Error:", err);
    fs.writeFileSync(filePath, "[]");
    return [];
  }
}

export function saveVectors(vectors) {
  try {
    const temp = filePath + ".tmp";
    fs.writeFileSync(temp, JSON.stringify(vectors, null, 2));
    fs.renameSync(temp, filePath);
  } catch (err) {
    console.error("VectorStore Save Error:", err);
  }
}

export function appendVector(newItem) {
  try {
    const vectors = loadVectors();
    vectors.push(newItem);
    saveVectors(vectors);
    return newItem;
  } catch (err) {
    console.error("VectorStore Append Error:", err);
    return null;
  }
}

export function searchVectors(queryEmbedding, topK = 5) {
  const vectors = loadVectors();

  if (!Array.isArray(vectors) || vectors.length === 0) return [];

  function cosineSim(a, b) {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  const scored = vectors.map(v => ({
    ...v,
    score: cosineSim(queryEmbedding, v.values)
  }));

  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}
