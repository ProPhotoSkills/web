// Digistore24 "Lizenzserver"-Endpoint (v2 — rein kosmetisch)
// Ablage: src/routes/api/digistore-license.ts
//
// WICHTIG: Dieser Endpoint legt KEINE Accounts mehr an und schreibt NICHTS
// in die Datenbank. Grund: der Lizenzserver-Aufruf von Digistore24 enthält
// (anders als zunächst angenommen) kein zuverlässiges "ist das ein
// Testkauf?"-Feld — echte Freischaltung passiert ausschließlich über den
// signierten, test-bewussten IPN-Webhook (digistore-ipn.ts).
//
// Dieser Endpoint sorgt nur noch dafür, dass auf Digistores eigener
// Bestellbestätigungsseite/-mail ein freundlicher Hinweistext erscheint.

import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/digistore-license")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        const bodyText = await request.text();
        const params = Object.fromEntries(new URLSearchParams(bodyText));

        // Nur protokollieren, falls die Verbindung zur DB steht — sonst
        // trotzdem antworten, das Protokollieren ist hier nur "nice to have".
        if (supabaseUrl && serviceRoleKey) {
          try {
            const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
              auth: { persistSession: false, autoRefreshToken: false },
            });
            await supabaseAdmin.from("digistore_ipn_log").insert({
              order_id: params.order_id ?? null,
              email: params.email ?? null,
              event: "license_server_display_only",
              signature_valid: false,
              payload: params,
            });
          } catch (err) {
            console.error("[digistore-license] Logging fehlgeschlagen", err);
          }
        }

        return jsonResponse({
          status: "success",
          key: "Dein Zugang wird gerade eingerichtet. Du bekommst in Kürze eine separate E-Mail mit dem Aktivierungslink für deinen ProPhotoSkills-Zugang.",
          data: [],
          headline: "Dein ProPhotoSkills-Zugang",
          show_on: ["receipt_page", "order_confirmation_email"],
        });
      },
    },
  },
});

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
