import { useEffect, useState } from "react";
import { DEFAULT_SITE_INFO, fetchSiteInfo } from "../lib/settings";

// Address, phone numbers, email (and social links for the footer) for one
// place on the site — "footer" or "contact" — editable from
// /admin/site-settings. Starts from the built-in defaults so the page is
// complete on first paint, then swaps in the stored values.
export const useSiteInfo = (section) => {
  const [info, setInfo] = useState(DEFAULT_SITE_INFO[section]);

  useEffect(() => {
    let active = true;
    fetchSiteInfo()
      .then((value) => {
        if (active) setInfo(value[section]);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [section]);

  return info;
};

// "tel:" target for a display number — bare 10-digit numbers get +91.
export const toTelHref = (phone) => {
  const digits = phone.replace(/\D/g, "");
  return `tel:${digits.length === 10 ? "+91" : "+"}${digits}`;
};
