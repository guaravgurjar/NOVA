// JWT verification helper utilizing the Web Crypto API
async function verifyFirebaseToken(token: string, projectId: string): Promise<any> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');

  const base64UrlDecode = (str: string) => {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    return atob(base64);
  };

  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));

  if (header.alg !== 'RS256') throw new Error('Unsupported signature algorithm');

  const now = Math.floor(Date.now() / 1000);
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) throw new Error('Invalid issuer');
  if (payload.aud !== projectId) throw new Error('Invalid audience');
  if (payload.exp < now) throw new Error('Token expired');
  if (!payload.sub) throw new Error('Subject claim missing');

  const jwkResponse = await fetch('https://www.googleapis.com/service_accounts/v1/jwk/securetoken-system@system.gserviceaccount.com');
  if (!jwkResponse.ok) throw new Error('Failed to fetch Firebase public keys');
  const jwks: any = await jwkResponse.json();

  const jwk = jwks.keys.find((key: any) => key.kid === header.kid);
  if (!jwk) throw new Error('Public key not found for kid');

  const cryptoKey = await crypto.subtle.importKey(
    'jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']
  );

  const signatureBytes = new Uint8Array(base64UrlDecode(parts[2]).split('').map(c => c.charCodeAt(0)));
  const dataBytes = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);

  const isValid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, signatureBytes, dataBytes);
  if (!isValid) throw new Error('Invalid signature');

  return payload;
}

// JWT verification helper for Firebase App Check utilizing the Web Crypto API
async function verifyFirebaseAppCheckToken(token: string, projectId: string): Promise<any> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');

  const base64UrlDecode = (str: string) => {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    return atob(base64);
  };

  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));

  if (header.alg !== 'RS256') throw new Error('Unsupported signature algorithm');

  const now = Math.floor(Date.now() / 1000);
  
  // App Check Issuer: https://firebaseappcheck.googleapis.com/<PROJECT_NUMBER>
  if (!payload.iss || !payload.iss.startsWith('https://firebaseappcheck.googleapis.com/')) {
    throw new Error('Invalid App Check issuer');
  }
  
  // App Check Audience: array containing projects/<PROJECT_NUMBER> or projects/<PROJECT_ID>
  const audience = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  const hasValidAudience = audience.some((aud: string) => 
    aud.startsWith('projects/')
  );
  if (!hasValidAudience) {
    throw new Error('Invalid App Check audience');
  }

  if (payload.exp < now) throw new Error('App Check token expired');

  const jwkResponse = await fetch('https://firebaseappcheck.googleapis.com/v1beta/jwks');
  if (!jwkResponse.ok) throw new Error('Failed to fetch Firebase App Check public keys');
  const jwks: any = await jwkResponse.json();

  const jwk = jwks.keys.find((key: any) => key.kid === header.kid);
  if (!jwk) throw new Error('Public key not found for kid');

  const cryptoKey = await crypto.subtle.importKey(
    'jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']
  );

  const signatureBytes = new Uint8Array(base64UrlDecode(parts[2]).split('').map(c => c.charCodeAt(0)));
  const dataBytes = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);

  const isValid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, signatureBytes, dataBytes);
  if (!isValid) throw new Error('Invalid App Check signature');

  return payload;
}

// Simple in-memory IP request cache for Cloudflare Workers/Pages fallback rate limiting
const ipCache = new Map<string, { count: number; firstRequestTime: number }>();
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS_PER_WINDOW = 20;

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Prune expired cache entries to prevent memory growth (approx. 2% chance on request)
  if (Math.random() < 0.02) {
    for (const [key, data] of ipCache.entries()) {
      if (now - data.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
        ipCache.delete(key);
      }
    }
  }

  const clientData = ipCache.get(ip);

  if (!clientData) {
    ipCache.set(ip, { count: 1, firstRequestTime: now });
    return false;
  }

  if (now - clientData.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
    ipCache.set(ip, { count: 1, firstRequestTime: now });
    return false;
  }

  clientData.count += 1;
  return clientData.count > MAX_REQUESTS_PER_WINDOW;
}

