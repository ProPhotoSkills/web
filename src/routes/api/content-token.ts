// Ablage: src/routes/api/content-token.ts
//
// Wird von der /members-Seite aufgerufen, NACHDEM has_access=true bestätigt ist.
// Stellt einen signierten, 24h gültigen Token aus, den content-gate akzeptiert.
//
// Benötigtes neues Secret (Cloudflare → web → Runtime variables and secrets):
//   CONTENT_ACCESS_SECRET   — MUSS identisch mit dem Wert im content-gate-Worker sein
//   CONTENT_BASE_URL        — z.B. https://content-gate.<euer-account>.workers.dev (optional, hat Default)

import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function createContentToken(secret: string, userId: string, ttlSeconds: number): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = JSON.stringify({ uid: userId, exp });
  const payloadB64 = base64UrlEncode(new TextEncoder().encode(payload));

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  const sigB64 = base64UrlEncode(new Uint8Array(sigBuffer));

  return `${payloadB64}.${sigB64}`;
}

export const Route = createFileRoute("/api/content-token")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("authorization") ?? "";
        const accessToken = authHeader.replace(/^Bearer\s+/i, "");
        if (!accessToken) {
          return new Response("Unauthorized", { status: 401 });
        }

        const supabaseUrl = process.env['SUPABASE_URL'];
        const publishableKey = process.env['SUPABASE_PUBLISHABLE_KEY'];
        const contentSecret = process.env['CONTENT_ACCESS_SECRET'];
        const contentBaseUrl = process.env['CONTENT_BASE_URL'] ?? "https://content-gate.workers.dev";

        if (!supabaseUrl || !publishableKey || !contentSecret) {
          console.error("[content-token] Fehlende Env-Variable(n)");
          return new Response("Server missing env", { status: 500 });
        }

        // Client im Namen des anfragenden Nutzers — RLS-Policy "Users can read
        // own access" reicht hier aus, kein service_role nötig.
        const supabase = createClient(supabaseUrl, publishableKey, {
          global: { headers: { Authorization: `Bearer ${accessToken}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
        if (userError || !userData?.user) {
          return new Response("Invalid session", { status: 401 });
        }

        const { data: access } = await supabase
          .from("user_access")
          .select("has_access")
          .eq("user_id", userData.user.id)
          .maybeSingle();

        if (!access?.has_access) {
          return new Response("No access", { status: 403 });
        }

        const token = await createContentToken(contentSecret, userData.user.id, 60 * 60 * 24);

        return Response.json({ url: `${contentBaseUrl}/?token=${token}` });
      },
    },
  },
});
