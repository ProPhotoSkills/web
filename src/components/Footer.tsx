import { PPS_FOOTER_HTML } from "@/components/pps-chrome-html";

/**
 * Exact ProPhotoSkills footer from the content repo, rendered 1:1.
 * Styling comes from pps-site.css (loaded in __root.tsx).
 */
export function Footer() {
  return <div className="pps-chrome" dangerouslySetInnerHTML={{ __html: PPS_FOOTER_HTML }} />;
}