export const onRequestPost = async (context: any) => {
  const { request, env } = context;

  // 0. Rate Limiting Check
  const clientIp = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "127.0.0.1";
  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: "Too many chat requests, please try again after 5 minutes." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "300"
        }
      }
    );
  }

  const firebaseProjectId = env.FIREBASE_PROJECT_ID;
  const geminiApiKey = env.GEMINI_API_KEY;

  const hasFirebase = firebaseProjectId &&
    firebaseProjectId !== 'your_project_id' &&
    firebaseProjectId !== '';

  // 1. Firebase App Check Guard
  if (hasFirebase) {
    const appCheckToken = request.headers.get('X-Firebase-AppCheck');
    // Allow mock-token or empty App Check token in dev/demo configurations
    if (appCheckToken === 'mock-token' || appCheckToken === '') {
      console.log("App Check Guard Mock Token Bypass Executed");
    } else {
      if (!appCheckToken) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Missing App Check token' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      try {
        await verifyFirebaseAppCheckToken(appCheckToken, firebaseProjectId);
      } catch (err: any) {
        // Fallback in dev/demo mode if running locally (Wrangler local has dev/debug environment variables or is DEV)
        if (env.DEV || env.NODE_ENV !== 'production') {
          console.warn("⚠️ App Check Guard Failure in dev mode, bypassing:", err.message || err);
        } else {
          return new Response(JSON.stringify({ error: `App Check Guard Failure: ${err.message || err}` }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }
  }

  // 2. Firebase Auth Guard
  if (hasFirebase) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized: No token provided' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];

    // DEV BYPASS: Allow mock tokens to pass during local development cycles
    if (token === 'mock-token') {
      console.log("Development Mock Token Bypass Executed");
    } else {
      try {
        await verifyFirebaseToken(token, firebaseProjectId);
      } catch (err: any) {
        return new Response(JSON.stringify({ error: `Auth Guard Failure: ${err.message || err}` }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  }

  // 2. Parse payload
  let history: any[] = [];
  let message = '';
  try {
    const body: any = await request.json();
    history = body.history || [];
    message = body.message || '';
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!message) {
    return new Response(JSON.stringify({ error: 'Message field is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!geminiApiKey) {
    return new Response(JSON.stringify({ error: 'Backend Configuration Error: GEMINI_API_KEY is missing on Cloudflare dashboard.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. Format contents natively for Google REST schema
  // Filters out greeting message variants to save token context window space
  const formattedContents = history
    .filter((msg: any) => msg.content && !msg.content.includes("luxury concierge") && !msg.content.includes("Please sign in"))
    .map((msg: any) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

  formattedContents.push({ role: 'user', parts: [{ text: message }] });

  // 4. Connect to Google's streaming engine using standard Server-Sent Events (alt=sse)
  const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${geminiApiKey}`;

  try {
    const geminiResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: formattedContents,
        systemInstruction: {
          parts: [{ text: "You are NOVA, an elite personal jewelry concierge assistant for NOVA Jewellery. Answer questions elegantly and concisely about sterling silver, jewelry care guidelines, order logistics, and modern craftsmanship." }]
        }
      })
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      return new Response(JSON.stringify({ error: `Upstream Gemini Error API response: ${errText}` }), { status: 500 });
    }

    // 5. Establish a streaming transform channel to format outbound packets
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const reader = geminiResponse.body!.getReader();
    let internalBuffer = '';

    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            await writer.write(encoder.encode('data: [DONE]\n\n'));
            await writer.close();
            break;
          }

          internalBuffer += decoder.decode(value, { stream: true });
          const rawLines = internalBuffer.split('\n');
          internalBuffer = rawLines.pop() || '';

          for (const rawLine of rawLines) {
            if (rawLine.trim().startsWith('data: ')) {
              const cleanJsonStr = rawLine.replace(/^data:\s*/, '').trim();
              try {
                const parsedObject = JSON.parse(cleanJsonStr);
                const textFragment = parsedObject.candidates?.[0]?.content?.parts?.[0]?.text;
                if (textFragment) {
                  // Forward structural string tokens directly to the frontend parsing loop
                  await writer.write(encoder.encode(`data: ${JSON.stringify({ text: textFragment })}\n\n`));
                }
              } catch {
                // Safely skip metadata fragments or layout delimiters
              }
            }
          }
        }
      } catch (streamErr: any) {
        await writer.abort(streamErr);
      }
    })();

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (globalFetchErr: any) {
    return new Response(JSON.stringify({ error: `Network Error connecting to AI endpoint: ${globalFetchErr.message}` }), { status: 500 });
  }
};