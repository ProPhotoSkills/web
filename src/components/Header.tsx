import { PPS_HEADER_HTML } from "@/components/pps-chrome-html";

/**
 * Exact ProPhotoSkills header from the content repo, rendered 1:1.
 * Styling comes from pps-site.css (loaded in __root.tsx).
 */
export function Header() {
  return <div dangerouslySetInnerHTML={{ __html: PPS_HEADER_HTML }} />;
}
