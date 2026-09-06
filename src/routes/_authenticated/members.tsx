import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { LogOut, Lock, Unlock, ArrowRight } from "lucide-react";

const CONTENT_URL = "https://prophotoskills.github.io/content/";

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

type AccessRow = {
  id: string;
  user_id: string;
  has_access: boolean;
};

function MembersPage() {
  useEffect(() => {
    window.location.replace(CONTENT_URL);
  }, []);

  return (
    <div className="container-pps flex flex-1 items-center justify-center py-12">
      <p className="text-muted-foreground">Kurs wird geöffnet...</p>
    </div>
  );
}
