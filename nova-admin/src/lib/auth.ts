const SECRET_KEY = process.env.JWT_SECRET || 'nova_luxury_jewelry_secret_key_129584285';
const encoder = new TextEncoder();

function base64urlEncode(str: string): string {
  const binaryString = String.fromCharCode(...encoder.encode(str));
  return btoa(binaryString)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const keyBuf = encoder.encode(secret);
  return crypto.subtle.importKey(
    "raw",
    keyBuf,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signToken(payload: any): Promise<string> {
  const header = base64urlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64urlEncode(JSON.stringify({ ...payload, exp: Date.now() + 3600000 * 8 })); // 8 hours expiry
  
  const key = await getHmacKey(SECRET_KEY);
  const dataBuf = encoder.encode(`${header}.${body}`);
  const sigBuf = await crypto.subtle.sign("HMAC", key, dataBuf);
  
  const hashArray = Array.from(new Uint8Array(sigBuf));
  const hashString = String.fromCharCode(...hashArray);
  const signature = btoa(hashString)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
    
  return `${header}.${body}.${signature}`;
}

export async function verifyToken(token: string): Promise<any | null> {
  try {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) return null;
    
    const key = await getHmacKey(SECRET_KEY);
    const dataBuf = encoder.encode(`${header}.${body}`);
    
    // Decode signature back to Uint8Array
    const sigBase64 = signature.replace(/-/g, "+").replace(/_/g, "/");
    const sigBinary = atob(sigBase64);
    const sigBytes = new Uint8Array(sigBinary.length);
    for (let i = 0; i < sigBinary.length; i++) {
      sigBytes[i] = sigBinary.charCodeAt(i);
    }
    
    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, dataBuf);
    if (!isValid) return null;
    
    const payload = JSON.parse(base64urlDecode(body));
    if (payload.exp < Date.now()) return null;
    
    return payload;
  } catch (e) {
    return null;
  }
}
