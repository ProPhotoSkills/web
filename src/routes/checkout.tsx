import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Clock, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — ProPhotoSkills" },
      { name: "description", content: "Sichere dir den ProPhotoSkills-Komplettzugang für €299." },
      { property: "og:title", content: "Checkout — ProPhotoSkills" },
      { property: "og:description", content: "Sichere dir den ProPhotoSkills-Komplettzugang für €299." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

const features = [
  "135 Kapitel & Artikel",
  "9 spezialisierte Module",
  "Sofortiger Zugriff nach Kauf",
  "Lebenslanger Zugang",
  "Regelmäßige Updates",
  "14 Tage Geld-zurück-Garantie",
];

function CheckoutPage() {
  function handleNotifyMe() {
    toast.success("Wir benachrichtigen dich, sobald der Kauf live ist.");
  }

  return (
    <div className="container-pps flex flex-1 items-start justify-center py-12">
      <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Link
            to="/"
            className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Startseite
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Dein Zugang wartet
          </h1>
          <p className="mt-4 text-muted-foreground">
            Einmalig €299 — danach gehören dir alle 135 Kapitel in 9 Modulen
            lebenslang.
          </p>

          <div className="mt-8 space-y-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4 rounded-lg border border-border/50 p-4">
            <Shield className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Sichere Zahlung</p>
              <p className="text-xs text-muted-foreground">
                SSL-verschlüsselt über Paddle.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <Badge variant="secondary" className="mx-auto w-fit">
                Einmaliger Kauf
              </Badge>
              <CardTitle className="text-2xl mt-2">ProPhotoSkills</CardTitle>
              <CardDescription>Komplettzugang</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <span className="text-5xl font-extrabold text-foreground">€299</span>
                <span className="text-muted-foreground"> / einmalig</span>
              </div>
              <Button className="w-full" size="lg" onClick={handleNotifyMe}>
                <Mail className="mr-2 h-4 w-4" />
                Benachrichtige mich
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Die Zahlungsabwicklung wird in Kürze hinzugefügt.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
