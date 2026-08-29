import { useEffect, useRef, useState } from "react";

// Locally hosted (fixed) PPS stylesheet + script: includes the ETmodules icon
// font for the hamburger button and the jQuery-free mobile menu toggle.
const PPS_CSS_PATH = "/pps/css/pps-site.css";
const PPS_JS_PATH = "/pps/js/pps-site.js";
const PPS_FONTS =
  "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Source+Sans+3:wght@400;600;700&display=swap";


/**
 * Renders the original ProPhotoSkills header/footer markup 1:1 inside an
 * isolated document, loading the original site stylesheet. This keeps the
 * chrome pixel-identical to prophotoskills.github.io/content and prevents any
 * CSS bleed in either direction.
 */
export function PpsChromeFrame({
  html,
  title,
  extraCss = "",
}: {
  html: string;
  title: string;
  extraCss?: string;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(title === "Footer" ? 300 : 110);
  const [origin, setOrigin] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Absolute URLs are required: <base> points at the content site, so a
  // root-relative path would resolve against that host instead of the app.
  const doc = `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8">
<base href="https://prophotoskills.github.io/content/" target="_parent">
<link rel="stylesheet" href="${PPS_FONTS}">
<link rel="stylesheet" href="${origin}${PPS_CSS_PATH}">
<style>html,body{margin:0;padding:0;overflow-x:hidden;background:${title === "Footer" ? "#4a4a4a" : "#f8e800"}}${extraCss}</style>
</head><body class="et-tb et-tb-has-header et-tb-has-footer">
<div id="page-container"><div id="et-boc" class="et-boc">${html}</div></div>
<script src="${origin}${PPS_JS_PATH}" defer></script>
</body></html>`;


  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;

    const measure = () => {
      const doc = frame.contentDocument;
      const body = doc?.body;
      if (!doc || !body) return;
      // An open mobile menu is position:fixed, so it does not affect
      // scrollHeight — grow the frame so the dropdown stays visible.
      let openMenuBottom = 0;
      doc.querySelectorAll<HTMLElement>(".et_mobile_menu").forEach((menu) => {
        if (menu.style.display === "block") {
          openMenuBottom = Math.max(
            openMenuBottom,
            menu.getBoundingClientRect().bottom + 8,
          );
        }
      });
      const next = Math.ceil(
        Math.max(
          body.scrollHeight,
          body.getBoundingClientRect().height,
          openMenuBottom,
        ),
      );
      if (next > 0) setHeight(next);
    };


    frame.addEventListener("load", measure);
    const interval = window.setInterval(measure, 500);
    window.addEventListener("resize", measure);

    return () => {
      frame.removeEventListener("load", measure);
      window.clearInterval(interval);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={origin ? doc : undefined}
      scrolling="no"
      style={{ width: "100%", height, border: 0, display: "block" }}
    />
  );

}
