import { useUser } from '@clerk/clerk-react';
import { toPng } from 'html-to-image';
import { ArrowUpRight, Download, PenSquare, Plus, Rocket } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import journeyMapBuilderPhone from '../../../assets/journey-map-builder-phone.png';
import { asuNondegreeProject } from '../../../builder';
import { getBuilderRole } from '../../../builder/access';
import {
  importLegacyLocalDrafts,
  listMyMaps,
  saveDraftProject,
  type BuilderMapListItem,
} from '../../../builder/repository';
import type { JourneyMapProject } from '../../../builder/types';
import { JourneyMap } from '../JourneyMap';

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
  const navigate = useNavigate();
  const [items, setItems] = useState<BuilderMapListItem[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [newMapTitle, setNewMapTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [isCreatingMap, setIsCreatingMap] = useState(false);
  const [exportProject, setExportProject] = useState<JourneyMapProject | null>(null);
  const [exportingProjectKey, setExportingProjectKey] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const builderRole = getBuilderRole(user);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        let loaded = await listMyMaps();
        if (cancelled) return;
        setItems(loaded);

        // Older versions kept drafts in this browser only. Move them into the account once.
        const imported = await importLegacyLocalDrafts(new Set(loaded.map((item) => item.project.map.slug)));
        if (cancelled || imported === 0) return;
        loaded = await listMyMaps();
        if (cancelled) return;
        setItems(loaded);
        setNotice(
          `Moved ${imported} draft${imported === 1 ? '' : 's'} from this browser into your account. They are now available on any device.`,
        );
      } catch (error) {
        if (cancelled) return;
        setLoadError(error instanceof Error ? error.message : 'Could not load your maps.');
        setItems((current) => current ?? []);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const starterProject = useMemo<JourneyMapProject>(
    () => ({
      map: {
        ...JSON.parse(JSON.stringify(asuNondegreeProject.map)),
        publishing: {
          ...asuNondegreeProject.map.publishing,
          siteSlug: asuNondegreeProject.map.slug,
        },
      },
    }),
    [],
  );

  const isStarterOnly = items !== null && items.length === 0;
  const displayedItems = useMemo<BuilderMapListItem[]>(() => {
    if (items === null) return [];
    if (items.length > 0) return items;
    return [
      {
        project: starterProject,
        siteSlug: null,
        publishedAt: null,
        updatedAt: null,
        hasUnpublishedChanges: false,
      },
    ];
  }, [items, starterProject]);

  useEffect(() => {
    if (!exportProject || !exportRef.current) return;

    let cancelled = false;

    const runExport = async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 50));
      if (!exportRef.current || cancelled) return;

      try {
        const dataUrl = await toPng(exportRef.current, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: exportProject.map.theme.pageBackground,
        });

        if (cancelled) return;

        const link = document.createElement('a');
        link.download = `${exportProject.map.slug}.png`;
        link.href = dataUrl;
        link.click();
      } finally {
        if (!cancelled) {
          setExportProject(null);
          setExportingProjectKey(null);
        }
      }
    };

    runExport();

    return () => {
      cancelled = true;
    };
  }, [exportProject]);

  const handleCreateMap = async () => {
    const title = newMapTitle.trim();
    if (!title || isCreatingMap) return;

    const slugBase = slugify(title) || `journey-map-${Date.now().toString(36)}`;
    const existingSlugs = new Set((items ?? []).map((item) => item.project.map.slug));
    let slug = slugBase;
    let counter = 2;

    while (existingSlugs.has(slug)) {
      slug = `${slugBase}-${counter}`;
      counter += 1;
    }

    const clonedMap = JSON.parse(JSON.stringify(asuNondegreeProject.map)) as JourneyMapProject['map'];
    const newProject: JourneyMapProject = {
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

    setIsCreatingMap(true);
    setNotice(null);
    try {
      await saveDraftProject(newProject);
      setNewMapTitle('');
      setCreating(false);
      navigate(`/app/maps/${newProject.map.slug}`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not create the map.');
    } finally {
      setIsCreatingMap(false);
    }
  };

  const handleDownloadPng = (project: JourneyMapProject) => {
    setExportingProjectKey(project.map.slug);
    setExportProject(project);
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
          </div>
        </div>

        <div className="mb-[24px] grid gap-[16px] md:grid-cols-3">
          <div className="rounded-[16px] border border-black/10 bg-white p-[20px]">
            <p className="mb-[8px] text-[14px] text-[#767676]">Signed in account</p>
            <p className="text-[20px] text-[#191919]" style={{ fontWeight: 'bold' }}>
              {user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? 'Authenticated user'}
            </p>
          </div>
          <div className="rounded-[16px] border border-black/10 bg-white p-[20px]">
            <p className="mb-[8px] text-[14px] text-[#767676]">Your maps</p>
            <p className="text-[20px] text-[#191919]" style={{ fontWeight: 'bold' }}>
              Create, edit, publish, and export
            </p>
            <p className="mt-[6px] text-[14px] leading-[1.5] text-[#767676]">
              Everything in this builder is centered around your map library rather than a workspace setup.
            </p>
          </div>
          <div className="rounded-[16px] border border-black/10 bg-white p-[20px]">
            <p className="mb-[8px] text-[14px] text-[#767676]">App role</p>
            <p className="text-[20px] text-[#191919]" style={{ fontWeight: 'bold' }}>
              {builderRole === 'admin' ? 'Admin' : 'Editor'}
            </p>
            <p className="mt-[6px] text-[14px] leading-[1.5] text-[#767676]">
              {builderRole === 'admin'
                ? 'Full builder access with app-level administration.'
                : 'Can create, edit, publish, and export journey maps.'}
            </p>
          </div>
        </div>

        <div className="relative mb-[24px] overflow-hidden rounded-[28px] border border-[#6F1534] bg-[#8C1D40] px-[24px] pb-0 pt-[24px] shadow-[0_24px_60px_rgba(82,14,36,0.26)] md:px-[36px] md:pb-0 md:pt-[32px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-100"
            style={{
              background:
                'radial-gradient(circle at 18% 18%, rgba(255,198,39,0.18), transparent 26%), radial-gradient(circle at 82% 20%, rgba(255,255,255,0.1), transparent 24%), linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.01))',
            }}
          />
          <div className="relative grid items-center gap-[28px] lg:grid-cols-[minmax(0,1.15fr)_360px]">
            <div className="max-w-[760px]">
              <p className="mb-[10px] text-[14px] tracking-[0.02em] text-[#FFD66E]" style={{ fontWeight: 'bold' }}>
                Start from a flexible template
              </p>
              <h2 className="mb-[12px] max-w-[620px] text-[36px] leading-[1.05] tracking-[-1.2px] text-white" style={{ fontWeight: 'bold' }}>
                Create a new journey map in minutes.
              </h2>
              <p className="max-w-[700px] text-[20px] leading-[1.5] text-[#F6EAF0]">
                Start from the current template and customize content, states, steps, publishing URL, and exports for a new audience or project.
              </p>

              <div className="mt-[24px] flex flex-wrap items-center gap-[12px]">
                <button
                  onClick={() => setCreating((value) => !value)}
                  className="inline-flex items-center gap-[8px] rounded-full bg-white px-[18px] py-[10px] text-[14px] text-[#8C1D40] transition-all duration-150 hover:bg-[#FFF2F6] active:scale-[0.98] cursor-pointer"
                  style={{ fontWeight: 'bold' }}
                >
                  <Plus className="size-[16px]" />
                  {creating ? 'Close new map form' : 'New map'}
                </button>
                <p className="text-[14px] leading-[1.5] text-[#F3D8E1]">
                  Use this to spin up a fresh draft and jump straight into the editor.
                </p>
              </div>

              {creating && (
                <div className="mt-[22px] grid gap-[12px] md:max-w-[760px] md:grid-cols-[1fr_auto]">
                  <input
                    value={newMapTitle}
                    onChange={(event) => setNewMapTitle(event.target.value)}
                    placeholder="Enter a new map title"
                    className="rounded-[14px] border border-white/15 bg-white px-[16px] py-[14px] text-[16px] text-[#191919] outline-none"
                  />
                  <button
                    onClick={handleCreateMap}
                    disabled={isCreatingMap}
                    className="rounded-[14px] bg-[#FFC627] px-[22px] py-[14px] text-[14px] text-[#5A1230] transition-all duration-150 hover:bg-[#f0bb25] active:scale-[0.98] cursor-pointer disabled:cursor-wait disabled:opacity-60"
                    style={{ fontWeight: 'bold' }}
                  >
                    {isCreatingMap ? 'Creating...' : 'Create map'}
                  </button>
                </div>
              )}
            </div>

            <div className="relative hidden min-h-[340px] items-end justify-center self-end lg:flex">
              <div className="absolute bottom-0 left-[42px] right-[28px] top-[16px] rounded-[32px] bg-[linear-gradient(160deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))]" />
              <img
                src={journeyMapBuilderPhone}
                alt="Journey Map Builder mobile preview"
                className="relative z-10 mt-auto max-h-[360px] w-auto translate-y-[10px] drop-shadow-[0_28px_48px_rgba(31,7,17,0.35)]"
              />
            </div>
          </div>
        </div>

        <div className="mb-[12px] flex items-center justify-between gap-[12px]">
          <div>
            <p className="text-[24px] text-[#191919]" style={{ fontWeight: 'bold' }}>
              Your maps
            </p>
            <p className="text-[16px] leading-[1.5] text-[#5f5f5f]">
              Open a draft, visit a public version, or start from the starter template to build something new.
            </p>
          </div>
        </div>

        {notice ? (
          <p className="mb-[12px] rounded-[12px] border border-black/10 bg-white px-[16px] py-[12px] text-[15px] text-[#191919]">
            {notice}
          </p>
        ) : null}
        {loadError ? (
          <p className="mb-[12px] rounded-[12px] border border-[#E4B4B4] bg-[#FFF4F4] px-[16px] py-[12px] text-[15px] text-[#8A1F1F]">
            {loadError}
          </p>
        ) : null}
        {items === null ? (
          <p className="rounded-[16px] border border-black/10 bg-white p-[24px] text-[16px] text-[#5f5f5f]">Loading your maps...</p>
        ) : null}

        <div className="grid gap-[16px]">
          {displayedItems.map((item) => {
              const { project } = item;
              const previewPath = `/preview/${project.map.slug}`;
              const publishedPath = item.siteSlug ? `/published/${item.siteSlug}` : null;
              const publishedSite = item.siteSlug ? { siteSlug: item.siteSlug } : null;
              const isStarterTemplate = isStarterOnly && project.map.slug === asuNondegreeProject.map.slug;

              return (
                <div
                  key={project.map.slug}
                  className="rounded-[20px] border border-black/10 bg-white p-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex flex-col gap-[14px] md:flex-row md:items-start md:justify-between">
                    <div className="flex flex-col gap-[8px]">
                      <div
                        className="inline-flex w-fit items-center gap-[8px] rounded-full px-[12px] py-[6px] text-[13px]"
                        style={{
                          background: publishedSite ? '#EEF8F0' : '#FAFAFA',
                          color: publishedSite ? '#2F6B3B' : '#5f5f5f',
                        }}
                      >
                        <Rocket className="size-[14px]" />
                        {publishedSite
                          ? `Published as /published/${publishedSite.siteSlug}${item.hasUnpublishedChanges ? ' (newer draft not published)' : ''}`
                          : isStarterTemplate
                            ? 'Starter template'
                            : 'Draft only'}
                      </div>
                      <p className="text-[28px] leading-[1.05] text-[#191919]" style={{ fontWeight: 'bold' }}>
                        {project.map.title}
                      </p>
                      <p className="text-[16px] leading-[1.5] text-[#5f5f5f]">
                        {project.map.stages.length} stages, {project.map.currentStateMarkers.length} {project.map.stateLabels.current.toLowerCase()} steps, {project.map.futureStateMarkers.length} {project.map.stateLabels.future.toLowerCase()} steps
                        {project.map.features.futurePersonasEnabled && (project.map.futurePersonas?.length ?? 0) > 0
                          ? `, ${project.map.futurePersonas?.length} persona${project.map.futurePersonas?.length === 1 ? '' : 's'}`
                          : ''}
                      </p>
                      {isStarterTemplate ? (
                        <p className="text-[14px] leading-[1.5] text-[#767676]">
                          This starter map is available immediately. Open the editor to customize it.
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-[10px]">
                      <Link
                        to={publishedPath ?? previewPath}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Open public link"
                        title={publishedPath ? 'Open public link' : 'Open preview map'}
                        className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full border border-black/10 bg-[#FAFAFA] text-[#191919] transition-all duration-150 hover:bg-[#f0f0f0] active:scale-[0.98] cursor-pointer"
                      >
                        <ArrowUpRight className="size-[18px]" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDownloadPng(project)}
                        aria-label="Download PNG"
                        title="Download PNG"
                        className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full border border-black/10 bg-[#FAFAFA] text-[#191919] transition-all duration-150 hover:bg-[#f0f0f0] active:scale-[0.98] cursor-pointer disabled:cursor-wait disabled:opacity-70"
                        disabled={exportingProjectKey === project.map.slug}
                      >
                        <Download className="size-[18px]" />
                      </button>
                      <Link
                        to={`/app/maps/${project.map.slug}`}
                        className="inline-flex items-center gap-[8px] rounded-full bg-[#8C1D40] px-[18px] py-[10px] text-[14px] text-white transition-all duration-150 hover:bg-[#7a1938] active:scale-[0.98] cursor-pointer"
                        style={{ fontWeight: 'bold' }}
                      >
                        <PenSquare className="size-[16px]" />
                        Open editor
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        {exportProject ? (
          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              left: -10000,
              top: 0,
              width: 1280,
              pointerEvents: 'none',
              opacity: 0,
            }}
          >
            <div ref={exportRef}>
              <JourneyMap projectOverride={exportProject} exportMode />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
