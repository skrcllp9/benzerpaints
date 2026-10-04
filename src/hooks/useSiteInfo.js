import { useEffect, useState } from "react";
import { DEFAULT_SITE_INFO, fetchSiteInfo } from "../lib/settings";

// Footer address, contact details and social links — editable from
// /admin/site-settings. Starts from the built-in defaults so the page is
// complete on first paint, then swaps in the stored values.
export const useSiteInfo = () => {
  const [info, setInfo] = useState(DEFAULT_SITE_INFO);

  useEffect(() => {
    let active = true;
    fetchSiteInfo()
      .then((value) => {
        if (active) setInfo(value);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return info;
};

// "tel:" target for a display number — bare 10-digit numbers get +91.
export const toTelHref = (phone) => {
  const digits = phone.replace(/\D/g, "");
  return `tel:${digits.length === 10 ? "+91" : "+"}${digits}`;
};
