import { onRequestPost as chatHandler } from "./functions/api/chat";
import { onRequestGet as healthHandler } from "./functions/api/health";
import { onRequestPost as ordersHandler } from "./functions/api/orders";
import {
  onRequestGet as productsGetHandler,
  onRequestPost as productsCacheInvalidateHandler,
} from "./functions/api/products";
import { onRequestGet as imageHandler } from "./functions/api/image";

export interface Env {
  ASSETS: Fetcher;
  GEMINI_API_KEY?: string;
  FIREBASE_PROJECT_ID?: string;
  MONGODB_URI?: string;
  R2_PUBLIC_URL?: string;
  CACHE_INVALIDATE_SECRET?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // --- API routing ---
    if (pathname.startsWith("/api/")) {
      const context = { request, env, ctx };

      if (pathname === "/api/chat" && request.method === "POST") {
        return chatHandler(context as any);
      }
      if (pathname === "/api/health" && request.method === "GET") {
        return healthHandler(context as any);
      }
      if (pathname === "/api/orders" && request.method === "POST") {
        return ordersHandler(context as any);
      }

      // Products — GET fetches from MongoDB, POST invalidates edge cache
      if (pathname === "/api/products" && request.method === "GET") {
        return productsGetHandler(context as any);
      }
      if (pathname === "/api/products/invalidate-cache" && request.method === "POST") {
        return productsCacheInvalidateHandler(context as any);
      }

      // Image Proxy — GET fetches from R2 and caches
      if (pathname === "/api/image" && request.method === "GET") {
        return imageHandler(context as any);
      }

      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // --- Static assets (SPA) ---
    return (env.ASSETS.fetch as (req: Request) => Promise<Response>)(request);
  },
};
