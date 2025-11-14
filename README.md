# RAG Chatbot (Next.js + Vercel AI SDK + Gemini/OpenAI)

A **Retrieval-Augmented Chatbot (RAG)** built with **Next.js 14 (App Router)**, **Vercel AI SDK**, and **Gemini/OpenAI models**. This chatbot can answer user queries based on uploaded documents or predefined knowledge by leveraging retrieval + LLM reasoning.

---

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** TailwindCSS + ShadCN UI
- **AI SDK:** Vercel AI SDK
- **Model Provider:** Gemini API ( Google Generative AI SDK)
- **Database / Vector Store:** local JSON/in-memory store
- **Embeddings:** `text-embedding-3-small` Gemini embeddings

---

## 🎯 Features

- **RAG Chatbot:** Answers queries using uploaded files or predefined knowledge.
- **Retrieval + LLM Reasoning:** Combines vector search and AI reasoning for context-aware responses.
- **Modern Chat UI:**
  - Chat bubbles for user & bot
  - Persistent chat history (state or localStorage)
  - Loading indicators & typing animations
  - Scrollable chat area
- **File Upload (Bonus):** Upload PDFs/Text files to dynamically add new knowledge.
- **Responsive Design:** Works across mobile & desktop
- **Extras (Optional):**
  - Copy-to-clipboard button
  - Regenerate response button
  - Light/dark mode toggle
  - Source references for retrieved chunks

---

---

## ⚙️ Setup Instructions

1. **Clone the repo**

```bash
git clone git@github.com:rvcode-space-hub/inter-projects.git
cd rag-chatbot
npm install
npm run dev




```
