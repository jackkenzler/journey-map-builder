-- Cloud drafts, public publishing, and hosted images.
--
-- Prerequisite (one time, in dashboards):
--   1. Clerk  -> Configure -> Integrations -> Supabase -> activate (adds role=authenticated to session tokens).
--   2. Supabase -> Authentication -> Sign In / Providers -> Third-Party Auth -> add Clerk with your Clerk domain.
-- Then run this file in the Supabase SQL editor.
--
-- Model:
--   * Each map belongs to one signed-in user (owner_id = Clerk user id). Drafts live in journey_maps.draft_json.
--   * Publishing snapshots the draft into journey_map_versions and points published_version_id at it.
--   * Anyone (signed out) can read a published map through get_published_journey_map(site_slug).
--   * Images live in the public "journey-map-images" bucket under <clerk user id>/..., readable by anyone,
--     writable only by the owner of that folder.

-- ---------------------------------------------------------------------------
-- Columns
-- ---------------------------------------------------------------------------
alter table journey_maps alter column organization_id drop not null;
alter table journey_maps add column if not exists owner_id text;
alter table journey_maps add column if not exists draft_json jsonb;
alter table journey_maps add column if not exists draft_updated_at timestamptz;
alter table journey_maps add column if not exists site_slug text;
alter table journey_maps add column if not exists published_at timestamptz;

-- Carry over anything published before this migration so existing public links keep working.
update journey_maps m
set site_slug = regexp_replace(ps.published_url, '^/published/', ''),
    published_at = ps.published_at
from (
  select distinct on (journey_map_id) journey_map_id, published_url, published_at
  from published_sites
  where published_url is not null
  order by journey_map_id, published_at desc
) ps
where ps.journey_map_id = m.id
  and m.site_slug is null
  and m.status = 'published';

create unique index if not exists journey_maps_site_slug_key
  on journey_maps (site_slug) where site_slug is not null;
create unique index if not exists journey_maps_owner_slug_key
  on journey_maps (owner_id, slug) where owner_id is not null;
create index if not exists journey_maps_owner_idx on journey_maps (owner_id);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table journey_maps enable row level security;
alter table journey_map_versions enable row level security;
alter table assets enable row level security;
alter table published_sites enable row level security;
-- organizations, organization_members, assets and published_sites have no policies on purpose:
-- the app no longer uses them, so they stay locked.

drop policy if exists "owners manage their maps" on journey_maps;
create policy "owners manage their maps" on journey_maps
  for all to authenticated
  using (owner_id = (select auth.jwt() ->> 'sub'))
  with check (owner_id = (select auth.jwt() ->> 'sub'));

drop policy if exists "owners manage their map versions" on journey_map_versions;
create policy "owners manage their map versions" on journey_map_versions
  for all to authenticated
  using (exists (
    select 1 from journey_maps m
    where m.id = journey_map_versions.journey_map_id
      and m.owner_id = (select auth.jwt() ->> 'sub')
  ))
  with check (exists (
    select 1 from journey_maps m
    where m.id = journey_map_versions.journey_map_id
      and m.owner_id = (select auth.jwt() ->> 'sub')
  ));

-- ---------------------------------------------------------------------------
-- Public read of published maps (works for signed-out visitors)
-- ---------------------------------------------------------------------------
create or replace function get_published_journey_map(p_site_slug text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object('config', v.config_json, 'publishedAt', m.published_at)
  from journey_maps m
  join journey_map_versions v on v.id = m.published_version_id
  where m.site_slug = p_site_slug
    and m.status = 'published'
  limit 1;
$$;

revoke all on function get_published_journey_map(text) from public;
grant execute on function get_published_journey_map(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Hosted images
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'journey-map-images',
  'journey-map-images',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "owners upload their images" on storage.objects;
create policy "owners upload their images" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'journey-map-images'
    and (storage.foldername(name))[1] = (select auth.jwt() ->> 'sub')
  );

drop policy if exists "owners update their images" on storage.objects;
create policy "owners update their images" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'journey-map-images'
    and (storage.foldername(name))[1] = (select auth.jwt() ->> 'sub')
  );

drop policy if exists "owners delete their images" on storage.objects;
create policy "owners delete their images" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'journey-map-images'
    and (storage.foldername(name))[1] = (select auth.jwt() ->> 'sub')
  );
