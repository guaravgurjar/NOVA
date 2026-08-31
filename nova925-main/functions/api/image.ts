export const onRequestGet = async (context: { request: Request; env: any }) => {
  const { request, env } = context;
  const urlObj = new URL(request.url);
  const rawUrl = urlObj.searchParams.get("url");

  if (!rawUrl) {
    return new Response("Missing url param", { status: 400 });
  }

  const r2PublicUrl = env.R2_PUBLIC_URL;
  if (!r2PublicUrl) {
    return new Response("Image proxy not configured", { status: 500 });
  }

  if (!rawUrl.startsWith(r2PublicUrl)) {
    return new Response("Forbidden origin", { status: 403 });
  }

  try {
    // Check if the image is in the Cloudflare Cache
    const cache = typeof caches !== "undefined" ? (caches as any).default : null;
    const cachedResponse = cache ? await cache.match(request) : null;
    if (cachedResponse) {
      // Clone the cached response to allow editing headers or logging
      const hitResponse = new Response(cachedResponse.body, cachedResponse);
      hitResponse.headers.set("X-Cache", "HIT");
      return hitResponse;
    }

    const upstream = await fetch(rawUrl);
    if (!upstream.ok) {
      return new Response("Failed to fetch image", { status: upstream.status });
    }

    // Set client and edge caching headers (30 days browser, 1 day edge)
    const headers = new Headers();
    const contentType = upstream.headers.get("content-type");
    if (contentType) {
      headers.set("content-type", contentType);
    } else {
      headers.set("content-type", "image/webp");
    }
    headers.set("Cache-Control", "public, max-age=2592000, s-maxage=86400");
    headers.set("X-Cache", "MISS");

    const response = new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers,
    });

    // Cache the response in Cloudflare edge cache (cache.put is fire-and-forget)
    if (cache && env.ASSETS) {
      ctxAndCachePut(cache, request, response.clone());
    }

    return response;
  } catch (err: any) {
    return new Response(err.message || "Error fetching image", { status: 500 });
  }
};

// Helper to handle cache.put without blocking the request
function ctxAndCachePut(cache: any, request: Request, response: Response) {
  try {
    cache.put(request, response);
  } catch (e) {
    console.error("Cache put error:", e);
  }
}
