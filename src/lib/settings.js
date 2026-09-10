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
