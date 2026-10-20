import type { JourneyMapProject } from './types';

// Drafts and published maps used to live in this browser's localStorage. They now live in
// Supabase so they are available on every device. This file only reads the old data so it
// can be moved to the cloud once, then removes it.

const draftIndexStorageKey = 'journey-map-draft-index';
const draftKeyPrefix = 'journey-map-draft:';
const publishedSitesStorageKey = 'journey-map-published-sites';

interface LegacyPublishedSnapshot {
  siteSlug: string;
  mapSlug: string;
  project: JourneyMapProject;
}

export interface LegacyLocalData {
  projects: JourneyMapProject[];
  clear: () => void;
}

function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function readLegacyLocalData(): LegacyLocalData | null {
  if (typeof window === 'undefined') return null;

  const index = readJson<string[]>(draftIndexStorageKey) ?? [];
  const published = readJson<LegacyPublishedSnapshot[]>(publishedSitesStorageKey) ?? [];

  const projects = new Map<string, JourneyMapProject>();
  index.forEach((slug) => {
    const project = readJson<JourneyMapProject>(`${draftKeyPrefix}${slug}`);
    if (project?.map) projects.set(project.map.slug, project);
  });
  published.forEach((snapshot) => {
    if (snapshot.project?.map && !projects.has(snapshot.project.map.slug)) {
      projects.set(snapshot.project.map.slug, snapshot.project);
    }
  });

  if (projects.size === 0) return null;

  return {
    projects: Array.from(projects.values()),
    clear: () => {
      index.forEach((slug) => window.localStorage.removeItem(`${draftKeyPrefix}${slug}`));
      window.localStorage.removeItem(draftIndexStorageKey);
      window.localStorage.removeItem(publishedSitesStorageKey);
    },
  };
}
