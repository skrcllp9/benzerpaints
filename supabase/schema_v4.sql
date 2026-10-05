-- Benzer Paints — schema v4
-- Adds the 4th and 5th leaders (About page). Run once in the Supabase
-- Dashboard SQL Editor, after schema_v3.sql. Safe to re-run.

insert into public.leaders (name, role, sort_order)
select name, role, sort_order
from (values
  ('Mrs. Pushpa Gupta', 'Director', 4),
  ('Miss Shikha Gupta', 'Director', 5)
) as seed(name, role, sort_order)
where not exists (select 1 from public.leaders l where l.name = seed.name);
