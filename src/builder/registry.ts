import type { JourneyMapProject } from './types';
import { asuNondegreeProject } from './projects/asuNondegree';

export const journeyMapProjects: JourneyMapProject[] = [asuNondegreeProject];

export function getJourneyMapProject(orgSlug: string, mapSlug: string) {
  return journeyMapProjects.find(
    (project) => project.organization.slug === orgSlug && project.map.slug === mapSlug,
  );
}
