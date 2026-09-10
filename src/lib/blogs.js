import { supabase } from "./supabaseClient";

export const slugify = (text) =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const ordinalSuffix = (day) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const formatBlogDate = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  return `${day}${ordinalSuffix(day)} ${month}, ${date.getFullYear()}`;
};

export const getReadingTime = (content) => {
  const wordCount = (content || [])
    .filter((block) => block.type === "paragraph")
    .reduce((count, block) => count + block.text.trim().split(/\s+/).length, 0);
  const minutes = Math.round(wordCount / 200);
  return minutes < 1 ? "< 1 min read" : `${minutes} min read`;
};

const BLOG_COLUMNS =
  "id, slug, title, excerpt, cover_image, author, featured, content, published, published_at, created_at, updated_at";

// --- Public reads (subject to the "published = true" RLS policy) ----------

export async function fetchPublishedBlogs() {
  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_COLUMNS)
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchPublishedBlogBySlug(slug) {
  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_COLUMNS)
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// --- Admin reads/writes (subject to the is_admin() RLS policies) ----------

export async function fetchAllBlogsAdmin() {
  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchBlogByIdAdmin(id) {
  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createBlog(payload) {
  const { data, error } = await supabase
    .from("blogs")
    .insert(payload)
    .select(BLOG_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function updateBlog(id, payload) {
  const { data, error } = await supabase
    .from("blogs")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(BLOG_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBlog(id) {
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadBlogImage(file) {
  const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}${file.name.match(/\.[^.]+$/)?.[0] || ""}`;
  const { error } = await supabase.storage.from("blog-images").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
  return data.publicUrl;
}
