import { NextResponse } from "next/server";
import * as pdfjsLib from "pdf-parse";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    const pdf = await pdfjsLib.getDocument({ data: uint8 }).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((t) => t.str).join(" ");
      fullText += pageText + "\n";
    }

    return NextResponse.json({
      success: true,
      pages: pdf.numPages,
      length: fullText.length,
      text: fullText.slice(0, 500)
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
