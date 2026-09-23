/**
 * Produkt-Erklärung rechts neben dem Login-Fenster (2/3 Breite),
 * als zwei nebeneinanderliegende Karten. Text aus dem Memberbereich-Angebot.
 */
export function LoginProductInfo() {
  return (
    <div className="grid h-full w-full grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-2">
      <aside className="h-full rounded-xl border bg-card/90 p-6 text-card-foreground shadow-xl backdrop-blur-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b33a26]">
          Mitgliedschaft · Voller Systemzugang
        </p>
        <h2 className="mt-3 text-xl font-bold leading-tight">
          Komme in deinen ProPhotoSkills Memberbereich
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Hier wartet geballtes Fotografie-Know-how darauf, von dir entdeckt zu
          werden. Mit deiner Mitgliedschaft erhältst du exklusiven Zugriff auf
          Inhalte, die dich in allen Bereichen der Fotografie weiterbringen –
          kompakt aufbereitet, praxisnah erklärt und sofort umsetzbar. Mit vielen
          Beispielen und Tipps.
        </p>
      </aside>

      <aside className="h-full rounded-xl border bg-card/90 p-6 text-card-foreground shadow-xl backdrop-blur-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b33a26]">
          Dein Zugang
        </p>
        <h3 className="mt-3 text-xl font-bold leading-tight">
          Zwei Systeme, ein Memberbereich
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Mit deiner Mitgliedschaft schaltest du beide ProPhotoSkills-
          Wissenssysteme komplett frei – das umfassende Entwicklungssystem Next
          Level und das spezialisierte Produktionssystem On Location.
        </p>
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          Abo · 50,-/300,-€ · 6 Monate
          <br />
          Sofortiger Zugriff nach Kauf · Digistore24 Käuferschutz
        </p>
      </aside>
    </div>
  );
}
