// Digistore24 "Lizenzserver"-Endpoint
// Ablage: src/routes/api/digistore-license.ts
//
// Einfacherer Weg als der volle IPN-Webhook: Digistore24 ruft diese URL nach
// jedem Kauf selbst auf und zeigt unsere Antwort automatisch auf der eigenen
// Bestellbestätigungsseite UND in der Bestellbestätigungsmail an — wir müssen
// selbst keine Mail verschicken.
//
// Einrichtung bei Digistore24 (pro Produkt):
//   Vendor-Ansicht → Meine Produkte → Produktliste → Stift-Icon → Tab "Ausliefern"
//   → Dropdown "Dein Lizenzserver" → Lizenzserver-URL:
//   https://web.prophotoskills.workers.dev/api/digistore-license
//
// WICHTIG, laut Digistore24-Doku: dieser Aufruf ist NICHT signaturgeschützt
// (anders als der reguläre IPN-Webhook). Der einzige Schutz ist, dass die URL
// nicht öffentlich bekannt ist. Für den Start okay, mittelfristig auf den
// robusteren digistore-ipn.ts-Weg umsteigen oder hier zusätzliche Prüfungen
// ergänzen.
//
// Benötigte Secrets (dieselben wie bei digistore-ipn.ts):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/digistore-license")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
          console.error("[digistore-license] Fehlende Env-Variable(n)");
          return jsonResponse({ status: "error", error: "server misconfigured" }, 500);
        }

        // Digistore24 sendet die Daten als klassisches POST-Formular.
        const bodyText = await request.text();
        const params = Object.fromEntries(new URLSearchParams(bodyText));

        const email = params.email;
        const orderId = params.order_id;
        const productId = params.product_id;
        const apiMode = params.api_mode; // "live" oder "test"

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        // Jede eingehende Anfrage protokollieren — bei diesem Endpoint
        // besonders wichtig, weil es (anders als beim IPN) keine
        // Signaturprüfung gibt und wir im Nachhinein sehen wollen, was
        // wirklich reinkam.
        await supabaseAdmin.from("digistore_ipn_log").insert({
          order_id: orderId ?? null,
          email: email ?? null,
          event: `license_server:${apiMode ?? "unknown"}`,
          signature_valid: false, // dieser Weg hat keine Signatur, bewusst false
          payload: params,
        });

        if (!email || !orderId) {
          return jsonResponse({ status: "error", error: "missing email or order_id" }, 400);
        }

        // Testbestellungen (api_mode=test) nicht in echte Konten verwandeln.
        if (apiMode === "test") {
          return jsonResponse({
            status: "success",
            key: "Testbestellung — kein echter Zugang wurde angelegt.",
            data: [],
            headline: "Testmodus",
            show_on: ["receipt_page"],
          });
        }

        // Schon verarbeitet? (Digistore kann denselben Aufruf wiederholen.)
        const { data: existingOrder } = await supabaseAdmin
          .from("user_access")
          .select("user_id")
          .eq("digistore_order_id", orderId)
          .maybeSingle();

        let userId: string;

        if (existingOrder) {
          userId = existingOrder.user_id as string;
        } else {
          const { data: userList, error: listError } = await supabaseAdmin.auth.admin.listUsers({
            perPage: 1000,
          });
          if (listError) {
            console.error("[digistore-license] listUsers fehlgeschlagen", listError.message);
            return jsonResponse({ status: "error", error: "user lookup failed" }, 500);
          }

          const existingUser = userList.users.find(
            (u) => u.email?.toLowerCase() === email.toLowerCase(),
          );

          if (existingUser) {
            userId = existingUser.id;
          } else {
            const { data: invited, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
              email,
              { redirectTo: "https://web.prophotoskills.workers.dev/activate" },
            );
            if (inviteError || !invited?.user) {
              console.error("[digistore-license] Einladung fehlgeschlagen", inviteError?.message);
              return jsonResponse({ status: "error", error: "invite failed" }, 500);
            }
            userId = invited.user.id;
          }

          const { error: upsertError } = await supabaseAdmin.from("user_access").upsert(
            {
              user_id: userId,
              has_access: true,
              digistore_order_id: orderId,
              digistore_product_id: productId ?? null,
              granted_via: "digistore_license",
              granted_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );
          if (upsertError) {
            console.error("[digistore-license] user_access upsert fehlgeschlagen", upsertError.message);
            return jsonResponse({ status: "error", error: "db error" }, 500);
          }
        }

        // Supabase hat bei einer Einladung bereits automatisch eine E-Mail
        // mit dem Aktivierungslink verschickt. Zusätzlich zeigen wir hier
        // einen einfachen Hinweistext auf Digistores eigener Seite/Mail an —
        // ohne den Link selbst zu wiederholen, da inviteUserByEmail keinen
        // eigenen Link zurückgibt, den man zweimal verschicken könnte.
        return jsonResponse({
          status: "success",
          key: "Dein Zugang ist bereit! Bitte prüfe dein E-Mail-Postfach (auch den Spam-Ordner) für den Link zur Aktivierung deines ProPhotoSkills-Zugangs.",
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
