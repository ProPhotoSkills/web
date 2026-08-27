const FOOTER_LOGO =
  "https://prophotoskills.github.io/pps-assets/images/LogoProPS_4_447x69_Footer.png";

const SOCIALS = [
  { name: "Facebook", href: "https://www.facebook.com/ProPhotoSkills", icon: "facebook.svg" },
  { name: "TikTok", href: "https://www.tiktok.com/@prophotoskills.com", icon: "tiktok.svg" },
  { name: "Instagram", href: "https://www.instagram.com/pro.photo.skills/", icon: "instagram.svg" },
  { name: "YouTube", href: "#", icon: "youtube.svg" },
  { name: "Pinterest", href: "https://es.pinterest.com/prophotoskills/", icon: "pinterest.svg" },
];

const PRODUCTS = [
  { label: "KI-Coach", href: "https://app.prophotoskills.workers.dev/" },
  { label: "Photoguide NextLevel", href: "https://nextlevel.prophotoskills.com/" },
  { label: "Photoguide Beginner", href: "https://prophotoskills.github.io/pps/photoguide_beginner" },
  { label: "Photoguide OnLocation", href: "https://onlocation.prophotoskills.com/" },
  { label: "MemberAbo", href: "https://memberabo.prophotoskills.com/" },
  { label: "Shop", href: "https://prophotoskills.github.io/pps/shop" },
  { label: "1st Assistant Program", href: "https://prophotoskills.github.io/pps/1st-assistant_program" },
  { label: "Guidelines", href: "https://prophotoskills.github.io/pps/guidelines" },
  { label: "Affiliate", href: "https://prophotoskills.github.io/pps/affiliate/" },
];

const SYSTEM = [
  { label: "KNOWLEDGE", href: "https://prophotoskills.github.io/pps/knowledge/", color: "var(--knowledge)" },
  { label: "TECHNIK", href: "https://prophotoskills.github.io/pps/technik/", color: "var(--technik)" },
  { label: "PROGRESS", href: "https://prophotoskills.github.io/pps/progress/", color: "var(--progress)" },
  { label: "SKILL", href: "https://prophotoskills.github.io/pps/skill/", color: "var(--skill)" },
  { label: "PSYCHO", href: "https://prophotoskills.github.io/pps/psycho/", color: "var(--psycho)" },
  { label: "TRAVEL", href: "https://prophotoskills.github.io/pps/travel/", color: "var(--travel)" },
  { label: "LOCATION", href: "https://prophotoskills.github.io/pps/location/", color: "var(--location)" },
  { label: "INSURANCE", href: "https://prophotoskills.github.io/pps/insurance/", color: "var(--insurance)" },
  { label: "EQUIPMENT", href: "https://prophotoskills.github.io/pps/equipment/", color: "var(--equipment)" },
];

export function Footer() {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="container-pps grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <img src={FOOTER_LOGO} alt="ProPhotoSkills" className="h-12 w-auto" loading="lazy" />
          <h4 className="mt-6 text-lg font-bold text-brand-red">
            Your journey as a professional starts here …
          </h4>
          <a
            href="mailto:support@prophotoskills.com"
            className="mt-4 inline-block text-sm text-footer-muted hover:text-footer-foreground"
          >
            support@prophotoskills.com
          </a>

          <p className="mt-8 text-xs font-semibold tracking-widest text-footer-muted">
            FOLLOW US
          </p>
          <div className="mt-3 flex items-center gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.name}
                className="opacity-80 transition-opacity hover:opacity-100"
              >
                <img
                  src={`https://prophotoskills.github.io/pps-assets/images/${s.icon}`}
                  alt={s.name}
                  className="h-6 w-6"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-base font-bold">ProPhotoSkills Products</h4>
          <ul className="mt-4 space-y-2 text-sm text-footer-muted">
            {PRODUCTS.map((p) => (
              <li key={p.label}>
                <a href={p.href} className="hover:text-footer-foreground">
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-base font-bold">PPS System</h4>
          <ul className="mt-4 space-y-2 text-sm font-bold">
            {SYSTEM.map((s) => (
              <li key={s.label}>
                <a href={s.href} style={{ color: s.color }} className="hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <h4 className="mt-8 text-base font-bold">ProPhotoSkills</h4>
          <ul className="mt-3 space-y-2 text-sm text-footer-muted">
            <li>
              Impressum{" "}
              <a href="https://prophotoskills.github.io/pps/impressum" className="hover:text-footer-foreground">DE</a>
              /
              <a href="https://prophotoskills.github.io/pps/site-notice" className="hover:text-footer-foreground">EN</a>
            </li>
            <li>
              Datenschutz{" "}
              <a href="https://prophotoskills.github.io/pps/datenschutz" className="hover:text-footer-foreground">DE</a>
              /
              <a href="https://prophotoskills.github.io/pps/privacy-policy" className="hover:text-footer-foreground">EN</a>
            </li>
            <li>
              <a href="https://prophotoskills.github.io/pps/about_us/" className="hover:text-footer-foreground">About Us</a>
            </li>
            <li>
              <a href="https://prophotoskills.github.io/pps/faq" className="hover:text-footer-foreground">FAQs</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <p className="container-pps text-center text-xs text-footer-muted">
          All Rights Reserved ©{new Date().getFullYear()} – Pro Photo Skills –{" "}
          <em>Recherche-Assistenz: KI | Redaktion &amp; Haltung: Eric P.</em>
        </p>
      </div>
    </footer>
  );
}
