import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const { user, loading } = useAuth();

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container-pps flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-foreground">
            ProPhotoSkills
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="/#modules"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Module
          </a>
          <a
            href="/#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Preis
          </a>
          <a
            href="/#faq"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </a>
          {user && (
            <Link
              to="/members"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Mitgliederbereich
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
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
                <Link to="/signup">Kaufen</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
