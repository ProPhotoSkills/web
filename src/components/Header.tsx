import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Header() {
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
            href="#modules"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Module
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Preis
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Anmelden</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/signup">Kaufen</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
