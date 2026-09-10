import { supabase } from "./supabaseClient";

const COLUMNS =
  "id, full_name, mobile, email, address, city, state, pincode, business_type, business_name, gst, monthly_purchase, message, status, created_at";

export async function submitDealerEnquiry({
  fullName,
  mobile,
  email,
  address,
  city,
  state,
  pincode,
  businessType,
  businessName,
  gst,
  monthlyPurchase,
  message,
}) {
  const { error } = await supabase.from("dealer_enquiries").insert({
    full_name: fullName,
    mobile,
    email,
    address,
    city,
    state,
    pincode,
    business_type: businessType,
    business_name: businessName,
    gst,
    monthly_purchase: monthlyPurchase,
    message,
  });
  if (error) throw error;
}

// --- Admin only (RLS) ------------------------------------------------------

export async function fetchAllDealerEnquiriesAdmin() {
  const { data, error } = await supabase
    .from("dealer_enquiries")
    .select(COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchRecentDealerEnquiriesAdmin(limit = 5) {
  const { data, error } = await supabase
    .from("dealer_enquiries")
    .select(COLUMNS)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function updateDealerEnquiryStatus(id, status) {
  const { error } = await supabase.from("dealer_enquiries").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteDealerEnquiry(id) {
  const { error } = await supabase.from("dealer_enquiries").delete().eq("id", id);
  if (error) throw error;
}
