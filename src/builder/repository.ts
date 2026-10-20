import { getJourneyMapProjectBySlug as getSeedJourneyMapProjectBySlug } from './registry';
import { readLegacyLocalData } from './draftStorage';
import { isInlineImage, uploadDataUrlImage } from './images';
import { normalizeMapConfig } from './normalize';
import { getSignedInUserId, hasSupabaseConfig, supabase } from './supabase';
import type { JourneyMapConfig, JourneyMapProject } from './types';

export interface BuilderMapListItem {
  project: JourneyMapProject;
  siteSlug: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
  hasUnpublishedChanges: boolean;
}

interface JourneyMapRow {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  draft_json: JourneyMapConfig | null;
  draft_updated_at: string | null;
  site_slug: string | null;
  published_at: string | null;
  updated_at: string | null;
  published_version: { config_json: JourneyMapConfig } | null;
}

const mapSelect = `
  id,
  slug,
  title,
  status,
  draft_json,
  draft_updated_at,
  site_slug,
  published_at,
  updated_at,
  published_version:journey_map_versions!journey_maps_published_version_fk (
    config_json
  )
`;

const wakeRetryDelaysMs = [1200, 2600];

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

// Free-tier Supabase projects can take a moment to wake up, so retry transient failures.
async function withWakeRetry<T>(fn: () => PromiseLike<T>, shouldRetry: (result: T) => boolean) {
  let result = await fn();
  for (const delay of wakeRetryDelaysMs) {
    if (!shouldRetry(result)) return result;
    await wait(delay);
    result = await fn();
  }
  return result;
}

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Cloud storage is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart.',
    );
  }
  return supabase;
}

async function requireUserId() {
  const userId = await getSignedInUserId();
  if (!userId) throw new Error('Sign in to save your maps.');
  return userId;
}

function toListItem(row: JourneyMapRow): BuilderMapListItem | null {
  const config = row.draft_json ?? row.published_version?.config_json;
  if (!config) return null;

  const draftTime = row.draft_updated_at ? Date.parse(row.draft_updated_at) : 0;
  const publishedTime = row.published_at ? Date.parse(row.published_at) : 0;

  return {
    project: { map: normalizeMapConfig(config) },
    siteSlug: row.site_slug,
    publishedAt: row.published_at,
    updatedAt: row.draft_updated_at ?? row.updated_at,
    hasUnpublishedChanges: Boolean(row.site_slug) && draftTime > publishedTime + 1000,
  };
}

async function fetchMyMapRow(slug: string): Promise<JourneyMapRow | null> {
  const client = requireSupabase();
  const { data, error } = await withWakeRetry(
    () => client.from('journey_maps').select(mapSelect).eq('slug', slug).maybeSingle(),
    ({ error }) => Boolean(error),
  );
  if (error) throw new Error(`Could not load this map: ${error.message}`);
  return (data as unknown as JourneyMapRow | null) ?? null;
}

/** Every map the signed-in user owns, newest first. Drafts and publish info come from the cloud. */
export async function listMyMaps(): Promise<BuilderMapListItem[]> {
  const client = requireSupabase();
  await requireUserId();

  const { data, error } = await withWakeRetry(
    () => client.from('journey_maps').select(mapSelect).order('updated_at', { ascending: false }),
    ({ error }) => Boolean(error),
  );
  if (error) throw new Error(`Could not load your maps: ${error.message}`);

  return (data as unknown as JourneyMapRow[])
    .map(toListItem)
    .filter((item): item is BuilderMapListItem => Boolean(item));
}

/** Loads a map for the editor or preview: the saved cloud draft, or the starter template. */
export async function getJourneyMapProject(_orgSlug: string, mapSlug: string): Promise<JourneyMapProject | null> {
  if (hasSupabaseConfig) {
    const row = await fetchMyMapRow(mapSlug);
    const item = row ? toListItem(row) : null;
    if (item) return item.project;
  }

  const seed = getSeedJourneyMapProjectBySlug(mapSlug);
  return seed ? { map: normalizeMapConfig(seed.map) } : null;
}

export async function getJourneyMapProjectBySlug(mapSlug: string): Promise<JourneyMapProject | null> {
  return getJourneyMapProject('', mapSlug);
}

async function saveDraftRow(project: JourneyMapProject, userId: string) {
  const client = requireSupabase();
  const now = new Date().toISOString();
  const { map } = project;

  const { data: existing, error: lookupError } = await client
    .from('journey_maps')
    .select('id')
    .eq('owner_id', userId)
    .eq('slug', map.slug)
    .maybeSingle();
  if (lookupError) throw new Error(`Could not save: ${lookupError.message}`);

  if (existing) {
    const { error } = await client
      .from('journey_maps')
      .update({ title: map.title, draft_json: map, draft_updated_at: now, updated_at: now })
      .eq('id', existing.id);
    if (error) throw new Error(`Could not save: ${error.message}`);
    return { id: existing.id as string, savedAt: now };
  }

  const { data: inserted, error } = await client
    .from('journey_maps')
    .insert({
      owner_id: userId,
      slug: map.slug,
      title: map.title,
      status: 'draft',
      draft_json: map,
      draft_updated_at: now,
    })
    .select('id')
    .single();
  if (error || !inserted) throw new Error(`Could not save: ${error?.message ?? 'unknown error'}`);
  return { id: inserted.id as string, savedAt: now };
}

