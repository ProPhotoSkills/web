import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Anmelden — ProPhotoSkills" },
      { name: "description", content: "Melde dich bei ProPhotoSkills an, um auf deinen Kurs zuzugreifen." },
      { property: "og:title", content: "Anmelden — ProPhotoSkills" },
      { property: "og:description", content: "Melde dich bei ProPhotoSkills an, um auf deinen Kurs zuzugreifen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    const { data: access } = await supabase
      .from("user_access")
      .select("has_access")
      .maybeSingle();

    if (access?.has_access) {
      window.location.href = "https://prophotoskills.github.io/content/";
      return;
    }
    router.navigate({ to: "/members" });
  }

  async function handleGoogleLogin() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });

    if (result.error) {
      toast.error(result.error.message || "Google-Anmeldung fehlgeschlagen");
    }
  }

  return (
    <div className="container-pps flex flex-1 items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Willkommen zurück</CardTitle>
          <CardDescription>
            Melde dich an, um auf deinen ProPhotoSkills-Zugang zuzugreifen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            type="button"
          >
            Mit Google fortfahren
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">oder</span>
            <Separator className="flex-1" />
          </div>

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
            <a
              href="https://memberabo.prophotoskills.com/"
              className="font-medium text-primary hover:underline"
            >
              Jetzt registrieren
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
