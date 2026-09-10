-- Benzer Paints — admin panel schema v2
-- Adds: contact enquiries, dealer enquiries, site settings (brochure), and
-- the storage bucket for the brochure PDF. Run once in the Supabase
-- Dashboard → SQL Editor, after schema.sql.

-- ---------------------------------------------------------------------------
-- Contact page enquiries
-- ---------------------------------------------------------------------------
create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null default '',
  email text not null,
  phone text not null default '',
  message text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.contact_enquiries enable row level security;

create policy "anyone can submit a contact enquiry" on public.contact_enquiries
  for insert
  with check (true);

create policy "admins can read contact enquiries" on public.contact_enquiries
  for select
  using (public.is_admin());

create policy "admins can update contact enquiries" on public.contact_enquiries
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete contact enquiries" on public.contact_enquiries
  for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Dealer inquiry form submissions
-- ---------------------------------------------------------------------------
create table if not exists public.dealer_enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  mobile text not null,
  email text not null,
  address text not null default '',
  city text not null default '',
  state text not null default '',
  pincode text not null default '',
  business_type text not null default '',
  business_name text not null default '',
  gst text not null default '',
  monthly_purchase text not null default '',
  message text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.dealer_enquiries enable row level security;

create policy "anyone can submit a dealer enquiry" on public.dealer_enquiries
  for insert
  with check (true);

create policy "admins can read dealer enquiries" on public.dealer_enquiries
  for select
  using (public.is_admin());

create policy "admins can update dealer enquiries" on public.dealer_enquiries
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete dealer enquiries" on public.dealer_enquiries
  for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Site settings — small key/value table, currently just the brochure URL
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "public can read site settings" on public.site_settings
  for select
  using (true);

create policy "admins can insert site settings" on public.site_settings
  for insert
  with check (public.is_admin());

create policy "admins can update site settings" on public.site_settings
  for update
  using (public.is_admin())
  with check (public.is_admin());

-- Seeds the brochure setting with the existing static file so the site
-- keeps working before an admin ever uploads a replacement.
insert into public.site_settings (key, value)
values ('brochure_url', '/assets/BenzerPaints-Brochure.pdf')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Storage: brochure PDF (public)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('brochure', 'brochure', true)
on conflict (id) do nothing;

create policy "admins can upload brochure" on storage.objects
  for insert
  with check (bucket_id = 'brochure' and public.is_admin());

create policy "admins can update brochure file" on storage.objects
  for update
  using (bucket_id = 'brochure' and public.is_admin());

create policy "admins can delete brochure" on storage.objects
  for delete
  using (bucket_id = 'brochure' and public.is_admin());
