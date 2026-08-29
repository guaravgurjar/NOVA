import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { MongoClient, Db } from "mongodb";
import sharp from "sharp";
import helmet from "helmet";
import cors from "cors";
import { z } from "zod";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

dotenv.config();

// ─── Firebase Admin Initialization ──────────────────────────────────────────
if (!getApps().length) {
  // Use a service account JSON if provided, otherwise use Application Default Credentials.
  // In production set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT env var.
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountEnv) {
    initializeApp({ credential: cert(JSON.parse(serviceAccountEnv)) });
  } else {
    // Falls back to Application Default Credentials (works on Cloud Run / GCP)
    // For local dev the requireAuth middleware allows unauthenticated access.
    initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
  }
}

// Gemini AI client — optional, only initialized if API key is present
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    })
  : null;

if (!ai) {
  console.warn("⚠️ GEMINI_API_KEY not set — AI chatbot features will be disabled.");
}

// ─── MongoDB Connection ─────────────────────────────────────────────────────
let db: Db | null = null;
const MONGODB_URI = process.env.MONGODB_URI || "";

async function connectMongo(): Promise<Db | null> {
  if (!MONGODB_URI || MONGODB_URI.includes("<user>") || MONGODB_URI.includes("<password>")) {
    console.warn("⚠️ MONGODB_URI is missing or contains placeholders. Running server without database.");
    return null;
  }

  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const dbName = new URL(MONGODB_URI.replace("mongodb+srv://", "https://")).pathname.replace("/", "") || "nova";
    db = client.db(dbName);
    console.log(`✅ Connected to MongoDB database: ${dbName}`);
    return db;
  } catch (err: any) {
    console.error("❌ MongoDB connection failed:", err.message || err);
    await client.close(); // prevent connection leak
    return null;
  }
}

// ─── Zod Schema: Order Validation ───────────────────────────────────────────
const OrderItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().positive().max(100),
  pricePaid: z.number().positive(),
});

const OrderSchema = z.object({
  buyerName: z.string().min(2).max(120).trim(),
  buyerEmail: z.string().email(),
  shippingAddress: z.string().min(10).max(500).trim(),
  engravingText: z.string().max(100).nullable().optional(),
  totalPrice: z.number().positive(),
  items: z.array(OrderItemSchema).min(1).max(50),
});
// ─── In-memory image cache (avoids re-fetching + re-encoding R2 images) ────
// Keyed by "<url>|<width>". Capped at 200 entries to bound memory usage.
const IMAGE_CACHE = new Map<string, Buffer>();
const IMAGE_CACHE_MAX = 200;

function imageCacheSet(key: string, buf: Buffer) {
  if (IMAGE_CACHE.size >= IMAGE_CACHE_MAX) {
    // Evict the oldest entry
    IMAGE_CACHE.delete(IMAGE_CACHE.keys().next().value!);
  }
  IMAGE_CACHE.set(key, buf);
}

// ─── In-memory products cache (30 second TTL) ────────────────────────────────
let productsCache: { data: any; ts: number } | null = null;
const PRODUCTS_CACHE_TTL_MS = 30_000; // 30 seconds — reduced so new AdminJS products surface quickly


