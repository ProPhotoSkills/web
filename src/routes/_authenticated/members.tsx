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
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MembersPage,
});

type AccessRow = {
  id: string;
  user_id: string;
  has_access: boolean;
};

function MembersPage() {
  const { user, loading: authLoading } = useAuth();
  const [access, setAccess] = useState<AccessRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccess() {
      const currentUser = user;
      if (!currentUser) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("user_access")
        .select("id, user_id, has_access")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (error) {
        toast.error("Fehler beim Laden deines Zugriffsstatus");
        setLoading(false);
        return;
      }

      if (data) {
        setAccess(data);
      } else {
        const { data: created, error: insertError } = await supabase
          .from("user_access")
          .insert({ user_id: currentUser.id, has_access: false })
          .select("id, user_id, has_access")
          .single();

        if (insertError) {
          toast.error("Fehler beim Anlegen deines Accounts");
        } else {
          setAccess(created);
        }
      }
      setLoading(false);
    }

    loadAccess();
  }, [user]);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (authLoading || loading) {
    return (
      <div className="container-pps flex flex-1 items-center justify-center py-12">
        <p className="text-muted-foreground">Wird geladen...</p>
      </div>
    );
  }

  const hasAccess = access?.has_access ?? false;

  return (
    <div className="container-pps py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Willkommen, {user?.email?.split("@")[0] || "Fotograf"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Dein ProPhotoSkills-Account.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={hasAccess ? "default" : "secondary"} className="gap-1">
            {hasAccess ? (
              <>
                <Unlock className="h-3 w-3" />
                Freigeschaltet
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" />
                Gesperrt
              </>
            )}
          </Badge>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Abmelden
          </Button>
        </div>
      </div>

      {!hasAccess ? (
        <Card className="border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Noch kein Zugriff freigeschaltet
            </h2>
            <p className="mt-2 text-muted-foreground">
              Kaufe jetzt den ProPhotoSkills-Komplettzugang, um alle 135 Kapitel
              in 9 Modulen freizuschalten.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/checkout">Zugang freischalten</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Dein Zugang ist freigeschaltet
            </h2>
            <p className="mt-2 text-muted-foreground">
              Öffne jetzt deinen kompletten Kurs.
            </p>
            <Button size="lg" className="mt-6" asChild>
              <a href={CONTENT_URL} target="_blank" rel="noopener noreferrer">
                Kurs öffnen
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Probleme beim Zugriff?{" "}
          <Link to="/" className="font-medium text-primary hover:underline">
            Support kontaktieren
          </Link>
        </p>
      </div>
    </div>
  );
}
