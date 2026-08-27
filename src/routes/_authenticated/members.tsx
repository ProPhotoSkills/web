import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  Camera,
  Lightbulb,
  Settings,
  TrendingUp,
  Brain,
  Plane,
  MapPin,
  Shield,
  Briefcase,
  LogOut,
  Lock,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/members")({
  head: () => ({
    meta: [
      { title: "Mitgliederbereich — ProPhotoSkills" },
      { name: "description", content: "Dein ProPhotoSkills-Mitgliederbereich mit Zugriff auf alle Kursmodule." },
      { property: "og:title", content: "Mitgliederbereich — ProPhotoSkills" },
      { property: "og:description", content: "Dein ProPhotoSkills-Mitgliederbereich mit Zugriff auf alle Kursmodule." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MembersPage,
});

const modules = [
  { key: "knowledge", title: "Knowledge", icon: Lightbulb, url: "https://prophotoskills.github.io/content/knowledge.html" },
  { key: "technik", title: "Technik", icon: Camera, url: "https://prophotoskills.github.io/content/technik.html" },
  { key: "progress", title: "Progress", icon: TrendingUp, url: "https://prophotoskills.github.io/content/progress.html" },
  { key: "skill", title: "Skill", icon: Settings, url: "https://prophotoskills.github.io/content/skill.html" },
  { key: "psycho", title: "Psycho", icon: Brain, url: "https://prophotoskills.github.io/content/psycho.html" },
  { key: "travel", title: "Travel", icon: Plane, url: "https://prophotoskills.github.io/content/travel.html" },
  { key: "location", title: "Location", icon: MapPin, url: "https://prophotoskills.github.io/content/location.html" },
  { key: "insurance", title: "Insurance", icon: Shield, url: "https://prophotoskills.github.io/content/insurance.html" },
  { key: "equipment", title: "Equipment", icon: Briefcase, url: "https://prophotoskills.github.io/content/equipment.html" },
];

function MembersPage() {
  const { user, loading } = useAuth();

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return (
      <div className="container-pps flex flex-1 items-center justify-center py-12">
        <p className="text-muted-foreground">Wird geladen...</p>
      </div>
    );
  }

  return (
    <div className="container-pps py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Willkommen, {user?.email?.split("@")[0] || "Fotograf"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Dein Zugang zu allen ProPhotoSkills-Modulen.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <Lock className="h-3 w-3" />
            Mitglied
          </Badge>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Abmelden
          </Button>
        </div>
      </div>

      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Alle 135 Kapitel freigeschaltet
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Klicke auf ein Modul, um die Inhalte zu öffnen. Dein Fortschritt
            wird bei Bedarf später gespeichert.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.key} className="transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Klicke hier, um alle Kapitel in diesem Modul zu öffnen.
                </p>
                <Button className="mt-4 w-full" variant="outline" asChild>
                  <a href={module.url} target="_blank" rel="noopener noreferrer">
                    Modul öffnen
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
