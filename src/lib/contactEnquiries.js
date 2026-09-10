import { supabase } from "./supabaseClient";

const COLUMNS = "id, first_name, last_name, email, phone, message, status, created_at";

export async function submitContactEnquiry({ firstName, lastName, email, phone, message }) {
  const { error } = await supabase.from("contact_enquiries").insert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    message,
  });
  if (error) throw error;
}

// --- Admin only (RLS) ------------------------------------------------------

export async function fetchAllContactEnquiriesAdmin() {
  const { data, error } = await supabase
    .from("contact_enquiries")
    .select(COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchRecentContactEnquiriesAdmin(limit = 5) {
  const { data, error } = await supabase
    .from("contact_enquiries")
    .select(COLUMNS)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function updateContactEnquiryStatus(id, status) {
  const { error } = await supabase.from("contact_enquiries").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteContactEnquiry(id) {
  const { error } = await supabase.from("contact_enquiries").delete().eq("id", id);
  if (error) throw error;
}
