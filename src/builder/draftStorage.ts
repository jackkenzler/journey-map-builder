import type { JourneyMapProject } from './types';

const draftIndexStorageKey = 'journey-map-draft-index';
const publishedSitesStorageKey = 'journey-map-published-sites';

export interface PublishedJourneyMapSnapshot {
  id: string;
  orgSlug: string;
  orgName: string;
  mapSlug: string;
  mapTitle: string;
  siteSlug: string;
  publishedAt: string;
  project: JourneyMapProject;
}

function getDraftStorageKey(orgSlug: string, mapSlug: string) {
  return `journey-map-draft:${orgSlug}:${mapSlug}`;
}

function loadDraftIndex(): Array<{ orgSlug: string; mapSlug: string }> {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(draftIndexStorageKey);
    if (!raw) return [];
    return JSON.parse(raw) as Array<{ orgSlug: string; mapSlug: string }>;
  } catch {
    return [];
  }
}

function saveDraftIndex(index: Array<{ orgSlug: string; mapSlug: string }>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(draftIndexStorageKey, JSON.stringify(index));
}

function upsertDraftIndex(orgSlug: string, mapSlug: string) {
  const index = loadDraftIndex().filter((item) => !(item.orgSlug === orgSlug && item.mapSlug === mapSlug));
  index.unshift({ orgSlug, mapSlug });
  saveDraftIndex(index);
}

function removeDraftIndex(orgSlug: string, mapSlug: string) {
  const index = loadDraftIndex().filter((item) => !(item.orgSlug === orgSlug && item.mapSlug === mapSlug));
  saveDraftIndex(index);
}

export function loadDraftProject(orgSlug: string, mapSlug: string): JourneyMapProject | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(getDraftStorageKey(orgSlug, mapSlug));
    if (!raw) return null;
    return JSON.parse(raw) as JourneyMapProject;
  } catch {
    return null;
  }
}

export function listDraftProjects(): JourneyMapProject[] {
  return loadDraftIndex()
    .map((item) => loadDraftProject(item.orgSlug, item.mapSlug))
    .filter((project): project is JourneyMapProject => Boolean(project));
}

export function saveDraftProject(project: JourneyMapProject) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    getDraftStorageKey(project.organization.slug, project.map.slug),
    JSON.stringify(project),
  );
  upsertDraftIndex(project.organization.slug, project.map.slug);
}

export function clearDraftProject(orgSlug: string, mapSlug: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(getDraftStorageKey(orgSlug, mapSlug));
  removeDraftIndex(orgSlug, mapSlug);
}

function loadPublishedSites(): PublishedJourneyMapSnapshot[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(publishedSitesStorageKey);
    if (!raw) return [];
    return JSON.parse(raw) as PublishedJourneyMapSnapshot[];
  } catch {
    return [];
  }
}

function savePublishedSites(sites: PublishedJourneyMapSnapshot[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(publishedSitesStorageKey, JSON.stringify(sites));
}

export function listPublishedJourneyMaps(orgSlug?: string) {
  const sites = loadPublishedSites();
  return orgSlug ? sites.filter((site) => site.orgSlug === orgSlug) : sites;
}

export function savePublishedJourneyMap(project: JourneyMapProject, siteSlug: string) {
  const publishedAt = new Date().toISOString();
  const snapshot: PublishedJourneyMapSnapshot = {
    id: `${project.organization.slug}:${siteSlug}`,
    orgSlug: project.organization.slug,
    orgName: project.organization.name,
    mapSlug: project.map.slug,
    mapTitle: project.map.title,
    siteSlug,
    publishedAt,
    project: {
      ...project,
      map: {
        ...project.map,
        publishing: {
          ...project.map.publishing,
          siteSlug,
          lastPublishedAt: publishedAt,
        },
      },
    },
  };

  const sites = loadPublishedSites().filter((site) => !(site.orgSlug === snapshot.orgSlug && site.siteSlug === snapshot.siteSlug));
  sites.unshift(snapshot);
  savePublishedSites(sites);
  return snapshot;
}

export function loadPublishedJourneyMap(orgSlug: string, siteSlug: string): PublishedJourneyMapSnapshot | null {
  const sites = loadPublishedSites();
  return sites.find((site) => site.orgSlug === orgSlug && site.siteSlug === siteSlug) ?? null;
}
