import { useEffect, useState } from "react";
import { fetchBrochureUrl } from "../lib/settings";

const FALLBACK_BROCHURE_URL = "/assets/BenzerPaints-Brochure.pdf";

// Shared by Footer.jsx and Homepage.jsx's brochure section — both render a
// "Download Brochure" link and need the same admin-uploaded URL. Starts at
// the static fallback so the link works instantly on first paint, then
// swaps in the real one once Supabase responds.
export const useBrochureUrl = () => {
  const [url, setUrl] = useState(FALLBACK_BROCHURE_URL);

  useEffect(() => {
    let active = true;
    fetchBrochureUrl()
      .then((value) => {
        if (active) setUrl(value);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return url;
};
