import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/activate")({
  head: () => ({
    meta: [
      { title: "Zugang aktivieren — ProPhotoSkills" },
      { name: "description", content: "Aktiviere deinen ProPhotoSkills-Zugang und lege dein Passwort fest." },
      { property: "og:title", content: "Zugang aktivieren — ProPhotoSkills" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ActivatePage,
});

function ActivatePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Der Einladungslink aus der Mail übergibt die Sitzung automatisch über
    // den URL-Hash — supabase-js liest das beim Laden selbst aus.
    // Wir warten nur kurz, bis eine Session vorhanden ist, und lesen die
    // E-Mail daraus, statt sie den Kunden erneut eintippen zu lassen.
    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user?.email) {
        setErrorMessage(
          "Dieser Link ist nicht mehr gültig oder abgelaufen. Bitte fordere über den Login-Bereich einen neuen an.",
        );
        return;
      }
      setEmail(data.session.user.email);
      setIsReady(true);
    }
    loadSession();
  }, []);

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Zugang aktiviert");
    window.location.href = "/members";
  }

  return (
    <div className="relative flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Dein Zugang wartet</CardTitle>
          <CardDescription>
            Vielen Dank für deinen Kauf! Vergib nur noch ein Passwort, dann geht's direkt zu deinen Kursen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <p className="text-center text-sm text-destructive">{errorMessage}</p>
          )}

          {isReady && (
            <form onSubmit={handleActivate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" type="email" value={email ?? ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Passwort festlegen</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Wird aktiviert..." : "Zugang bestätigen"}
              </Button>
            </form>
          )}

          {!isReady && !errorMessage && (
            <p className="text-center text-sm text-muted-foreground">Lade...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
