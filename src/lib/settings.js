import { supabase } from "./supabaseClient";

const BROCHURE_KEY = "brochure_url";
const FALLBACK_BROCHURE_URL = "/assets/BenzerPaints-Brochure.pdf";

// Public — safe to call from any page. Falls back to the static file that
// shipped with the site if the setting row is ever missing, rather than
// leaving the download link broken.
export async function fetchBrochureUrl() {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", BROCHURE_KEY)
    .maybeSingle();
  if (error) throw error;
  return data?.value || FALLBACK_BROCHURE_URL;
}

// --- Admin only (RLS) ------------------------------------------------------

export async function uploadBrochure(file) {
  const path = `brochure-${Date.now()}.pdf`;
  const { error: uploadError } = await supabase.storage.from("brochure").upload(path, file, {
    contentType: "application/pdf",
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("brochure").getPublicUrl(path);
  const { error: settingError } = await supabase
    .from("site_settings")
    .upsert({ key: BROCHURE_KEY, value: data.publicUrl, updated_at: new Date().toISOString() });
  if (settingError) throw settingError;

  return data.publicUrl;
}

export async function fetchBrochureSettingAdmin() {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value, updated_at")
    .eq("key", BROCHURE_KEY)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// --- Footer / Contact page details ----------------------------------------

// The footer and the Contact page each have their own copy of these details,
// edited separately in /admin/site-settings. Stored as `footer_*` /
// `contact_page_*` rows in site_settings.
export const SECTIONS = {
  footer: { prefix: "footer_", fields: ["email", "address", "maps_url", "social_linkedin", "social_instagram", "social_facebook"] },
  contact: { prefix: "contact_page_", fields: ["email", "address", "maps_url"] },
};

// A contact number with a purpose label (e.g. "Customer Support"); `note`
// is optional extra text (e.g. hours) shown on the Contact page only.
const DEFAULT_SECTION_INFO = {
  phones: [{ label: "Customer Support", number: "7391074994", note: "(10:00 AM – 5:00 PM)" }],
  email: "info@benzerpaints.com",
  address:
    "First Floor, Office No.1, Survey No. 133/2, Pune Saswad Road,\nBhadalewasti, Uruli Devachi, Pune, Maharashtra 412308, India",
  maps_url: "https://maps.app.goo.gl/DLCfuGjcBzk6KdLr9",
  social_linkedin: "",
  social_instagram: "",
  social_facebook: "",
};

// Shown until (or if) the rows can't be read, so neither place renders blank.
export const DEFAULT_SITE_INFO = {
  footer: { ...DEFAULT_SECTION_INFO },
  contact: { ...DEFAULT_SECTION_INFO },
};

// Keys the shared (pre-split) settings used. Still read as a fallback so
// existing values carry over until each section is saved for the first time.
const LEGACY_KEYS = {
  email: "contact_email",
  address: "address",
  maps_url: "maps_url",
  social_linkedin: "social_linkedin",
  social_instagram: "social_instagram",
  social_facebook: "social_facebook",
  phones: "contact_phones",
};

const parsePhones = (raw) => {
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return null;
    return list.map((p) => ({
      label: String(p.label ?? ""),
      number: String(p.number ?? ""),
      note: String(p.note ?? ""),
    }));
  } catch {
    return null;
  }
};

export async function fetchSiteInfo() {
  const keys = new Set(["contact_phone", "contact_phone_note", ...Object.values(LEGACY_KEYS)]);
  Object.values(SECTIONS).forEach(({ prefix, fields }) => {
    fields.forEach((f) => keys.add(prefix + f));
    keys.add(`${prefix}phones`);
  });
  const { data, error } = await supabase.from("site_settings").select("key, value").in("key", [...keys]);
  if (error) throw error;
  const rows = Object.fromEntries(data.map(({ key, value }) => [key, value]));

  const pick = (prefix, field) => {
    if (prefix + field in rows) return rows[prefix + field];
    if (LEGACY_KEYS[field] in rows) return rows[LEGACY_KEYS[field]];
    return undefined;
  };

  const info = {};
  Object.entries(SECTIONS).forEach(([name, { prefix, fields }]) => {
    const section = { ...DEFAULT_SECTION_INFO };
    fields.forEach((f) => {
      const value = pick(prefix, f);
      if (value !== undefined) section[f] = value;
    });
    const rawPhones = pick(prefix, "phones");
    const phones = rawPhones !== undefined ? parsePhones(rawPhones) : null;
    if (phones) section.phones = phones;
    else if (rows.contact_phone)
      section.phones = [{ label: "Customer Support", number: rows.contact_phone, note: rows.contact_phone_note || "" }];
    info[name] = section;
  });
  return info;
}

// Admin only (RLS). Saves one section ("footer" | "contact").
export async function saveSiteInfo(sectionName, section) {
  const { prefix, fields } = SECTIONS[sectionName];
  const now = new Date().toISOString();
  const phones = section.phones
    .map((p) => ({ label: p.label.trim(), number: p.number.trim(), note: p.note.trim() }))
    .filter((p) => p.number);
  const rows = [
    ...fields.map((f) => ({ key: prefix + f, value: (section[f] ?? "").trim(), updated_at: now })),
    { key: `${prefix}phones`, value: JSON.stringify(phones), updated_at: now },
  ];
  const { error } = await supabase.from("site_settings").upsert(rows);
  if (error) throw error;
}