async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

  // ── Security Headers (helmet) ────────────────────────────────────────────
  app.use(helmet({
    contentSecurityPolicy: false, // Managed separately via Vite/frontend meta tags
  }));

  // ── CORS ────────────────────────────────────────────────────────────────
  const allowedOrigins = [
    process.env.APP_URL ? `https://${process.env.APP_URL}` : null,
    // Also accept the 's' variant — both novajewel.in and novajewels.in are live
    process.env.APP_URL_ALT ? `https://${process.env.APP_URL_ALT}` : null,
    `https://www.novajewel.in`,
    `https://www.novajewels.in`,
    `http://localhost:${PORT}`,   // server's own origin (SSR self-requests)
    'http://localhost:3001',
    'http://localhost:5173',
  ].filter(Boolean) as string[];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, same-origin SSR)
      if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }));

  app.use(express.json({ limit: '1mb' }));

  // Trust proxy for correct client IP detection behind reverse proxies (like Cloudflare, Vercel, Nginx)
  app.set("trust proxy", 1);

  // General rate limiter for all API endpoints (300 requests per 15 minutes)
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 300 requests per window
    standardHeaders: true, // Return rate limit info in standard headers
    legacyHeaders: false, // Disable legacy X-RateLimit-* headers
    message: { error: "Too many requests from this IP, please try again after 15 minutes." }
  });

  // Stricter rate limiter specifically for the AI Chat endpoint (30 requests per 5 minutes)
  const chatLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 30, // Limit each IP to 30 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many chat requests, please try again after 5 minutes." }
  });

  // Apply general API rate limiter to all /api/ routes
  app.use("/api/", apiLimiter);

  // ─── Auth Middleware ─────────────────────────────────────────────────────
  // IMPORTANT: defined here so all routes below can reference it.
  // Verifies Firebase ID tokens using firebase-admin SDK.
  // In development (NODE_ENV !== 'production') falls back to a mock user if
  // no token or verification fails, so the dev server works without credentials.
  const requireAuth = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (process.env.NODE_ENV !== 'production') {
        req.user = { uid: 'dev-user', email: 'guest@nova-phone.local' };
        return next();
      }
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      // ✅ Real Firebase ID token verification via firebase-admin
      const decoded = await getAuth().verifyIdToken(token);
      req.user = { uid: decoded.uid, email: decoded.email || '' };
      next();
    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn("⚠️ Token verification failed in dev mode, using mock user:", err.message || err);
        req.user = { uid: 'dev-user', email: 'guest@nova-phone.local' };
        return next();
      }
      console.error("Token Verification Failed:", err.message || err);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  };

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", database: db ? "connected" : "disconnected" });
  });


  // ─── Image Proxy: fetches R2 images and serves as compressed WebP ────────
  // Usage: /api/image?url=<encoded-r2-url>&w=800
  app.get("/api/image", async (req, res) => {
    try {
      const rawUrl = req.query.url as string;
      const maxWidth = Math.min(parseInt(req.query.w as string) || 900, 1200);

      if (!rawUrl) return res.status(400).json({ error: "Missing url param" });

      // ✅ Fail hard if R2_PUBLIC_URL is unset — empty string would allow ALL URLs (SSRF)
      const r2PublicUrl = process.env.R2_PUBLIC_URL;
      if (!r2PublicUrl) return res.status(500).json({ error: "Image proxy not configured" });
      if (!rawUrl.startsWith(r2PublicUrl)) {
        return res.status(403).json({ error: "Forbidden origin" });
      }

      // ✅ Serve from in-memory cache if available (avoids R2 round-trip + sharp re-encode)
      const cacheKey = `${rawUrl}|${maxWidth}`;
      const cached = IMAGE_CACHE.get(cacheKey);
      if (cached) {
        res.set({
          "Content-Type": "image/webp",
          "Cache-Control": "public, max-age=2592000, s-maxage=86400",
          "X-Cache": "HIT",
        });
        return res.send(cached);
      }

      const upstream = await fetch(rawUrl);
      if (!upstream.ok) {
        return res.status(upstream.status).end();
      }

      const buffer = Buffer.from(await upstream.arrayBuffer());

      const optimized = await sharp(buffer)
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

      // Store in cache for subsequent requests
      imageCacheSet(cacheKey, optimized);

      // Cache for 30 days in the browser, 1 day at CDN edge
      res.set({
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=2592000, s-maxage=86400",
        "X-Cache": "MISS",
      });
      res.send(optimized);
    } catch (err: any) {
      console.error("Image proxy error:", err.message);
      res.status(500).end();
    }
  });

  // ─── Cache Invalidation Endpoint ─────────────────────────────────────────
  // Called by AdminJS after-hooks on product create / edit / delete.
  // Requires X-Invalidate-Secret header matching CACHE_INVALIDATE_SECRET env var.
  app.post("/api/products/invalidate-cache", (req, res) => {
    const secret = req.headers["x-invalidate-secret"] as string | undefined;
    const expected = process.env.CACHE_INVALIDATE_SECRET;
    if (!expected) {
      // Secret not configured — reject to avoid open endpoint
      return res.status(500).json({ error: "Cache invalidation not configured on server" });
    }
    if (secret !== expected) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    productsCache = null;
    console.log("✅ Products cache invalidated by AdminJS hook");
    res.json({ success: true, message: "Products cache cleared" });
  });

  // Products endpoint — 30s server-side cache to avoid hitting MongoDB on every page load
  app.get("/api/products", async (req, res) => {
    // Set browser cache headers aligned with server-side TTL
    res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=60");

    // Serve from memory cache if fresh
    if (productsCache && Date.now() - productsCache.ts < PRODUCTS_CACHE_TTL_MS) {
      return res.json(productsCache.data);
    }

    try {
      if (!db) {
        return res.json({ success: true, products: [] });
      }
      const mongoProducts = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
      const r2PublicUrl = process.env.R2_PUBLIC_URL || '';

      // Route all product images through the local image proxy for WebP compression & caching
      const toProxy = (key: string) =>
        `/api/image?url=${encodeURIComponent(`${r2PublicUrl}/${key}`)}&w=900`;

      const enhancedProducts = mongoProducts.map(p => ({
        ...p,
        fullImageUrls: p.imageKeys && Array.isArray(p.imageKeys)
          ? p.imageKeys.map((k: string) => toProxy(k))
          : null,
        fullImageUrl: p.imageKeys && Array.isArray(p.imageKeys) && p.imageKeys.length > 0
          ? toProxy(p.imageKeys[0])
          : (p.imageKey ? toProxy(p.imageKey) : null),
      }));

      const payload = { success: true, products: enhancedProducts };
      // Store in memory cache
      productsCache = { data: payload, ts: Date.now() };
      res.json(payload);
    } catch (err: any) {
      console.error("Failed to fetch products from MongoDB:", err);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // ─── Orders Endpoint (MongoDB) ──────────────────────────────────────────
  app.post("/api/orders", requireAuth, async (req, res) => {
    // ✅ Validate request body against strict Zod schema
    const parsed = OrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid order payload",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    try {
      const orderPayload = parsed.data;
      const orderNumber = `NOVA-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderWithId = {
        ...orderPayload,
        userId: (req as any).user?.uid || null,
        orderNumber,
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      if (db) {
        await db.collection("orders").insertOne(orderWithId);
      }

      res.json({ success: true, order: orderWithId });
    } catch (err: any) {
      console.error("Failed to save order:", err);
      res.status(500).json({ error: "Failed to place order" });
    }
  });

  // ─── Address CRUD Endpoints (MongoDB) ───────────────────────────────────

  // GET /api/addresses/:userId — Fetch all addresses for a user
  app.get("/api/addresses/:userId", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;

      // ✅ Ownership check: users can only access their own addresses
      if ((req as any).user?.uid !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      if (!db) {
        return res.json({ success: true, addresses: [] });
      }

      const addresses = await db.collection("addresses")
        .find({ userId })
        .sort({ isDefault: -1 })
        .toArray();

      res.json({ success: true, addresses });
    } catch (err: any) {
      console.error("Failed to fetch addresses:", err);
      res.status(500).json({ error: "Failed to fetch addresses" });
    }
  });

  // POST /api/addresses/:userId — Create or update an address
  app.post("/api/addresses/:userId", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;

      // ✅ Ownership check
      if ((req as any).user?.uid !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const address = req.body;

      if (!db) {
        return res.json({ success: true, address });
      }

      // If setting this as default, unset all others first
      if (address.isDefault) {
        await db.collection("addresses").updateMany(
          { userId },
          { $set: { isDefault: false } }
        );
      }

      await db.collection("addresses").updateOne(
        { userId, id: address.id },
        { $set: { ...address, userId } },
        { upsert: true }
      );

      res.json({ success: true, address });
    } catch (err: any) {
      console.error("Failed to save address:", err);
      res.status(500).json({ error: "Failed to save address" });
    }
  });

  // DELETE /api/addresses/:userId/:addressId — Delete an address
  app.delete("/api/addresses/:userId/:addressId", requireAuth, async (req, res) => {
    try {
      const { userId, addressId } = req.params;

      // ✅ Ownership check
      if ((req as any).user?.uid !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      if (!db) {
        return res.json({ success: true });
      }

      await db.collection("addresses").deleteOne({ userId, id: addressId });

      res.json({ success: true });
    } catch (err: any) {
      console.error("Failed to delete address:", err);
      res.status(500).json({ error: "Failed to delete address" });
    }
  });

  // ─── User Profile Endpoints (MongoDB) ─────────────────────────────────────

  // GET /api/profile/:userId — Fetch stored personal info for a user
  app.get("/api/profile/:userId", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;

      // ✅ Ownership check
      if ((req as any).user?.uid !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      if (!db) {
        return res.json({ success: true, profile: null });
      }

      const profile = await db.collection("profiles").findOne({ userId });
      res.json({ success: true, profile: profile || null });
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // POST /api/profile/:userId — Create or update personal info for a user
  app.post("/api/profile/:userId", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;

      // ✅ Ownership check
      if ((req as any).user?.uid !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const profileData = req.body;

      if (!db) {
        return res.json({ success: true, profile: profileData });
      }

      await db.collection("profiles").updateOne(
        { userId },
        { $set: { ...profileData, userId, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );

      res.json({ success: true, profile: profileData });
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      res.status(500).json({ error: "Failed to save profile" });
    }
  });

  // Luxury Concierge System Instruction Definition
  const LUXURY_CONCIERGE_PROMPT =
    "You are NOVA, an elegant, highly sophisticated digital concierge for NOVA Jewellery. " +
    "Your tone should be refined, warm, editorial, and helpful. Speak with the grace expected of a luxury house. " +
    "You possess deep expertise in fine metals (like sterling silver and gold plating), gemstone handling, " +
    "jewelry care practices, shipping options, and gift curation. Help clients discover the perfect piece " +
    "while maintaining an exclusive, premium brand presence. Keep responses clear and thoughtfully paced.";

  // Secure API endpoint using rate limiter and auth route guard
  app.post("/api/chat", chatLimiter, requireAuth, async (req, res) => {
    try {
      const { history, message } = req.body;

      const formattedContents = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      formattedContents.push({ role: 'user', parts: [{ text: message }] });

      // Streaming setup with the luxury persona configuration
      const response = await ai.models.generateContentStream({
        model: "gemini-2.0-flash",
        contents: formattedContents,
        config: {
          systemInstruction: LUXURY_CONCIERGE_PROMPT,
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

  // SSR Middleware (Development & Production)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
        const appHtml = render(url).html;
        const html = template.replace(`<div id="root"></div>`, `<div id="root">${appHtml}</div>`);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distClient = path.join(process.cwd(), 'dist/client');
    const distServer = path.join(process.cwd(), 'dist/server/entry-server.js');

    app.use(express.static(distClient, { index: false }));

    app.use('*', async (req, res) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.join(distClient, 'index.html'), 'utf-8');
        let appHtml = '';
        if (fs.existsSync(distServer)) {
          const { render } = await import(distServer);
          appHtml = render(url).html;
        }
        const html = template.replace(`<div id="root"></div>`, `<div id="root">${appHtml}</div>`);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e: any) {
        console.error('SSR render error:', e);
        res.sendFile(path.join(distClient, 'index.html'));
      }
    });
  }

  // ✅ Connect to MongoDB BEFORE listening — first request is never cold
  await connectMongo();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`💎 Secure server running on http://localhost:${PORT}`);
  });
}

startServer();