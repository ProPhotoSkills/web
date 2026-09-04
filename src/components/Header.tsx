import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
  { code: "pt", label: "PT" },
  { code: "it", label: "IT" },
  { code: "el", label: "EL" },
  { code: "ja", label: "JA" },
] as const;

const MENU_ITEMS = [
  { label: "KNOWLEDGE", href: "https://prophotoskills.github.io/pps/knowledge/" },
  { label: "TECHNIK", href: "https://prophotoskills.github.io/pps/technik/" },
  { label: "PROGRESS", href: "https://prophotoskills.github.io/pps/progress/" },
  { label: "SKILL", href: "https://prophotoskills.github.io/pps/skill/" },
  { label: "PSYCHO", href: "https://prophotoskills.github.io/pps/psycho/" },
  { label: "TRAVEL", href: "https://prophotoskills.github.io/pps/travel/" },
  { label: "LOCATION", href: "https://prophotoskills.github.io/pps/location/" },
  { label: "INSURANCE", href: "https://prophotoskills.github.io/pps/insurance/" },
  { label: "EQUIPMENT", href: "https://prophotoskills.github.io/pps/equipment/" },
] as const;


declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

function loadTranslate(lang: string) {
  const apply = () => {
    let tries = 0;
    const iv = setInterval(() => {
      const combo = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
      if (combo) {
        combo.value = lang;
        combo.dispatchEvent(new Event("change"));
        clearInterval(iv);
      }
      if (++tries > 40) clearInterval(iv);
    }, 250);
  };

  if (window.google?.translate) {
    apply();
    return;
  }

  if (!document.getElementById("google_translate_element")) {
    const holder = document.createElement("div");
    holder.id = "google_translate_element";
    holder.hidden = true;
    document.body.appendChild(holder);
  }

  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "de",
        includedLanguages: LANGS.map((l) => l.code).join(","),
        autoDisplay: false,
      },
      "google_translate_element",
    );
    apply();
  };

  if (!document.getElementById("pps-gtranslate")) {
    const s = document.createElement("script");
    s.id = "pps-gtranslate";
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.head.appendChild(s);
  }
}

/**
 * Header im Stil der ProPhotoSkills KI-Coach-App,
 * mit ProPhotoSkills-Logo statt KI-Coach-Logo/Text.
 */
export function Header() {
  const [lang, setLang] = useState<string>("de");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("pps_lang");
    if (stored && LANGS.some((l) => l.code === stored)) setLang(stored);
  }, []);

  const selectLanguage = (code: string) => {
    setLang(code);
    localStorage.setItem("pps_lang", code);
    if (code === "de") {
      document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.reload();
      return;
    }
    document.cookie = `googtrans=/de/${code}; path=/`;
    loadTranslate(code);
  };

  return (
    <header className="relative z-50 border-b border-foreground/10 bg-[#f8e800] text-[#454545]">
      <div className="mx-auto grid min-h-24 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-x-4 px-4 pb-3 pt-5 sm:px-6 lg:grid-cols-[minmax(210px,1fr)_auto_minmax(180px,1fr)] lg:gap-x-6 lg:px-8">
        <a
          href="https://prophotoskills.github.io/pps/"
          target="_blank"
          rel="noreferrer"
          className="flex min-w-0 items-center self-center"
        >
          <img
            src="https://prophotoskills.github.io/pps-assets/images/ProPhotoSkills_Logo.png"
            alt="ProPhotoSkills Logo"
            className="h-auto w-full max-w-[18rem]"
          />
        </a>

        <nav aria-label="Hauptmenü" className="hidden lg:block self-end pb-1">
          <ul className="flex flex-nowrap items-end gap-[5px]">
            {MENU_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="block whitespace-nowrap px-[3px] py-2 text-[15px] font-medium transition-opacity hover:opacity-60"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center justify-center gap-2 pb-2 mt-3 md:mt-6 lg:justify-end lg:pb-2">
          <div className="hidden items-center lg:flex lg:items-end lg:-mt-0.5" aria-label="Sprache wählen">
            {LANGS.map((l) => (
              <a
                key={l.code}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  selectLanguage(l.code);
                }}
                title={l.label}
              >
                <img
                  src={`https://prophotoskills.github.io/pps-assets/images/${l.code}.svg`}
                  alt={l.label}
                  width={20}
                  height={14}
                  className={`mx-0.5 rounded-sm border border-[#454545] transition-opacity ${lang === l.code ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                />
              </a>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-[#454545] hover:bg-[#454545]/10 hover:text-[#454545] lg:hidden"
            aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={menuOpen}
            aria-controls="pps-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <>
                <X className="size-9 md:hidden" strokeWidth={3} />
                <X className="hidden md:block lg:hidden size-10" strokeWidth={4} />
              </>
            ) : (
              <>
                <Menu className="size-9 md:hidden" strokeWidth={3} />
                <Menu className="hidden md:block lg:hidden size-10" strokeWidth={4} />
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-end pb-2 mt-3 md:mt-6 lg:hidden" aria-label="Sprache wählen">
          {LANGS.map((l) => (
            <a
              key={l.code}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                selectLanguage(l.code);
              }}
              title={l.label}
            >
              <img
                src={`https://prophotoskills.github.io/pps-assets/images/${l.code}.svg`}
                alt={l.label}
                width={20}
                height={14}
                className={`mx-0.5 rounded-sm border border-[#454545] transition-opacity ${lang === l.code ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
              />
            </a>
          ))}
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="pps-mobile-menu"
          aria-label="Mobiles Hauptmenü"
          className="absolute inset-x-0 top-full border-t border-[#454545]/20 bg-[#f8e800] shadow-lg lg:hidden"
        >
          <ul className="mx-auto grid max-w-[1440px] px-4 py-2 sm:px-6">
            {MENU_ITEMS.map((item) => (
              <li key={item.label} className="border-b border-[#454545]/15 last:border-b-0">
                <a
                  href={item.href}
                  className="block py-3 text-[15px] font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
