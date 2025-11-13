export function chunkText(text, chunkSize = 100, overlap = 50) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
  start += Math.max(chunkSize - overlap, 1);
  }
  return chunks;
}  