/** Saves the draft to the cloud so it can be opened from any device. */
export async function saveDraftProject(project: JourneyMapProject): Promise<{ savedAt: string }> {
  const userId = await requireUserId();
  const { savedAt } = await saveDraftRow(project, userId);
  return { savedAt };
}

/** Publishes the draft to a public link that anyone can open without signing in. */
export async function publishJourneyMapProject(
  project: JourneyMapProject,
): Promise<{ siteSlug: string; publishedAt: string; project: JourneyMapProject }> {
  const client = requireSupabase();
  const userId = await requireUserId();

  const siteSlug = project.map.publishing.siteSlug || project.map.slug;
  const publishedAt = new Date().toISOString();
  const publishedProject: JourneyMapProject = {
    map: {
      ...project.map,
      publishing: { ...project.map.publishing, siteSlug, lastPublishedAt: publishedAt },
    },
  };

  const { id: mapId } = await saveDraftRow(publishedProject, userId);

  const { data: latest } = await client
    .from('journey_map_versions')
    .select('version_number')
    .eq('journey_map_id', mapId)
    .order('version_number', { ascending: false })
    .limit(1);
  const nextVersion = ((latest?.[0]?.version_number as number | undefined) ?? 0) + 1;

  const { data: version, error: versionError } = await client
    .from('journey_map_versions')
    .insert({
      journey_map_id: mapId,
      version_number: nextVersion,
      config_json: publishedProject.map,
      change_note: 'Published from builder',
      created_by: userId,
    })
    .select('id')
    .single();
  if (versionError || !version) {
    throw new Error(`Publish failed: ${versionError?.message ?? 'unknown error'}`);
  }

  const { error: publishError } = await client
    .from('journey_maps')
    .update({
      status: 'published',
      site_slug: siteSlug,
      current_version_id: version.id,
      published_version_id: version.id,
      published_at: publishedAt,
      updated_at: publishedAt,
      draft_updated_at: publishedAt,
    })
    .eq('id', mapId);

  if (publishError) {
    if (publishError.code === '23505') {
      throw new Error(`The link "${siteSlug}" is already used by another map. Pick a different published URL slug.`);
    }
    throw new Error(`Publish failed: ${publishError.message}`);
  }

  return { siteSlug, publishedAt, project: publishedProject };
}

/** Reads a published map for any visitor, signed in or not. */
export async function getPublishedJourneyMapBySiteSlug(siteSlug: string): Promise<JourneyMapProject | null> {
  const client = requireSupabase();

  const { data, error } = await withWakeRetry(
    () => client.rpc('get_published_journey_map', { p_site_slug: siteSlug }),
    ({ error }) => Boolean(error),
  );
  if (error) throw new Error(`Could not load this published map: ${error.message}`);

  const config = (data as { config?: JourneyMapConfig } | null)?.config;
  return config ? { map: normalizeMapConfig(config) } : null;
}

async function moveInlineImagesToHosting(map: JourneyMapConfig): Promise<JourneyMapConfig> {
  const cache = new Map<string, string>();
  const host = async (value: string | undefined) => {
    if (!isInlineImage(value)) return value;
    if (!cache.has(value)) cache.set(value, await uploadDataUrlImage(value));
    return cache.get(value);
  };

  const hostMarkers = async <T extends { beforeImage?: string; afterImage?: string }>(markers: T[]) => {
    const next: T[] = [];
    for (const marker of markers) {
      next.push({ ...marker, beforeImage: await host(marker.beforeImage), afterImage: await host(marker.afterImage) });
    }
    return next;
  };

  const personas = [];
  for (const persona of map.futurePersonas ?? []) {
    personas.push({ ...persona, markers: await hostMarkers(persona.markers) });
  }

  return {
    ...map,
    futureStateMarkers: await hostMarkers(map.futureStateMarkers),
    futurePersonas: personas,
  };
}

/**
 * One-time move of drafts that older versions kept in this browser's localStorage into the
 * signed-in user's cloud library. Local data is removed only after everything uploaded.
 */
export async function importLegacyLocalDrafts(existingSlugs: Set<string>): Promise<number> {
  const legacy = readLegacyLocalData();
  if (!legacy) return 0;

  const userId = await requireUserId();
  const taken = new Set(existingSlugs);
  let imported = 0;

  for (const project of legacy.projects) {
    let slug = project.map.slug;
    let title = project.map.title;
    if (taken.has(slug)) {
      let counter = 2;
      while (taken.has(`${slug}-imported-${counter}`)) counter += 1;
      slug = `${slug}-imported-${counter}`;
      title = `${title} (imported)`;
    }

    const hosted = await moveInlineImagesToHosting(project.map);
    await saveDraftRow(
      {
        map: {
          ...hosted,
          id: slug,
          slug,
          title,
          publishing: { ...hosted.publishing, siteSlug: slug, lastPublishedAt: undefined },
        },
      },
      userId,
    );
    taken.add(slug);
    imported += 1;
  }

  legacy.clear();
  return imported;
}
