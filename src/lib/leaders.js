import { supabase } from "./supabaseClient";
import { slugify } from "./blogs";

const COLUMNS = "id, name, role, image_url, sort_order, created_at";

// Public read.
export async function fetchLeaders() {
  const { data, error } = await supabase
    .from("leaders")
    .select(COLUMNS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

// --- Admin writes (subject to is_admin() RLS) -------------------------------

export async function uploadLeaderImage(file) {
  const ext = file.name.match(/\.[^.]+$/)?.[0] || "";
  const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}${ext}`;
  const { error } = await supabase.storage.from("leader-images").upload(path, file);
  if (error) throw error;
  return supabase.storage.from("leader-images").getPublicUrl(path).data.publicUrl;
}

export async function createLeader(values) {
  const { error } = await supabase.from("leaders").insert(values);
  if (error) throw error;
}

export async function updateLeader(id, values) {
  const { error } = await supabase.from("leaders").update(values).eq("id", id);
  if (error) throw error;
}

export async function deleteLeader(id) {
  const { error } = await supabase.from("leaders").delete().eq("id", id);
  if (error) throw error;
}
