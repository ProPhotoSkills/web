import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ProPhotoSkills — Fotografie-Kurs für Profis" },
      {
        name: "description",
        content:
          "135 Kapitel in 9 Modulen: Lerne professionelle Fotografie von Grund auf.",
      },
      {
        property: "og:title",
        content: "ProPhotoSkills — Fotografie-Kurs für Profis",
      },
      {
        property: "og:description",
        content: "135 Kapitel in 9 Modulen: Lerne professionelle Fotografie von Grund auf.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const modules = [
  {
    key: "knowledge",
    title: "Knowledge",
    count: "21 Kapitel",
    description: "Das unsichtbare Wissen vor dem ersten Klick.",
    icon: Lightbulb,
    color: "text-knowledge",
    border: "border-knowledge/30",
    bg: "bg-knowledge/10",
  },
  {
    key: "technik",
    title: "Technik",
    count: "15 Kapitel",
    description: "Kamera, Objektive, Licht und Settings verstehen.",
    icon: Camera,
    color: "text-technik",
    border: "border-technik/30",
    bg: "bg-technik/10",
  },
  {
    key: "progress",
    title: "Progress",
    count: "12 Kapitel",
    description: "Gezielt besser werden, statt nur mehr zu üben.",
    icon: TrendingUp,
    color: "text-progress",
    border: "border-progress/30",
    bg: "bg-progress/10",
  },
  {
    key: "skill",
    title: "Skill",
    count: "18 Kapitel",
    description: "Handwerkliche Fähigkeiten für jede Situation.",
    icon: Settings,
    color: "text-skill",
    border: "border-skill/30",
    bg: "bg-skill/10",
  },
  {
    key: "psycho",
    title: "Psycho",
    count: "14 Kapitel",
    description: "Menschen lesen, führen und überzeugen.",
    icon: Brain,
    color: "text-psycho",
    border: "border-psycho/30",
    bg: "bg-psycho/10",
  },
  {
    key: "travel",
    title: "Travel",
    count: "16 Kapitel",
    description: "Weltweit shooten — von Planung bis Postproduktion.",
    icon: Plane,
    color: "text-travel",
    border: "border-travel/30",
    bg: "bg-travel/10",
  },
  {
    key: "location",
    title: "Location",
    count: "13 Kapitel",
    description: "Orte finden, nutzen und sicher beherrschen.",
    icon: MapPin,
    color: "text-location",
    border: "border-location/30",
    bg: "bg-location/10",
  },
  {
    key: "insurance",
    title: "Insurance",
    count: "10 Kapitel",
    description: "Risiken minimieren und Geschäft absichern.",
    icon: Shield,
    color: "text-insurance",
    border: "border-insurance/30",
    bg: "bg-insurance/10",
  },
  {
    key: "equipment",
    title: "Equipment",
    count: "16 Kapitel",
    description: "Das richtige Gear für deinen Stil.",
    icon: Briefcase,
    color: "text-equipment",
    border: "border-equipment/30",
    bg: "bg-equipment/10",
  },
];

const features = [
  "135 Kapitel & Artikel",
  "9 spezialisierte Module",
  "Sofortiger Zugriff nach Kauf",
  "Lebenslanger Zugang",
  "Regelmäßige Updates",
  "Deutschsprachiger Kurs",
];

function HomePage() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <div className="container-pps relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6">
              Online-Fotografie-Kurs
            </Badge>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Werde der Fotograf, der Aufträge anzieht
            </h1>
            <p className="mt-6 text-balance text-lg text-muted-foreground md:text-xl">
              ProPhotoSkills verbindet Technik, Menschenkenntnis und Business.
              Mit 135 Kapiteln in 9 Modulen lernst du, wie Profis wirklich
              arbeiten.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/signup">Jetzt Zugang sichern</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#modules">Module entdecken</a>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Einmaliger Kauf. Lebenslanger Zugriff.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-pps">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { value: "135", label: "Kapitel" },
            { value: "9", label: "Module" },
            { value: "24/7", label: "Zugriff" },
            { value: "100%", label: "Praxisnah" },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-extrabold text-foreground md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="container-pps scroll-mt-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Alle 9 Module im Überblick
          </h2>
          <p className="mt-4 text-muted-foreground">
            Jeder Bereich ist ein Baustein deiner professionellen Fotografie.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.key}
                className={`group transition-all hover:-translate-y-1 hover:shadow-lg ${module.border}`}
              >
                <CardContent className="p-6">
                  <div
                    className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${module.bg}`}
                  >
                    <Icon className={`h-5 w-5 ${module.color}`} />
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {module.title}
                    </h3>
                    <span className="text-xs font-medium text-muted-foreground">
                      {module.count}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container-pps scroll-mt-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Einmal investieren. Immer dabei.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Kein Abo, keine versteckten Kosten. Du erhältst sofortigen Zugriff
            auf alle Module.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-md">
          <Card className="border-primary/20">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground">
                  ProPhotoSkills Komplettzugang
                </h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold text-foreground">
                    €299
                  </span>
                  <span className="text-muted-foreground">/ einmalig</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Inkl. aller 135 Kapitel und zukünftiger Updates
                </p>
              </div>
              <ul className="mt-8 space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full" size="lg" asChild>
                <Link to="/signup">Jetzt kaufen & loslegen</Link>
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                14 Tage Geld-zurück-Garantie
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container-pps scroll-mt-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Häufige Fragen
          </h2>
          <div className="mt-10 space-y-4">
            {[
              {
                q: "Wie bekomme ich nach dem Kauf Zugriff?",
                a: "Sofort nach der Zahlung kannst du dich anmelden und alle Module durchstöbern. Der Zugriff ist mit deinem Account dauerhaft verknüpft.",
              },
              {
                q: "Ist der Kurs für Anfänger oder Fortgeschrittene?",
                a: "Beides. Die Module bauen aufeinander auf und gehen gleichzeitig in professionelle Tiefe. Egal wo du stehst, du findest den nächsten Schritt.",
              },
              {
                q: "Gibt es Updates?",
                a: "Ja. Sobald neue Kapitel oder Module hinzukommen, sind sie für dich kostenlos verfügbar.",
              },
            ].map((item) => (
              <Card key={item.q}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground">{item.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-pps">
        <div className="rounded-2xl bg-primary px-6 py-16 text-center text-primary-foreground md:py-20">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Starte noch heute deine Fotografie-Karriere
          </h2>
          <p className="mx-auto mt-4 max-w-xl opacity-90">
            Schließe dich Tausenden Fotografen an, die mit ProPhotoSkills ihr
            Handwerk auf das nächste Level gebracht haben.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8"
            asChild
          >
            <Link to="/signup">Zugang sichern</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
