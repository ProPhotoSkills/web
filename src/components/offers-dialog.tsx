import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const coverWp = { url: "/assets/cover_wp.webp" };
const coverNl = { url: "/assets/cover_nl.webp" };
const coverOl = { url: "/assets/cover_ol.webp" };
const coverMb = { url: "/assets/cover_mb.webp" };
const coverAs = { url: "/assets/cover_as.webp" };
const coverShop = { url: "/assets/cover_shop.webp" };

type OfferAvailability = "intl" | "de";

type OfferDef = {
  key: "o1" | "o2" | "o3" | "o4" | "o5" | "o6";
  url: string;
  cover: string;
  availability: OfferAvailability;
};

const offers: OfferDef[] = [
  { key: "o1", url: "https://prophotoskills.com/", cover: coverWp.url, availability: "intl" },
  { key: "o2", url: "https://nextlevel.prophotoskills.com/", cover: coverNl.url, availability: "de" },
  { key: "o3", url: "https://onlocation.prophotoskills.com/", cover: coverOl.url, availability: "de" },
  { key: "o4", url: "https://memberabo.prophotoskills.com/", cover: coverMb.url, availability: "intl" },
  { key: "o5", url: "https://prophotoskills.com/1st-assistant_program/", cover: coverAs.url, availability: "intl" },
  { key: "o6", url: "https://prophotoskills.com/shop/", cover: coverShop.url, availability: "intl" },
];

export function OffersDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  compact,
  showExit,
  hideTrigger,
}: {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  compact?: boolean;
  showExit?: boolean;
  hideTrigger?: boolean;
}) {
  const { t } = useI18n();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled && onOpenChange ? onOpenChange : setInternalOpen;

  const widthClass = compact
    ? "max-w-4xl w-[calc(100%-1rem)] sm:w-[85vw]"
    : "max-w-5xl w-[calc(100%-1rem)]";
  const padClass = compact ? "p-3 sm:p-6 lg:p-7" : "p-4 sm:p-8 lg:p-12";

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          {trigger ?? (
            <Button
              size="sm"
              className="relative overflow-hidden bg-cover bg-center text-white hover:text-white font-semibold border border-black/30 px-2.5 sm:px-4 rounded-full shadow-sm"
              style={{ backgroundImage: `linear-gradient(rgba(10,20,40,0.55), rgba(10,20,40,0.7)), url(/assets/heli-bg.webp)` }}
            >
              <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{t("landing.cta_offers") ?? "Angebot"}</span>
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent className={`${widthClass} max-h-[90vh] overflow-y-auto bg-stone-50 border-stone-200 text-stone-900 ${padClass}`}>
        <DialogHeader className={compact ? "mb-3 sm:mb-5 px-1" : "mb-4 sm:mb-6 lg:mb-8 px-2"}>
          <DialogTitle className={compact ? "text-xl sm:text-3xl text-stone-900" : "text-2xl sm:text-3xl lg:text-4xl text-stone-900"}>
            {title ?? t("offers.dialog.title")}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-stone-600">
            {description ?? t("offers.dialog.desc")}
          </DialogDescription>
        </DialogHeader>
        <div className={`grid grid-cols-2 sm:grid-cols-3 ${compact ? "gap-2.5 sm:gap-4 px-1" : "gap-2.5 sm:gap-5 lg:gap-8 px-2"} pb-2`}>
          {offers.map((o) => {
            const availLabel = o.availability === "intl" ? t("offers.avail.intl") : t("offers.avail.de");
            const availClass =
              o.availability === "intl"
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
                : "bg-amber-500/15 text-amber-300 border-amber-400/30";
            return (
              <a
                key={o.url}
                href={o.url}
                target="_blank"
                rel="noreferrer"
                className="group relative flex flex-col rounded-xl border border-white/10 bg-black/75 backdrop-blur-sm overflow-hidden hover:border-[#f8e800]/60 transition-colors"
              >
                <div className="bg-stone-900 flex items-center justify-center p-2 sm:p-3">
                  <img
                    src={o.cover}
                    alt={t(`offers.${o.key}.title`)}
                    className="w-full h-auto max-h-36 sm:max-h-48 lg:max-h-64 object-contain group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className={compact ? "p-2.5 sm:p-4 flex flex-col gap-1.5 sm:gap-2 flex-1" : "p-2.5 sm:p-4 lg:p-5 flex flex-col gap-1.5 sm:gap-2.5 flex-1"}>
                  <div>
                    <h3 className="font-bold text-[#f8e800] text-sm sm:text-lg leading-tight">{t(`offers.${o.key}.title`)}</h3>
                    <p className="text-[10px] sm:text-xs text-stone-400 font-medium">{t(`offers.${o.key}.sub`)}</p>
                  </div>
                  <p className="text-[11px] sm:text-sm text-white/75 leading-snug sm:leading-relaxed flex-1 line-clamp-4 sm:line-clamp-none">{t(`offers.${o.key}.info`)}</p>
                  <div className="flex flex-col items-start gap-1.5 lg:flex-row lg:items-center lg:justify-between lg:gap-2 pt-1">
                    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold ${availClass}`}>
                      <Globe className="h-3 w-3" />
                      {availLabel}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] sm:text-xs text-[#f8e800] font-semibold">
                      {t("offers.open")} <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
          {showExit && (
            <a
              href="https://google.com"
              rel="noreferrer"
              className="group relative flex flex-col items-center justify-center rounded-xl border border-stone-300 bg-white overflow-hidden hover:border-stone-400 transition-colors min-h-[180px] p-6 text-center"
            >
              <span className="text-sm text-stone-400">— —</span>
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
