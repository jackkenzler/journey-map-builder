# Journey Map Builder Architecture

## Product Goal

Build a multi-tenant "Journey Map Builder" that lets many organizations create, edit, preview, version, and publish many journey maps with no code changes required for day-to-day content updates.

The current ASU journey map becomes the first seeded project in that system.

## Recommended Stack

This is the fastest practical stack to ship while staying scalable:

- Frontend app: current Vite + React app
- Authentication + organizations: Clerk
- Database + file storage: Supabase
- Hosting: Vercel
- Authoring model: config-driven journey map schema stored in Postgres

## Why This Stack

Clerk gives us the fastest path to:

- sign-in
- organizations/workspaces
- invites
- role-aware UI

Supabase gives us the fastest path to:

- Postgres tables
- object storage for before/after images
- versionable JSON configs
- row-level security when needed

This avoids building auth, org management, uploads, and access control from scratch.

## Core Product Concepts

- User: a person who signs in
- Organization: a tenant such as a university, college, or client team
- Membership: a user's role in an organization
- Journey Map: a reusable map owned by an organization
- Journey Version: a versioned snapshot of map configuration
- Asset: uploaded image or icon attached to a map/version
- Published Site: a public render target for a specific version

## Recommended Roles

- Owner: manage org settings, billing, members, publish controls
- Editor: edit maps, upload assets, create versions, publish
- Viewer: view drafts and published maps

## Data Model

### organizations

- id
- slug
- name
- logo_url
- favicon_url
- created_at
- updated_at

### organization_members

- id
- organization_id
- user_id
- role
- created_at

### journey_maps

- id
- organization_id
- slug
- title
- description
- status
- current_version_id
- published_version_id
- created_by
- created_at
- updated_at

### journey_map_versions

- id
- journey_map_id
- version_number
- config_json
- change_note
- created_by
- created_at

### assets

- id
- organization_id
- journey_map_id
- kind
- file_path
- file_name
- mime_type
- size_bytes
- metadata_json
- created_by
- created_at

### published_sites

- id
- journey_map_id
- journey_map_version_id
- organization_id
- published_url
- published_at
- published_by

## Config-Driven Rendering Model

Every journey map should render from one canonical config object.

That config should contain:

- brand settings
- global theme tokens
- stage definitions
- current-state marker content and placement
- future-state marker content and placement
- guided-tour copy
- summary-card content
- comparison image references
- modal/platform content

This removes the need for each client to modify React components directly.

## Config Ownership

Use versioned JSON in the database as the source of truth.

Each version should be immutable after creation.

Publishing should point a map to one version. That makes rollback easy.

## Editing Experience

The admin should eventually support:

- organization switcher
- list of maps
- draft vs published versions
- inline text editing
- asset uploads
- desktop/mobile position controls
- side selection for labels
- theme editing
- preview mode
- publish action

## MVP Scope

Phase 1:

- sign-in
- organizations
- many maps per organization
- config schema in code
- current ASU map moved into a single config object
- draft preview from config

Phase 2:

- database-backed configs
- asset uploads
- create duplicate map
- publish version

Phase 3:

- visual position editor
- version history UI
- collaboration workflows
- map templates

## Publishing Model

Recommended publishing pattern:

- Builder app stays private/authenticated
- Published maps are public read-only pages
- Public pages render a specific published version

That keeps the authoring experience secure while making published maps easy to share.

## Suggested URL Structure

- `/app` - authenticated builder
- `/app/orgs/:orgSlug/maps` - map list
- `/app/orgs/:orgSlug/maps/:mapSlug/edit` - editor
- `/app/orgs/:orgSlug/maps/:mapSlug/preview` - preview
- `/:orgSlug/:mapSlug` - public published map

## What To Build Next

1. Define a stable TypeScript schema for map configs
2. Move the current ASU content into a single project config
3. Refactor the renderer to consume that config
4. Add auth and org shell
5. Move configs/assets into database + storage

## Shipping Recommendation

The quickest scalable version is:

- keep the current Vite app
- make the renderer fully config-driven
- then add Clerk + Supabase for multi-tenant authoring

That gets to a working builder much faster than rewriting the whole app first.
