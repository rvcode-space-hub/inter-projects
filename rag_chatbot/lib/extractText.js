import fs from "fs";
import textract from "textract";
import { parse as csvParse } from "csv-parse/sync";
const pdfParse  = require('pdf-parse')



// ✅ Text Extraction Utility
export async function extractText(filePath, fileType) {
  try {
    let text = "";

    switch (fileType.toLowerCase()) {
      // 🧠 PDF
      case "pdf": {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        text = data.text;
        break;
      }

      // 📄 Word Documents
      case "doc":
      case "docx": {
        text = await new Promise((resolve, reject) => {
          textract.fromFileWithPath(filePath, (error, extractedText) => {
            if (error) reject(error);
            else resolve(extractedText || "");
          });
        });
        break;
      }

      // 📝 Plain Text
      case "txt": {
        text = fs.readFileSync(filePath, "utf-8");
        break;
      }

      // 📊 CSV
      case "csv": {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const records = csvParse(fileContent, { columns: true });
        text = records.map((record) => JSON.stringify(record)).join("\n");
        break;
      }

      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }

    // 🧹 Clean up and normalize text output
    return text.replace(/\s+/g, " ").trim();
  } catch (error) {
    console.error("❌ Error extracting text:", error.message);
    throw new Error("Failed to extract text from file");
  }
}
