import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client to prevent startup crashes when API key is missing.
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Chat API route leveraging @google/genai SDK on the backend
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
       res.status(400).json({ error: "Missing message parameter" });
       return;
    }

    const ai = getGeminiClient();
    
    // Set up standard educational trading rules as a system instruction
    const systemInstruction = 
      "You are a professional advisor companion built directly inside 'BinaryTool' for trading automations. " +
      "Your objective is to help the user understand binary options, digits analysis, risk management, and bot construction. " +
      "Keep answers highly readable, strategic, and direct. Explain terms like Volatility index, Accumulators, " +
      "Even/Odd strategies, and Martingale configurations. Emphasize that 'Risk management is your superpower'. " +
      "Never give formal financial advice, but offer educational analysis and suggestions for their current simulated transactions.";

    // Re-create the chat session with instructions and previous context
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
      },
      history: history || [],
    });

    const response = await chat.sendMessage({ message });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ 
      error: "Failed to communicate with AI Advisor", 
      details: error.message || error 
    });
  }
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BinaryTool Server listening at http://localhost:${PORT}`);
  });
}

startServer();
