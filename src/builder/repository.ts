import { journeyMapProjects, getJourneyMapProject as getSeedJourneyMapProject } from './registry';
import { supabase } from './supabase';
import type { BuilderJourneyMapRecord, BuilderJourneyMapVersionRecord, BuilderOrganizationRecord } from './persistence';
import type { JourneyMapProject } from './types';
import { listDraftProjects, loadDraftProject } from './draftStorage';

interface JourneyMapWithRelations extends BuilderJourneyMapRecord {
  organizations: BuilderOrganizationRecord | null;
  current_version: Pick<BuilderJourneyMapVersionRecord, 'configJson'> | null;
}

function normalizeProject(row: JourneyMapWithRelations): JourneyMapProject | null {
  if (!row.organizations || !row.current_version?.configJson) return null;

  return {
    organization: {
      id: row.organizations.id,
      slug: row.organizations.slug,
      name: row.organizations.name,
    },
    map: row.current_version.configJson,
  };
}

export async function listJourneyMapProjects(): Promise<JourneyMapProject[]> {
  if (!supabase) {
    const localDrafts = listDraftProjects();
    const merged = new Map<string, JourneyMapProject>();

    [...journeyMapProjects, ...localDrafts].forEach((project) => {
      merged.set(`${project.organization.slug}:${project.map.slug}`, project);
    });

    return Array.from(merged.values());
  }

  const { data, error } = await supabase
    .from('journey_maps')
    .select(`
      id,
      organization_id,
      slug,
      title,
      description,
      status,
      current_version_id,
      published_version_id,
      created_by,
      created_at,
      updated_at,
      organizations (
        id,
        slug,
        name,
        logo_url,
        favicon_url,
        created_at,
        updated_at
      ),
      current_version:journey_map_versions!journey_maps_current_version_fk (
        configJson:config_json
      )
    `)
    .order('updated_at', { ascending: false });

  if (error || !data) {
    return journeyMapProjects;
  }

  const normalized = (data as unknown as JourneyMapWithRelations[])
    .map(normalizeProject)
    .filter((project): project is JourneyMapProject => Boolean(project));

  const localDrafts = listDraftProjects();
  const merged = new Map<string, JourneyMapProject>();

  [...(normalized.length > 0 ? normalized : journeyMapProjects), ...localDrafts].forEach((project) => {
    merged.set(`${project.organization.slug}:${project.map.slug}`, project);
  });

  return Array.from(merged.values());
}

export async function getJourneyMapProject(orgSlug: string, mapSlug: string): Promise<JourneyMapProject | null> {
  const localDraft = loadDraftProject(orgSlug, mapSlug);
  if (localDraft) {
    return localDraft;
  }

  if (!supabase) {
    return getSeedJourneyMapProject(orgSlug, mapSlug) ?? null;
  }

  const { data, error } = await supabase
    .from('journey_maps')
    .select(`
      id,
      organization_id,
      slug,
      title,
      description,
      status,
      current_version_id,
      published_version_id,
      created_by,
      created_at,
      updated_at,
      organizations!inner (
        id,
        slug,
        name,
        logo_url,
        favicon_url,
        created_at,
        updated_at
      ),
      current_version:journey_map_versions!journey_maps_current_version_fk (
        configJson:config_json
      )
    `)
    .eq('slug', mapSlug)
    .eq('organizations.slug', orgSlug)
    .maybeSingle();

  if (error || !data) {
    return getSeedJourneyMapProject(orgSlug, mapSlug) ?? null;
  }

  return normalizeProject(data as unknown as JourneyMapWithRelations) ?? getSeedJourneyMapProject(orgSlug, mapSlug) ?? null;
}
