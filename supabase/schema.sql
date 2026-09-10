-- Benzer Paints — admin panel schema
--
-- Run this once in the Supabase Dashboard → SQL Editor (Project: "Benzer
-- Paints"). It creates the tables, storage buckets, and Row Level Security
-- policies the site's admin panel, blogs, and career pages depend on.
--
-- After running this file, create the admin login itself:
--   1. Dashboard → Authentication → Users → Add user (email + password).
--   2. Run:  insert into public.admins (email) values ('the-email-you-used');
-- That email/password is what you'll use to sign in at /admin/login.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Admins
-- ---------------------------------------------------------------------------
-- Deliberately keyed by email, not auth.users.id — lets you grant admin
-- access by just inserting a row, without looking up a user's UUID first.
create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
-- No select/insert/update/delete policies on purpose: nothing reaches this
-- table through the client directly. is_admin() below reads it via
-- `security definer`, bypassing RLS safely — it only ever checks the
-- caller's own JWT email, so it can't be used to probe other rows.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where email = auth.jwt() ->> 'email'
  );
$$;

grant execute on function public.is_admin() to authenticated, anon;

-- ---------------------------------------------------------------------------
-- Blogs
-- ---------------------------------------------------------------------------
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  cover_image text not null default '',
  author text not null default 'Benzer Paints',
  featured boolean not null default false,
  -- Ordered array of content blocks: {"type":"paragraph","text":"..."} or
  -- {"type":"image","src":"...","caption":"..."} — same shape the
  -- BlogInnerPage renderer already expects.
  content jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blogs_published_idx on public.blogs (published, published_at desc);

alter table public.blogs enable row level security;

create policy "public can read published blogs" on public.blogs
  for select
  using (published = true);

create policy "admins can read all blogs" on public.blogs
  for select
  using (public.is_admin());

create policy "admins can insert blogs" on public.blogs
  for insert
  with check (public.is_admin());

create policy "admins can update blogs" on public.blogs
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete blogs" on public.blogs
  for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Jobs
-- ---------------------------------------------------------------------------
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  department text not null default '',
  location text not null default '',
  job_type text not null default 'Full-time'
    check (job_type in ('Full-time', 'Part-time', 'Internship', 'Contract')),
  experience_level text not null default '',
  description text not null default '',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists jobs_published_idx on public.jobs (published, published_at desc);
create index if not exists jobs_department_idx on public.jobs (department);
create index if not exists jobs_location_idx on public.jobs (location);
create index if not exists jobs_job_type_idx on public.jobs (job_type);

alter table public.jobs enable row level security;

create policy "public can read published jobs" on public.jobs
  for select
  using (published = true);

create policy "admins can read all jobs" on public.jobs
  for select
  using (public.is_admin());

create policy "admins can insert jobs" on public.jobs
  for insert
  with check (public.is_admin());

create policy "admins can update jobs" on public.jobs
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete jobs" on public.jobs
  for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Job applications
-- ---------------------------------------------------------------------------
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null default '',
  cover_note text not null default '',
  -- Path inside the private "resumes" storage bucket, not a public URL —
  -- the admin panel turns this into a signed URL on demand.
  resume_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists job_applications_job_id_idx on public.job_applications (job_id);

alter table public.job_applications enable row level security;

-- Applicants can submit but never read back applications (their own or
-- anyone else's) — protects every other applicant's contact details/resume.
create policy "anyone can submit an application" on public.job_applications
  for insert
  with check (true);

create policy "admins can read applications" on public.job_applications
  for select
  using (public.is_admin());

create policy "admins can delete applications" on public.job_applications
  for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: blog cover/inline images (public) and resumes (private)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

create policy "admins can upload blog images" on storage.objects
  for insert
  with check (bucket_id = 'blog-images' and public.is_admin());

create policy "admins can update blog images" on storage.objects
  for update
  using (bucket_id = 'blog-images' and public.is_admin());

create policy "admins can delete blog images" on storage.objects
  for delete
  using (bucket_id = 'blog-images' and public.is_admin());

-- Applicants upload their own resume anonymously; only admins can read or
-- remove any resume (including their own upload) afterwards.
create policy "anyone can upload a resume" on storage.objects
  for insert
  with check (bucket_id = 'resumes');

create policy "admins can read resumes" on storage.objects
  for select
  using (bucket_id = 'resumes' and public.is_admin());

create policy "admins can delete resumes" on storage.objects
  for delete
  using (bucket_id = 'resumes' and public.is_admin());
