// Digistore24 IPN-Webhook (v3 — jetzt mit Zugriffsentzug)
// Ablage: src/routes/api/digistore-ipn.ts
//
// Ereignisse, die aktiv behandelt werden:
//   on_payment        → Account anlegen/finden, has_access = true
//   last_paid_day     → has_access = false (Digistore24s offizielle Empfehlung
//                        für sowohl Kündigung als auch Rückgabe — der Kunde
//                        behält Zugriff bis zum Ende der bezahlten Periode,
//                        erst DANN kommt dieses Ereignis)
//   on_refund         → has_access = false (zusätzliche Absicherung)
//   on_chargeback     → has_access = false (sofort, keine Kulanzfrist)
//
// Bewusst NICHT behandelt (laut Digistore24-Doku falsch für Zugriffssperren):
//   on_payment_missed → nur ein Zahlungsversuch schlägt fehl, kein Endzustand
//   on_rebill_cancelled → Kunde hat gekündigt, behält aber Zugriff bis
//                          last_paid_day
//   alle anderen Events → werden geloggt, sonst ignoriert, Antwort "OK"
//
// Benötigte Secrets (Cloudflare Runtime-Variablen bei web):
//   DIGISTORE_SHA_PASSPHRASE   — das "IPN-Kennwort" aus der Digistore24-Anbindung
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const ACTIVATION_REDIRECT_URL = "https://web.prophotoskills.workers.dev/activate";

const GRANT_EVENTS = new Set(["on_payment"]);
const REVOKE_EVENTS = new Set(["last_paid_day", "on_refund", "on_chargeback"]);

/**
 * Berechnet die SHA512-Signatur exakt nach Digistore24s eigenem Referenzverfahren:
 * Parameter (außer sha_sign) case-sensitiv alphabetisch sortieren, leere Werte
 * überspringen, "KEY=VALUE<passphrase>" aneinanderhängen, SHA512 hashen, GROSS schreiben.
 */
async function verifyDigistoreSignature(
  passphrase: string,
  params: Record<string, string>,
): Promise<boolean> {
  const provided = params["sha_sign"];
  if (!provided) return false;

  const entries = Object.entries(params).filter(([key, value]) => {
    if (key === "sha_sign" || key === "SHASIGN") return false;
    return value !== undefined && value !== null && value !== "";
  });
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

  let shaString = "";
  for (const [key, value] of entries) {
    shaString += `${key}=${value}${passphrase}`;
  }

  const digestBuffer = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(shaString));
  const digestHex = Array.from(new Uint8Array(digestBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return digestHex.toUpperCase() === provided.toUpperCase();
}

export const Route = createFileRoute("/api/digistore-ipn")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const passphrase = process.env["DIGISTORE_SHA_PASSPHRASE"];
        const supabaseUrl = process.env["SUPABASE_URL"];
        const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

        if (!passphrase || !supabaseUrl || !serviceRoleKey) {
          console.error("[digistore-ipn] Fehlende Env-Variable(n)");
          return new Response("Server missing env", { status: 500 });
        }

        const contentType = request.headers.get("content-type") ?? "";
        let params: Record<string, string> = {};
        if (contentType.includes("application/x-www-form-urlencoded")) {
          const bodyText = await request.text();
          params = Object.fromEntries(new URLSearchParams(bodyText));
        } else {
          const url = new URL(request.url);
          params = Object.fromEntries(url.searchParams);
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const signatureValid = await verifyDigistoreSignature(passphrase, params);
        const event = params["event"] ?? null;

        await supabaseAdmin.from("digistore_ipn_log").insert({
          order_id: params["order_id"] ?? null,
          email: params["email"] ?? params["buyer_email"] ?? null,
          event,
          signature_valid: signatureValid,
          payload: params,
        });

        if (!signatureValid) {
          console.warn("[digistore-ipn] Ungültige Signatur", { order_id: params["order_id"] });
          return new Response("Invalid signature", { status: 401 });
        }

        const orderId = params["order_id"];
        const apiMode = params["api_mode"]; // 'live' oder 'test'

        // Testbestellungen protokollieren wir (s.o.), aber nie in echte
        // Freischaltungen/Sperren umsetzen.
        if (apiMode === "test") {
          return new Response("OK");
        }

        if (event && REVOKE_EVENTS.has(event)) {
          if (!orderId) {
            return new Response("OK"); // nichts zuzuordnen, aber kein Fehler
          }
          const { error: revokeError } = await supabaseAdmin
            .from("user_access")
            .update({ has_access: false, revoked_at: new Date().toISOString() })
            .eq("digistore_order_id", orderId);
          if (revokeError) {
            console.error("[digistore-ipn] Zugriffsentzug fehlgeschlagen", revokeError.message);
            return new Response(`DB error: ${revokeError.message}`, { status: 500 });
          }
          return new Response("OK");
        }

        if (!event || !GRANT_EVENTS.has(event)) {
          // Alle anderen Ereignisse (on_payment_missed, on_rebill_cancelled,
          // on_rebill_resumed, ...): bewusst keine Aktion, nur bestätigen.
          return new Response("OK");
        }

        const email = params["email"] ?? params["buyer_email"];
        if (!email || !orderId) {
          console.error("[digistore-ipn] email oder order_id fehlt im Payload");
          return new Response("Missing email/order_id", { status: 400 });
        }

        const { data: existingOrder } = await supabaseAdmin
          .from("user_access")
          .select("id")
          .eq("digistore_order_id", orderId)
          .maybeSingle();
        if (existingOrder) {
          return new Response("OK");
        }

        const { data: userList, error: listError } = await supabaseAdmin.auth.admin.listUsers({
          perPage: 1000,
        });
        if (listError) {
          console.error("[digistore-ipn] listUsers fehlgeschlagen", listError.message);
          return new Response("User lookup failed", { status: 500 });
        }

        const existingUser = userList.users.find(
          (u) => u.email?.toLowerCase() === email.toLowerCase(),
        );

        let userId: string;
        if (existingUser) {
          userId = existingUser.id;
        } else {
          const { data: invited, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
            email,
            { redirectTo: ACTIVATION_REDIRECT_URL },
          );
          if (inviteError || !invited?.user) {
            console.error("[digistore-ipn] Einladung fehlgeschlagen", inviteError?.message);
            return new Response(`Invite failed: ${inviteError?.message ?? "unknown"}`, { status: 500 });
          }
          userId = invited.user.id;
        }

        const { error: upsertError } = await supabaseAdmin.from("user_access").upsert(
          {
            user_id: userId,
            has_access: true,
            digistore_order_id: orderId,
            digistore_product_id: params["product_id"] ?? null,
            granted_via: "digistore_ipn",
            granted_at: new Date().toISOString(),
            revoked_at: null,
          },
          { onConflict: "user_id" },
        );

        if (upsertError) {
          console.error("[digistore-ipn] user_access upsert fehlgeschlagen", upsertError.message);
          return new Response(`DB error: ${upsertError.message}`, { status: 500 });
        }

        return new Response("OK");
      },
    },
  },
});
