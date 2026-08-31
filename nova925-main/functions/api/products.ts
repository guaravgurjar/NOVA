import type { MongoClient as MongoClientType } from "mongodb";

// ── Types ────────────────────────────────────────────────────────────────────
interface Env {
  MONGODB_URI?: string;
  R2_PUBLIC_URL?: string;
  CACHE_INVALIDATE_SECRET?: string;
  ASSETS: Fetcher;
}

// ── Cache key used by both GET and POST (invalidation) handlers ───────────────
const CACHE_KEY = "https://nova-internal/api/products-cache";
const CACHE_TTL_SECONDS = 30;

// ── GET /api/products ─────────────────────────────────────────────────────────
export const onRequestGet = async (context: { env: Env; request: Request }) => {
  const { env } = context;

  // 1. Try Cloudflare edge cache first (30s TTL)
  const cache = typeof caches !== "undefined" ? (caches as any).default : null;
  const cached = cache ? await cache.match(CACHE_KEY) : null;
  if (cached) {
    // Clone and add a cache-hit header for visibility
    const hit = new Response(cached.body, cached);
    hit.headers.set("X-Cache", "HIT");
    return hit;
  }

  // 2. Connect to MongoDB and fetch products
  const mongoUri = env.MONGODB_URI;
  if (!mongoUri) {
    return json({ success: true, products: [], error: "MONGODB_URI not configured" }, 500);
  }

  const { MongoClient } = await import("mongodb");
  let client: MongoClientType | null = null;
  try {
    client = new MongoClient(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    await client.connect();

    // Extract DB name from the connection string path
    const dbName =
      new URL(mongoUri.replace("mongodb+srv://", "https://")).pathname.replace("/", "") || "nova";
    const db = client.db(dbName);

    const mongoProducts = await db
      .collection("products")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const r2PublicUrl = env.R2_PUBLIC_URL || "";

    // Route all product images through the image proxy for WebP optimisation
    const toProxy = (key: string) =>
      `/api/image?url=${encodeURIComponent(`${r2PublicUrl}/${key}`)}&w=900`;

    const enhanced = mongoProducts.map((p: any) => ({
      ...p,
      _id: p._id?.toString(), // Serialize ObjectId → string
      fullImageUrls:
        p.imageKeys && Array.isArray(p.imageKeys)
          ? p.imageKeys.map((k: string) => toProxy(k))
          : null,
      fullImageUrl:
        p.imageKeys && Array.isArray(p.imageKeys) && p.imageKeys.length > 0
          ? toProxy(p.imageKeys[0])
          : p.imageKey
          ? toProxy(p.imageKey)
          : null,
    }));

    const payload = { success: true, products: enhanced };

    // 3. Store in edge cache for 30 seconds
    const response = new Response(JSON.stringify(payload), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}, stale-while-revalidate=60`,
        "X-Cache": "MISS",
      },
    });

    // cache.put is fire-and-forget — don't await to keep response fast
    context.env.ASSETS && cache.put(CACHE_KEY, response.clone());

    return response;
  } catch (err: any) {
    console.error("Products fetch error:", err?.message || err);
    return json({ success: false, error: "Failed to fetch products" }, 500);
  } finally {
    // Always close the connection — Workers are stateless
    await client?.close();
  }
};

// ── POST /api/products/invalidate-cache ───────────────────────────────────────
// Called by AdminJS after-hooks on product create / edit / delete.
// Purges the edge cache so the next GET fetches fresh data immediately.
export const onRequestPost = async (context: { env: Env; request: Request }) => {
  const { env, request } = context;

  const secret = request.headers.get("x-invalidate-secret");
  const expected = env.CACHE_INVALIDATE_SECRET;

  if (!expected) {
    return json({ error: "Cache invalidation not configured" }, 500);
  }
  if (secret !== expected) {
    return json({ error: "Unauthorized" }, 401);
  }

  try {
    const cache = typeof caches !== "undefined" ? (caches as any).default : null;
    const deleted = cache ? await cache.delete(CACHE_KEY) : false;
    console.log(`✅ Products edge cache invalidated (deleted=${deleted})`);
    return json({ success: true, deleted });
  } catch (err: any) {
    console.error("Cache invalidation error:", err?.message || err);
    return json({ error: "Failed to invalidate cache" }, 500);
  }
};

// ── Helper ────────────────────────────────────────────────────────────────────
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
