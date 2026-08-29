import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CONTENT_URL = "https://prophotoskills.github.io/content/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zugang — ProPhotoSkills" },
      {
        name: "description",
        content: "Melde dich an, um deinen ProPhotoSkills-Kurs zu öffnen.",
      },
      { property: "og:title", content: "Zugang — ProPhotoSkills" },
      {
        property: "og:description",
        content: "Melde dich an, um deinen ProPhotoSkills-Kurs zu öffnen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GatePage,
});

function GatePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function goToContent() {
    const { data: access } = await supabase
      .from("user_access")
      .select("has_access")
      .maybeSingle();

    if (access?.has_access) {
      window.location.href = CONTENT_URL;
      return;
    }
    router.navigate({ to: "/members" });
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Erfolgreich angemeldet");
    await goToContent();
  }

  return (
    <div
      className="relative flex flex-1 items-center justify-center bg-cover bg-center px-4 py-16"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, color-mix(in oklab, var(--background) 45%, transparent), color-mix(in oklab, var(--background) 65%, transparent)), url('https://prophotoskills.github.io/pps-assets/images/TitelNextLevel_kk.jpg')",
      }}
    >
      <Card className="w-full max-w-md shadow-xl backdrop-blur-sm">

        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Willkommen bei ProPhotoSkills</CardTitle>
          <CardDescription>
            Melde dich an, um deinen Kurs zu öffnen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="du@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Wird angemeldet..." : "Anmelden"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Noch keinen Account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Jetzt registrieren
            </Link>
          </p>

        </CardContent>
      </Card>
    </div>
  );
}
