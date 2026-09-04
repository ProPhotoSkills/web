import { PPS_FOOTER_HTML } from "@/components/pps-chrome-html";
import { PpsChromeFrame } from "@/components/PpsChromeFrame";

/** Exact ProPhotoSkills footer, rendered 1:1 from the content repo. */
export function Footer() {
  return (
    <PpsChromeFrame
      title="Footer"
      html={PPS_FOOTER_HTML}
      extraCss="body{font-family:'Inter',sans-serif !important}"
    />
  );
}
