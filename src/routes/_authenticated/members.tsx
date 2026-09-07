import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/members")({
  head: () => ({
    meta: [
      { title: "Mitgliederbereich — ProPhotoSkills" },
      { name: "description", content: "Dein ProPhotoSkills-Mitgliederbereich." },
      { property: "og:title", content: "Mitgliederbereich — ProPhotoSkills" },
      { property: "og:description", content: "Dein ProPhotoSkills-Mitgliederbereich." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pps-web-login.lovable.app/members" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://pps-web-login.lovable.app/members" }],
  }),
  component: MembersPage,
});

function MembersPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function openContent() {
      // Aktuelles Supabase-Zugriffstoken der Sitzung holen — wird als Nachweis
      // "das bin wirklich ich, eingeloggt" an /api/content-token geschickt.
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        window.location.replace("/login");
        return;
      }

      try {
        const response = await fetch("/api/content-token", {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          if (!cancelled) {
            setErrorMessage("Zugriff konnte nicht bestätigt werden. Bitte lade die Seite neu.");
          }
          return;
        }

        const { url } = (await response.json()) as { url: string };
        window.location.replace(url);
      } catch {
        if (!cancelled) {
          setErrorMessage("Verbindung fehlgeschlagen. Bitte lade die Seite neu.");
        }
      }
    }

    openContent();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container-pps flex flex-1 items-center justify-center py-12">
      <p className="text-muted-foreground">
        {errorMessage ?? "Kurs wird geöffnet..."}
      </p>
    </div>
  );
}
