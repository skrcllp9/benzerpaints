import { supabase } from "./supabaseClient";
import { slugify } from "./blogs";

export const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];

const JOB_COLUMNS =
  "id, slug, title, department, location, job_type, experience_level, description, published, published_at, created_at, updated_at";

// --- Public reads (subject to the "published = true" RLS policy) ----------

export async function fetchPublishedJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_COLUMNS)
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchPublishedJobBySlug(slug) {
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_COLUMNS)
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// --- Admin reads/writes (subject to the is_admin() RLS policies) ----------

export async function fetchAllJobsAdmin() {
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchJobByIdAdmin(id) {
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createJob(payload) {
  const { data, error } = await supabase
    .from("jobs")
    .insert(payload)
    .select(JOB_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function updateJob(id, payload) {
  const { data, error } = await supabase
    .from("jobs")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(JOB_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteJob(id) {
  const { error } = await supabase.from("jobs").delete().eq("id", id);
  if (error) throw error;
}

// --- Applications ----------------------------------------------------------

// Uploaded anonymously by applicants — allowed by the "anyone can upload a
// resume" storage policy, but the "resumes" bucket itself is private, so
// the returned path (not a public URL) is what gets stored on the row.
export async function uploadResume(jobId, file) {
  const path = `${jobId}/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}${file.name.match(/\.[^.]+$/)?.[0] || ""}`;
  const { error } = await supabase.storage.from("resumes").upload(path, file);
  if (error) throw error;
  return path;
}

export async function submitApplication({ jobId, fullName, email, phone, coverNote, resumePath }) {
  const { error } = await supabase.from("job_applications").insert({
    job_id: jobId,
    full_name: fullName,
    email,
    phone,
    cover_note: coverNote,
    resume_path: resumePath,
  });
  if (error) throw error;
}

// Admin-only (RLS) — listing applicants for a job.
export async function fetchApplicationsForJob(jobId) {
  const { data, error } = await supabase
    .from("job_applications")
    .select("id, full_name, email, phone, cover_note, resume_path, created_at")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Admin-only (RLS) — the "resumes" bucket is private, so a resume needs a
// short-lived signed URL rather than a plain public one.
export async function getResumeSignedUrl(path) {
  const { data, error } = await supabase.storage
    .from("resumes")
    .createSignedUrl(path, 60 * 10);
  if (error) throw error;
  return data.signedUrl;
}

// Admin-only (RLS) — every application across every job, with the job's
// title/slug joined in so the table doesn't need a separate lookup per row.
export async function fetchAllApplicationsAdmin() {
  const { data, error } = await supabase
    .from("job_applications")
    .select("id, full_name, email, phone, cover_note, resume_path, created_at, job_id, jobs(title, slug)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchRecentApplicationsAdmin(limit = 5) {
  const { data, error } = await supabase
    .from("job_applications")
    .select("id, full_name, email, created_at, job_id, jobs(title, slug)")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function deleteApplication(id) {
  const { error } = await supabase.from("job_applications").delete().eq("id", id);
  if (error) throw error;
}
