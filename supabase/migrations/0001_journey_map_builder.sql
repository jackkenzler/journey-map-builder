create extension if not exists pgcrypto;

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  logo_url text,
  favicon_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  clerk_user_id text not null,
  role text not null check (role in ('owner', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  unique (organization_id, clerk_user_id)
);

create table if not exists journey_maps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  current_version_id uuid,
  published_version_id uuid,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists journey_map_versions (
  id uuid primary key default gen_random_uuid(),
  journey_map_id uuid not null references journey_maps(id) on delete cascade,
  version_number integer not null,
  config_json jsonb not null,
  change_note text,
  created_by text,
  created_at timestamptz not null default now(),
  unique (journey_map_id, version_number)
);

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  journey_map_id uuid references journey_maps(id) on delete cascade,
  kind text not null check (kind in ('logo', 'favicon', 'comparison-before', 'comparison-after', 'icon', 'other')),
  file_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  metadata_json jsonb not null default '{}'::jsonb,
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists published_sites (
  id uuid primary key default gen_random_uuid(),
  journey_map_id uuid not null references journey_maps(id) on delete cascade,
  journey_map_version_id uuid not null references journey_map_versions(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  published_url text,
  published_at timestamptz not null default now(),
  published_by text
);

alter table journey_maps
  add constraint journey_maps_current_version_fk
  foreign key (current_version_id) references journey_map_versions(id) on delete set null;

alter table journey_maps
  add constraint journey_maps_published_version_fk
  foreign key (published_version_id) references journey_map_versions(id) on delete set null;

create index if not exists journey_maps_org_idx on journey_maps (organization_id);
create index if not exists journey_map_versions_map_idx on journey_map_versions (journey_map_id, version_number desc);
create index if not exists assets_org_idx on assets (organization_id, kind);
create index if not exists assets_map_idx on assets (journey_map_id);

-- Row-level security is the intended next step.
-- Recommended policy model:
-- 1. Users can read/write rows only for organizations where they have membership.
-- 2. Public published map reads should happen through a separate published view or server-side route.
