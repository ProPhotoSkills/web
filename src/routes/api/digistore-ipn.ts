// Digistore24 IPN-Webhook
// Ablage: src/routes/api/digistore-ipn.ts
//
// Was hier passiert, bei jeder eingehenden Digistore24-Zahlungsbenachrichtigung:
//   1) Signatur prüfen (SHA512, exakt nach Digistore24-eigenem Referenzverfahren)
//   2) Rohdaten in digistore_ipn_log protokollieren (immer, auch bei ungültiger Signatur)
//   3) Bei Event "on_payment": Supabase-Account per E-Mail anlegen/wiederfinden,
//      dann has_access=true setzen
//   4) Antwort exakt "OK" zurückgeben — nur dann sieht Digistore die Zustellung als erfolgreich an
//
// Benötigte Secrets (in Lovable: Cloud → Secrets, oder Cloudflare Runtime-Variablen):
//   DIGISTORE_SHA_PASSPHRASE   — die SHA-Passphrase aus deinem Digistore24-Vendor-Konto
//   SUPABASE_URL               — schon vorhanden
//   SUPABASE_SERVICE_ROLE_KEY  — NEU, siehe Hinweis unten

import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

// Digistore24 sendet die Weiterleitung nach der Aktivierung standardmäßig hierhin.
// Sobald /activate existiert (Schritt 4), diese URL final bestätigen.
const ACTIVATION_REDIRECT_URL = "https://pps-web-login.lovable.app/activate";

/**
 * Berechnet die SHA512-Signatur exakt nach Digistore24s eigenem Referenzverfahren:
 * Parameter (außer sha_sign) case-sensitiv alphabetisch sortieren, leere Werte
 * überspringen, "KEY=VALUE<passphrase>" aneinanderhängen, SHA512 hashen, GROSS schreiben.
 */
async function verifyDigistoreSignature(
  passphrase: string,
  params: Record<string, string>,
): Promise<boolean> {
  const provided = params['sha_sign'];
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
        const passphrase = process.env['DIGISTORE_SHA_PASSPHRASE'];
        const supabaseUrl = process.env['SUPABASE_URL'];
        const serviceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

        if (!passphrase || !supabaseUrl || !serviceRoleKey) {
          console.error("[digistore-ipn] Fehlende Env-Variable(n)");
          return new Response("Server missing env", { status: 500 });
        }

        // Digistore24 sendet die IPN wahlweise als POST-Formular oder mit
        // Query-Parametern in der URL — beides abdecken.
        const contentType = request.headers.get("content-type") ?? "";
        let params: Record<string, string> = {};
        if (contentType.includes("application/x-www-form-urlencoded")) {
          const bodyText = await request.text();
          params = Object.fromEntries(new URLSearchParams(bodyText));
        } else {
          const url = new URL(request.url);
          params = Object.fromEntries(url.searchParams);
        }

        // service_role-Key: voller DB-Zugriff, umgeht RLS. Deshalb NIE im
        // Frontend verwenden — nur hier, server-seitig.
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const signatureValid = await verifyDigistoreSignature(passphrase, params);

        // Immer protokollieren — gültig oder nicht. Wichtig fürs Debuggen beim
        // Einrichten in Digistore24 (Testmodus, IPN-Log dort vergleichen).
        await supabaseAdmin.from("digistore_ipn_log").insert({
          order_id: params['order_id'] ?? null,
          email: params['email'] ?? params['buyer_email'] ?? null,
          event: params['event'] ?? null,
          signature_valid: signatureValid,
          payload: params,
        });

        if (!signatureValid) {
          console.warn("[digistore-ipn] Ungültige Signatur", { order_id: params['order_id'] });
          return new Response("Invalid signature", { status: 401 });
        }

        // Nur auf erfolgreiche Zahlungen reagieren. Digistore24 schickt auch
        // andere Events (Rückerstattung, ausgebliebene Zahlung, Affiliate...).
        if (params['event'] !== "on_payment") {
          return new Response("OK");
        }

        const email = params['email'] ?? params['buyer_email'];
        const orderId = params['order_id'];
        if (!email || !orderId) {
          console.error("[digistore-ipn] email oder order_id fehlt im Payload");
          return new Response("Missing email/order_id", { status: 400 });
        }

        // Idempotenz: diese Order schon mal verarbeitet? (Digistore wiederholt
        // fehlgeschlagene IPNs bis zu 20x über 10 Tage.)
        const { data: existingOrder } = await supabaseAdmin
          .from("user_access")
          .select("id")
          .eq("digistore_order_id", orderId)
          .maybeSingle();
        if (existingOrder) {
          return new Response("OK");
        }

        // Bestehenden Account per E-Mail suchen, sonst per Einladung neu anlegen.
        // Hinweis: listUsers() ist bei sehr vielen Nutzern (>1000) nicht mehr
        // zuverlässig vollständig — für die aktuelle Nutzerzahl unproblematisch.
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

        // Zugriff freischalten. onConflict auf user_id, weil user_access dort
        // einen UNIQUE-Constraint hat.
        const { error: upsertError } = await supabaseAdmin.from("user_access").upsert(
          {
            user_id: userId,
            has_access: true,
            digistore_order_id: orderId,
            digistore_product_id: params['product_id'] ?? null,
            granted_via: "digistore_ipn",
            granted_at: new Date().toISOString(),
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
