import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const LOGO_URL =
  "https://prophotoskills.github.io/pps-assets/images/ProPhotoSkills_Logo.png";

const MODULES = [
  { label: "KNOWLEDGE", href: "https://prophotoskills.github.io/content/knowledge.html", color: "var(--knowledge)" },
  { label: "TECHNIK", href: "https://prophotoskills.github.io/content/technik.html", color: "var(--technik)" },
  { label: "PROGRESS", href: "https://prophotoskills.github.io/content/progress.html", color: "var(--progress)" },
  { label: "SKILL", href: "https://prophotoskills.github.io/content/skill.html", color: "var(--skill)" },
  { label: "PSYCHO", href: "https://prophotoskills.github.io/content/psycho.html", color: "var(--psycho)" },
  { label: "TRAVEL", href: "https://prophotoskills.github.io/content/travel.html", color: "var(--travel)" },
  { label: "LOCATION", href: "https://prophotoskills.github.io/content/location.html", color: "var(--location)" },
  { label: "INSURANCE", href: "https://prophotoskills.github.io/content/insurance.html", color: "var(--insurance)" },
  { label: "EQUIPMENT", href: "https://prophotoskills.github.io/content/equipment.html", color: "var(--equipment)" },
];

export function Header() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container-pps flex h-20 items-center justify-between gap-6">
        <Link to="/" className="shrink-0">
          <img
            src={LOGO_URL}
            alt="ProPhotoSkills Logo"
            className="h-10 w-auto"
            loading="eager"
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-4 xl:flex">
          {MODULES.map((m) => (
            <a
              key={m.label}
              href={m.href}
              className="text-[11px] font-extrabold tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              style={{ ["--hover" as string]: m.color }}
            >
              <span style={{ borderBottom: `2px solid ${m.color}` }}>{m.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!loading && user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/members">Mitgliederbereich</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Abmelden
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Anmelden</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Registrieren</Link>
              </Button>
            </>
          )}
          <button
            type="button"
            aria-label="Menü"
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border xl:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background xl:hidden">
          <div className="container-pps grid gap-1 py-4 sm:grid-cols-3">
            {MODULES.map((m) => (
              <a
                key={m.label}
                href={m.href}
                className="py-2 text-xs font-extrabold tracking-wide text-foreground"
                style={{ color: m.color }}
              >
                {m.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
