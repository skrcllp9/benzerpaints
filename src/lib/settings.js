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

// --- Contact / footer details ---------------------------------------------

// Shown until (or if) the rows in site_settings can't be read, so the footer
// and contact page never render blank. Mirrors the seed in schema_v3.sql.
export const DEFAULT_SITE_INFO = {
  contact_phone: "7391074994",
  contact_phone_note: "(10:00 AM – 5:00 PM)",
  contact_email: "info@benzerpaints.com",
  address:
    "First Floor, Office No.1, Survey No. 133/2, Pune Saswad Road,\nBhadalewasti, Uruli Devachi, Pune, Maharashtra 412308, India",
  maps_url: "https://maps.app.goo.gl/DLCfuGjcBzk6KdLr9",
  social_linkedin: "",
  social_instagram: "",
  social_facebook: "",
};

export async function fetchSiteInfo() {
  const keys = Object.keys(DEFAULT_SITE_INFO);
  const { data, error } = await supabase.from("site_settings").select("key, value").in("key", keys);
  if (error) throw error;
  const info = { ...DEFAULT_SITE_INFO };
  data.forEach(({ key, value }) => {
    info[key] = value;
  });
  return info;
}

// Admin only (RLS).
export async function saveSiteInfo(info) {
  const now = new Date().toISOString();
  const rows = Object.keys(DEFAULT_SITE_INFO).map((key) => ({
    key,
    value: (info[key] ?? "").trim(),
    updated_at: now,
  }));
  const { error } = await supabase.from("site_settings").upsert(rows);
  if (error) throw error;
}
