import { GoogleGenAI } from "@google/genai";

// JWT verification helper utilizing the Web Crypto API (fully compatible with Cloudflare Workers)
async function verifyFirebaseToken(token: string, projectId: string): Promise<any> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  const base64UrlDecode = (str: string) => {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return atob(base64);
  };

  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));

  if (header.alg !== 'RS256') {
    throw new Error('Unsupported signature algorithm');
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) {
    throw new Error('Invalid issuer');
  }
  if (payload.aud !== projectId) {
    throw new Error('Invalid audience');
  }
  if (payload.exp < now) {
    throw new Error('Token expired');
  }
  if (!payload.sub) {
    throw new Error('Subject claim missing');
  }

  // Fetch Firebase public keys (JWKS)
  const jwkResponse = await fetch('https://www.googleapis.com/service_accounts/v1/jwk/securetoken-system@system.gserviceaccount.com');
  if (!jwkResponse.ok) {
    throw new Error('Failed to fetch Firebase public keys');
  }
  const jwks: any = await jwkResponse.json();

  const kid = header.kid;
  const jwk = jwks.keys.find((key: any) => key.kid === kid);
  if (!jwk) {
    throw new Error('Public key not found for kid');
  }

  const cryptoKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['verify']
  );

  const signatureBytes = new Uint8Array(
    base64UrlDecode(parts[2]).split('').map(c => c.charCodeAt(0))
  );
  const dataBytes = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);

  const isValid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    signatureBytes,
    dataBytes
  );

  if (!isValid) {
    throw new Error('Invalid signature');
  }

  return payload;
}

export const onRequestPost = async (context: any) => {
  const { request, env } = context;

  const firebaseProjectId = env.FIREBASE_PROJECT_ID;
  const geminiApiKey = env.GEMINI_API_KEY;

  const hasFirebase = firebaseProjectId && 
                      firebaseProjectId !== 'your_project_id' && 
                      firebaseProjectId !== '';

  // 1. Firebase Auth Guard
  if (hasFirebase) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized: No token provided' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];
    try {
      await verifyFirebaseToken(token, firebaseProjectId);
    } catch (err: any) {
      console.error("Firebase Verification Failed:", err.message || err);
      return new Response(JSON.stringify({ error: `Unauthorized: Invalid token (${err.message || err})` }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
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
    return new Response(JSON.stringify({ error: 'Message is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!geminiApiKey) {
    return new Response(JSON.stringify({ error: 'Gemini API key is not configured on Cloudflare' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. Format contents for Gemini SDK
  const formattedContents = history.map((msg: any) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
  formattedContents.push({ role: 'user', parts: [{ text: message }] });

  // 4. Setup SSE stream using TransformStream
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Run streaming generation asynchronously
  (async () => {
    try {
      const ai = new GoogleGenAI({
        apiKey: geminiApiKey,
      });

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: "You are NOVA, a helpful and knowledgeable jewelry assistant for NOVA Jewellery. You can answer questions about silver, jewelry care, our products, shipping, and more.",
        }
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          const sseData = `data: ${JSON.stringify({ text: chunk.text })}\n\n`;
          await writer.write(encoder.encode(sseData));
        }
      }

      await writer.write(encoder.encode('data: [DONE]\n\n'));
    } catch (err: any) {
      console.error('Gemini Stream Error:', err);
      const errData = `data: ${JSON.stringify({ error: err.message || 'Gemini error' })}\n\n`;
      try {
        await writer.write(encoder.encode(errData));
      } catch (writeErr) {
        // Ignore if writer is closed
      }
    } finally {
      try {
        await writer.close();
      } catch (err) {
        // Ignore if writer is closed
      }
    }
  })();

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
};
