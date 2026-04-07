import { useOrganization, useOrganizationList, useUser } from '@clerk/clerk-react';
import { Plus, Rocket } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { asuNondegreeProject } from '../../../builder';
import { listPublishedJourneyMaps, saveDraftProject } from '../../../builder/draftStorage';
import { listJourneyMapProjects } from '../../../builder/repository';
import { hasSupabaseConfig } from '../../../builder/supabase';
import type { JourneyMapProject } from '../../../builder/types';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export function BuilderDashboard() {
  const { user } = useUser();
  const { organization } = useOrganization();
  const { userMemberships } = useOrganizationList({ userMemberships: true });
  const [projects, setProjects] = useState<JourneyMapProject[]>([]);
  const [newMapTitle, setNewMapTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const refreshProjects = () => {
    listJourneyMapProjects().then(setProjects);
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  const currentOrg = useMemo(
    () => ({
      id: organization?.id ?? asuNondegreeProject.organization.id,
      slug: organization?.slug ?? asuNondegreeProject.organization.slug,
      name: organization?.name ?? asuNondegreeProject.organization.name,
    }),
    [organization],
  );

  const publishedSites = useMemo(() => listPublishedJourneyMaps(currentOrg.slug), [currentOrg.slug, projects]);

  const handleCreateMap = () => {
    const title = newMapTitle.trim();
    if (!title) return;

    const slugBase = slugify(title) || `journey-map-${Date.now().toString(36)}`;
    const existingSlugs = new Set(projects.filter((project) => project.organization.slug === currentOrg.slug).map((project) => project.map.slug));
    let slug = slugBase;
    let counter = 2;

    while (existingSlugs.has(slug)) {
      slug = `${slugBase}-${counter}`;
      counter += 1;
    }

    const clonedMap = JSON.parse(JSON.stringify(asuNondegreeProject.map)) as JourneyMapProject['map'];
    const newProject: JourneyMapProject = {
      organization: currentOrg,
      map: {
        ...clonedMap,
        id: slug,
        slug,
        title,
        brand: {
          ...clonedMap.brand,
          title,
        },
        publishing: {
          ...clonedMap.publishing,
          siteSlug: slug,
        },
      },
    };

    saveDraftProject(newProject);
    setNewMapTitle('');
    setCreating(false);
    refreshProjects();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="mx-auto max-w-[1200px] px-[24px] py-[32px] md:px-[40px] md:py-[48px]">
        <div className="mb-[32px] flex flex-col gap-[12px]">
          <p className="text-[14px] text-[#8C1D40]" style={{ fontWeight: 'bold' }}>Journey Map Builder</p>
          <div className="flex flex-wrap items-start justify-between gap-[16px]">
            <div className="max-w-[760px]">
              <h1 className="text-[36px] leading-[1.05] tracking-[-1.2px] text-[#191919]" style={{ fontWeight: 'bold' }}>
                Builder home
              </h1>
              <p className="text-[18px] leading-[1.5] text-[#5f5f5f]">
                Create and manage multiple journey maps, preview drafts, publish named URLs, and prepare clean exports for presentations and decks.
              </p>
            </div>
            <Link
              to="/"
              className="rounded-full border border-black/10 bg-white px-[16px] py-[10px] text-[14px] text-[#191919] transition-all duration-150 hover:bg-[#f0f0f0] active:scale-[0.98] cursor-pointer"
              style={{ fontWeight: 'bold' }}
            >
              Open preview map
            </Link>
          </div>
        </div>

        <div className="mb-[24px] grid gap-[16px] md:grid-cols-3">
          <div className="rounded-[16px] border border-black/10 bg-white p-[20px]">
            <p className="mb-[8px] text-[14px] text-[#767676]">Signed in user</p>
            <p className="text-[20px] text-[#191919]" style={{ fontWeight: 'bold' }}>
              {user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? 'Authenticated user'}
            </p>
          </div>
          <div className="rounded-[16px] border border-black/10 bg-white p-[20px]">
            <p className="mb-[8px] text-[14px] text-[#767676]">Active organization</p>
            <p className="text-[20px] text-[#191919]" style={{ fontWeight: 'bold' }}>
              {organization?.name ?? 'No active organization selected'}
            </p>
          </div>
          <div className="rounded-[16px] border border-black/10 bg-white p-[20px]">
            <p className="mb-[8px] text-[14px] text-[#767676]">Persistence</p>
            <p className="text-[20px] text-[#191919]" style={{ fontWeight: 'bold' }}>
              {hasSupabaseConfig ? 'Supabase configured' : 'Local draft registry'}
            </p>
          </div>
        </div>

        <div className="mb-[24px] rounded-[20px] border border-black/10 bg-white p-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="flex flex-wrap items-start justify-between gap-[16px]">
            <div className="max-w-[700px]">
              <p className="mb-[8px] text-[24px] text-[#191919]" style={{ fontWeight: 'bold' }}>Create a new journey map</p>
              <p className="text-[16px] leading-[1.5] text-[#5f5f5f]">
                Start from the current template and customize content, states, steps, publishing URL, and exports for a new audience or project.
              </p>
            </div>
            <button
              onClick={() => setCreating((value) => !value)}
              className="inline-flex items-center gap-[8px] rounded-full bg-[#8C1D40] px-[18px] py-[10px] text-[14px] text-white transition-all duration-150 hover:bg-[#7a1938] active:scale-[0.98] cursor-pointer"
              style={{ fontWeight: 'bold' }}
            >
              <Plus className="size-[16px]" />
              {creating ? 'Close' : 'New map'}
            </button>
          </div>

          {creating && (
            <div className="mt-[16px] grid gap-[12px] md:grid-cols-[1fr_auto]">
              <input
                value={newMapTitle}
                onChange={(event) => setNewMapTitle(event.target.value)}
                placeholder="Enter a new map title"
                className="rounded-[12px] border border-black/10 bg-[#FAFAFA] px-[14px] py-[12px] text-[16px] text-[#191919] outline-none"
              />
              <button
                onClick={handleCreateMap}
                className="rounded-[12px] border border-black/10 bg-white px-[18px] py-[12px] text-[14px] text-[#191919] transition-all duration-150 hover:bg-[#f0f0f0] active:scale-[0.98] cursor-pointer"
                style={{ fontWeight: 'bold' }}
              >
                Create map
              </button>
            </div>
          )}
        </div>

        {userMemberships.data && userMemberships.data.length > 0 && (
          <div className="mb-[24px] rounded-[16px] bg-white p-[16px]">
            <p className="mb-[8px] text-[14px] text-[#767676]">Organization memberships</p>
            <div className="flex flex-wrap gap-[8px]">
              {userMemberships.data.map((membership) => (
                <div
                  key={membership.organization.id}
                  className="rounded-full border border-black/10 bg-[#FAFAFA] px-[12px] py-[8px] text-[14px] text-[#191919]"
                >
                  {membership.organization.name}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-[16px]">
          {projects
            .filter((project) => project.organization.slug === currentOrg.slug)
            .map((project) => {
              const publishedSite = publishedSites.find((site) => site.mapSlug === project.map.slug);
              const previewPath = `/preview/${project.organization.slug}/${project.map.slug}`;
              const publishedPath = publishedSite ? `/published/${publishedSite.orgSlug}/${publishedSite.siteSlug}` : null;

              return (
                <div
                  key={`${project.organization.slug}-${project.map.slug}`}
                  className="rounded-[20px] border border-black/10 bg-white p-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex flex-col gap-[14px] md:flex-row md:items-start md:justify-between">
                    <div className="flex flex-col gap-[8px]">
                      <div className="inline-flex w-fit items-center gap-[8px] rounded-full bg-[#FAFAFA] px-[12px] py-[6px] text-[13px] text-[#5f5f5f]">
                        <Rocket className="size-[14px]" />
                        {publishedSite ? `Published as /published/${publishedSite.orgSlug}/${publishedSite.siteSlug}` : 'Draft only'}
                      </div>
                      <p className="text-[28px] leading-[1.05] text-[#191919]" style={{ fontWeight: 'bold' }}>
                        {project.map.title}
                      </p>
                      <p className="text-[16px] leading-[1.5] text-[#5f5f5f]">
                        {project.map.stages.length} stages, {project.map.currentStateMarkers.length} {project.map.stateLabels.current.toLowerCase()} steps, {project.map.futureStateMarkers.length} {project.map.stateLabels.future.toLowerCase()} steps
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-[10px]">
                      <Link
                        to={previewPath}
                        className="rounded-full border border-black/10 bg-[#FAFAFA] px-[16px] py-[10px] text-[14px] text-[#191919] transition-all duration-150 hover:bg-[#f0f0f0] active:scale-[0.98] cursor-pointer"
                        style={{ fontWeight: 'bold' }}
                      >
                        Open preview map
                      </Link>
                      {publishedPath && (
                        <Link
                          to={publishedPath}
                          className="rounded-full border border-black/10 bg-[#FAFAFA] px-[16px] py-[10px] text-[14px] text-[#191919] transition-all duration-150 hover:bg-[#f0f0f0] active:scale-[0.98] cursor-pointer"
                          style={{ fontWeight: 'bold' }}
                        >
                          Open published map
                        </Link>
                      )}
                      <Link
                        to={`/app/orgs/${project.organization.slug}/maps/${project.map.slug}`}
                        className="rounded-full bg-[#8C1D40] px-[18px] py-[10px] text-[14px] text-white transition-all duration-150 hover:bg-[#7a1938] active:scale-[0.98] cursor-pointer"
                        style={{ fontWeight: 'bold' }}
                      >
                        Open builder
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
