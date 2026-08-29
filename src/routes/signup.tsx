import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Registrieren — ProPhotoSkills" },
      { name: "description", content: "Erstelle deinen ProPhotoSkills-Account und sichere dir den Zugriff auf alle Kurse." },
      { property: "og:title", content: "Registrieren — ProPhotoSkills" },
      { property: "og:description", content: "Erstelle deinen ProPhotoSkills-Account und sichere dir den Zugriff auf alle Kurse." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setIsConfirmed(true);
  }

  async function handleGoogleSignup() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });

    if (result.error) {
      toast.error(result.error.message || "Google-Registrierung fehlgeschlagen");
    }
  }

  return (
    <div className="container-pps flex flex-1 items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Konto erstellen</CardTitle>
          <CardDescription>
            Registriere dich, um ProPhotoSkills zu kaufen und auf alle Inhalte
            zuzugreifen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isConfirmed ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Bestätige deine E-Mail
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Wir haben dir einen Link an <strong>{email}</strong> geschickt.
                Klicke darauf, um deinen Account zu aktivieren.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Bereits bestätigt?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Hier anmelden
                </Link>
              </p>
            </div>
          ) : (
            <>


              <form onSubmit={handleEmailSignup} className="space-y-4">
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
                  {isLoading ? "Wird erstellt..." : "Account erstellen"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Bereits registriert?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Hier anmelden
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
