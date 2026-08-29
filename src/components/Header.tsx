import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
    <header className="border-b border-black/10" style={{ backgroundColor: "#f8e800" }}>
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:px-6">
        <a
          href="https://prophotoskills.github.io/pps/"
          target="_blank"
          rel="noreferrer"
          className="flex min-w-0 items-center gap-2.5"
        >
          <img
            src="https://prophotoskills.github.io/pps-assets/images/ProPhotoSkills_Logo.png"
            alt="ProPhotoSkills Logo"
            className="h-8 w-auto shrink-0"
          />
        </a>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <div className="mr-1 flex items-center">
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
                  style={{ borderRadius: 2, margin: "0 2px" }}
                  className={lang === l.code ? "opacity-100" : "opacity-100"}
                />
              </a>
            ))}
          </div>


          <a
            href="https://memberabo.prophotoskills.com/"
            target="_blank"
            rel="noreferrer"
            className="relative inline-flex h-8 items-center justify-center gap-2 overflow-hidden rounded-full border border-black/30 bg-cover bg-center px-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:text-white sm:px-4"
            style={{
              backgroundImage:
                "linear-gradient(rgba(10,20,40,0.55), rgba(10,20,40,0.7)), url(/assets/heli-bg.webp)",
            }}
          >
            <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">Angebote</span>
          </a>
          <Link
            to="/login"
            className="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-md px-2 text-xs font-medium text-stone-900/90 transition-colors hover:bg-black/10 sm:px-3"
          >
            Anmelden
          </Link>
        </div>
      </div>
    </header>
  );
}
