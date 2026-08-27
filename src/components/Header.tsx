import { PPS_HEADER_HTML } from "@/components/pps-chrome-html";
import { PpsChromeFrame } from "@/components/PpsChromeFrame";

/** Exact ProPhotoSkills header, rendered 1:1 from the content repo. */
export function Header() {
  return <PpsChromeFrame title="Header" html={PPS_HEADER_HTML} />;
}
