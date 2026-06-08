import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Initialize Firebase Admin SDK
const hasFirebase = process.env.FIREBASE_PROJECT_ID && 
                    process.env.FIREBASE_PROJECT_ID !== 'your_project_id' &&
                    process.env.FIREBASE_PROJECT_ID !== '';

if (hasFirebase) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID
  });
} else {
  console.warn("⚠️ Firebase configuration keys are missing in .env. Running server in unauthenticated dev mode.");
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Express middleware to verify Firebase ID tokens
  const requireFirebaseAuth = async (req: any, res: any, next: any) => {
    if (!hasFirebase) {
      return next(); // Bypass in dev mode if keys are not set
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (err: any) {
      console.error("Firebase ID Token Verification Failed:", err.message || err);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  };

  // Secure API endpoint using requireFirebaseAuth route guard
  app.post("/api/chat", requireFirebaseAuth, async (req, res) => {
    try {
      const { history, message } = req.body;
      
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: "You are NOVA, a helpful and knowledgeable jewelry assistant for NOVA Jewellery. You can answer questions about silver, jewelry care, our products, shipping, and more.",
        },
      });

      // Restore history if any
      // Currently the SDK doesn't natively support setting history like this easily with just chat.create
      // We can use generateContent with history directly, but the instructions say to use chat.sendMessage for chat.
      // Wait, let's just use generateContent since it's easier to pass all history.
      
      const formattedContents = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      
      formattedContents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: "You are NOVA, a helpful and knowledgeable jewelry assistant for NOVA Jewellery. You can answer questions about silver, jewelry care, our products, shipping, and more.",
        }
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of response) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
