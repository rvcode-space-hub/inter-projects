import { Pinecone } from "@pinecone-database/pinecone";

const initPinecone = async () => {
  try {
    // Validate environment variables
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("❌ Missing PINECONE_API_KEY in environment variables");
    }
    if (!process.env.PINECONE_INDEX) {
      throw new Error("❌ Missing PINECONE_INDEX in environment variables");
    }

    // Initialize Pinecone client
    const pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT
    });

    // Connect to the index
    const index = pineconeClient.Index(process.env.PINECONE_INDEX);

    console.log("✅ Connected to Pinecone index:", process.env.PINECONE_INDEX);
    return index;
  } catch (error) {
    console.error("⚠️ Error initializing Pinecone:", error);
    throw error;
  }
};

export default initPinecone;
