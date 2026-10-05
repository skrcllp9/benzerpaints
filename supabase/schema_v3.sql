-- Benzer Paints — schema v3
-- Adds: editable contact/footer settings (rows in site_settings) and the
-- leaders table + storage bucket for their photos. Run once in the Supabase
-- Dashboard SQL Editor, after schema.sql and schema_v2.sql.

-- ---------------------------------------------------------------------------
-- Site settings: contact details, address, social links.
-- (site_settings and its RLS policies come from schema_v2.sql.)
-- ---------------------------------------------------------------------------
insert into public.site_settings (key, value) values
  ('contact_phone', '7391074994'),
  ('contact_phone_note', '(10:00 AM – 5:00 PM)'),
  ('contact_email', 'info@benzerpaints.com'),
  ('address', E'First Floor, Office No.1, Survey No. 133/2, Pune Saswad Road,\nBhadalewasti, Uruli Devachi, Pune, Maharashtra 412308, India'),
  ('maps_url', 'https://maps.app.goo.gl/DLCfuGjcBzk6KdLr9'),
  ('social_linkedin', ''),
  ('social_instagram', ''),
  ('social_facebook', '')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Leaders (About page)
-- ---------------------------------------------------------------------------
create table if not exists public.leaders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  image_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.leaders enable row level security;

create policy "public can read leaders" on public.leaders
  for select
  using (true);

create policy "admins can insert leaders" on public.leaders
  for insert
  with check (public.is_admin());

create policy "admins can update leaders" on public.leaders
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete leaders" on public.leaders
  for delete
  using (public.is_admin());

insert into public.leaders (name, role, sort_order)
select name, role, sort_order
from (values
  ('Mr. Vijay Gupta', 'Managing Director', 1),
  ('Mr. Diwakar Singhal', 'Director', 2),
  ('Mr. Shubham Gupta', 'Director', 3),
  ('Mrs. Pushpa Gupta', 'Director', 4),
  ('Miss Shikha Gupta', 'Director', 5)
) as seed(name, role, sort_order)
where not exists (select 1 from public.leaders);

-- ---------------------------------------------------------------------------
-- Storage: leader photos (public)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('leader-images', 'leader-images', true)
on conflict (id) do nothing;

create policy "admins can upload leader images" on storage.objects
  for insert
  with check (bucket_id = 'leader-images' and public.is_admin());

create policy "admins can update leader images" on storage.objects
  for update
  using (bucket_id = 'leader-images' and public.is_admin());

create policy "admins can delete leader images" on storage.objects
  for delete
  using (bucket_id = 'leader-images' and public.is_admin());
