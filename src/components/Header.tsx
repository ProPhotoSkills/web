import { Link } from "@tanstack/react-router";

/**
 * Header im Stil der ProPhotoSkills KI-Coach-App,
 * mit ProPhotoSkills-Logo statt KI-Coach-Logo/Text.
 */
export function Header() {
  return (
    <header className="border-b border-black/10" style={{ backgroundColor: "#f8e800" }}>
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:px-6">
        <a
          href="https://prophotoskills.github.io/content/"
          target="_blank"
          rel="noreferrer"
          className="flex min-w-0 items-center gap-2.5"
        >
          <img
            src="https://prophotoskills.github.io/pps-assets/images/ProPhotoSkills_Logo.png"
            alt="ProPhotoSkills Logo"
            className="h-8 w-auto shrink-0"
          />
          <span className="hidden truncate text-sm font-semibold tracking-tight text-stone-900/90 sm:inline sm:text-base">
            ProPhotoSkills
          </span>
          <span className="truncate text-sm font-semibold tracking-tight text-stone-900/90 sm:hidden">
            PPS
          </span>
        </a>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
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
