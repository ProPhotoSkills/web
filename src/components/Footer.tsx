export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background py-12">
      <div className="container-pps flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ProPhotoSkills. Alle Rechte vorbehalten.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground">
            Impressum
          </a>
          <a href="#" className="hover:text-foreground">
            Datenschutz
          </a>
          <a href="#" className="hover:text-foreground">
            AGB
          </a>
        </div>
      </div>
    </footer>
  );
}
