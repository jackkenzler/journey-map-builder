import { useOrganization } from '@clerk/clerk-react';
import { toPng } from 'html-to-image';
import { Download, House } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { asuNondegreeProject } from '../../../builder';
import {
  clearDraftProject,
  saveDraftProject,
  savePublishedJourneyMap,
} from '../../../builder/draftStorage';
import { getJourneyMapProject } from '../../../builder/repository';
import { hasSupabaseConfig } from '../../../builder/supabase';
import type {
  CurrentStateMarkerConfig,
  FutureStateMarkerConfig,
  JourneyMapConfig,
  JourneyMapProject,
  JourneyMarkerConfig,
  JourneyMarkerLabelConfig,
  JourneyStageConfig,
  JourneyStageSummaryConfig,
  LabelSide,
} from '../../../builder/types';
import { JourneyMap } from '../JourneyMap';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const labelSides: LabelSide[] = ['above', 'below', 'left', 'right'];
const defaultStagePalette = ['#78BE20', '#00A3E0', '#FF7F32', '#E74973', '#FFC627', '#5C6670'];
const safeZones = {
  current: {
    desktop: { min: 0.22, max: 0.8 },
    mobile: { min: 0.22, max: 0.78 },
  },
  future: {
    desktop: { min: 0.22, max: 0.79 },
    mobile: { min: 0.22, max: 0.79 },
  },
} as const;
const stepTypeOptions = [
  { value: 'interactive-card', label: 'Interactive card' },
  { value: 'plain', label: 'Plain' },
  { value: 'email', label: 'Email' },
  { value: 'warning', label: 'Warning' },
] as const;

type StepType = (typeof stepTypeOptions)[number]['value'];
type StateKey = 'current' | 'future';
type LabelConfigKey = 'desktopLabel' | 'mobileLabel';

const inputClassName =
  'rounded-[12px] border border-black/10 bg-white px-[14px] py-[12px] text-[16px] text-[#191919] outline-none';
const mutedInputClassName =
  'rounded-[12px] border border-black/10 bg-[#FAFAFA] px-[12px] py-[10px] text-[16px] text-[#191919] outline-none';
const interactiveLinkClassName =
  'transition-all duration-150 hover:bg-[#f2f2f2] active:scale-[0.98] cursor-pointer';
const interactiveButtonClassName =
  'transition-all duration-150 hover:brightness-[0.98] active:scale-[0.98] cursor-pointer';
const builderTabsListClassName =
  'h-auto w-full flex-wrap justify-start gap-[8px] border-b border-black/10 bg-transparent p-0';
const builderTabsTriggerClassName =
  'min-h-[48px] rounded-full px-[18px] py-[10px] text-[16px] font-bold text-[#747474] data-[state=active]:bg-[#8C1D40] data-[state=active]:text-white data-[state=active]:shadow-[0px_20px_12px_rgba(0,0,0,0.01),0px_9px_9px_rgba(0,0,0,0.03),0px_2px_5px_rgba(0,0,0,0.06)] hover:text-[#191919]';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

function buildStageSummary(stage: JourneyStageConfig, description = ''): JourneyStageSummaryConfig {
  return {
    number: stage.number,
    name: stage.title,
    color: stage.color,
    description,
  };
}

function getStepType(marker: JourneyMarkerConfig): StepType {
  if (marker.icon === 'warning') return 'warning';
  if (marker.icon === 'email') return 'email';
  if (marker.labelVariant === 'interactive-card') return 'interactive-card';
  return 'plain';
}

function applyStepType<T extends JourneyMarkerConfig>(marker: T, type: StepType): T {
  if (type === 'warning') {
    return {
      ...marker,
      icon: 'warning',
      labelVariant: 'plain',
    };
  }

  if (type === 'email') {
    return {
      ...marker,
      icon: 'email',
      labelVariant: 'card',
    };
  }

  if (type === 'plain') {
    return {
      ...marker,
      icon: undefined,
      labelVariant: 'plain',
    };
  }

  return {
    ...marker,
    icon: undefined,
    labelVariant: 'interactive-card',
  };
}

function buildLabelConfigPatch(
  config: JourneyMarkerLabelConfig | undefined,
  field: keyof JourneyMarkerLabelConfig,
  rawValue: string,
) {
  const nextConfig = { ...(config ?? {}) };

  if (field === 'side') {
    nextConfig.side = rawValue as LabelSide;
    return nextConfig;
  }

  if (rawValue === '') {
    delete nextConfig[field];
    return nextConfig;
  }

  nextConfig[field] = Number(rawValue);
  return nextConfig;
}

function buildLabelConfigWithOptionalSide(
  config: JourneyMarkerLabelConfig | undefined,
  enabled: boolean,
  fallbackSide: LabelSide,
) {
  const nextConfig = { ...(config ?? {}) };
  if (!enabled) {
    delete nextConfig.side;
    return nextConfig;
  }
  nextConfig.side = nextConfig.side ?? fallbackSide;
  return nextConfig;
}

function nextPct(lastPct: number | undefined, fallback: number) {
  return Number(Math.min(0.95, (lastPct ?? fallback) + 0.04).toFixed(4));
}

function distributeMarkerPlacements<T extends JourneyMarkerConfig>(
  markers: T[],
  stateKey: keyof typeof safeZones,
) {
  if (markers.length === 0) return markers;

  const desktopRange = safeZones[stateKey].desktop;
  const mobileRange = safeZones[stateKey].mobile;
  const desktopStep = markers.length === 1 ? 0 : (desktopRange.max - desktopRange.min) / (markers.length - 1);
  const mobileStep = markers.length === 1 ? 0 : (mobileRange.max - mobileRange.min) / (markers.length - 1);
  const desktopMid = (desktopRange.min + desktopRange.max) / 2;
  const mobileMid = (mobileRange.min + mobileRange.max) / 2;

  return markers.map((marker, index) => ({
    ...marker,
    desktop: {
      ...marker.desktop,
      pct: Number((markers.length === 1 ? desktopMid : desktopRange.min + desktopStep * index).toFixed(4)),
    },
    mobile: {
      ...marker.mobile,
      pct: Number((markers.length === 1 ? mobileMid : mobileRange.min + mobileStep * index).toFixed(4)),
    },
  }));
}

function createStage(index: number): JourneyStageConfig {
  const number = String(index + 1).padStart(2, '0');
  const color = defaultStagePalette[index % defaultStagePalette.length];
  return {
    id: `stage-${number}-${Date.now().toString(36)}`,
    number,
    title: `Stage ${index + 1}`,
    color,
    description: '',
    currentSummary: '',
    futureSummary: '',
  };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-[14px] text-[#767676]">{children}</span>;
}

function SectionCard({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[16px] border border-black/10 bg-[#FCFCFC] p-[16px]">
      <div className="mb-[14px] flex flex-wrap items-start justify-between gap-[12px]">
        <div className="max-w-[720px]">
          <p className="text-[20px] text-[#191919]" style={{ fontWeight: 'bold' }}>
            {title}
          </p>
          {description ? (
            <p className="mt-[4px] text-[16px] leading-[1.5] text-[#5f5f5f]">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

function PlacementEditor({
  label,
  pct,
  side,
  onPctChange,
  onSideChange,
}: {
  label: string;
  pct: number;
  side: LabelSide;
  onPctChange: (value: string) => void;
  onSideChange: (value: LabelSide) => void;
}) {
  return (
    <div className="grid gap-[12px] rounded-[14px] border border-black/10 bg-white p-[14px]">
      <p className="text-[16px] text-[#191919]" style={{ fontWeight: 'bold' }}>
        {label}
      </p>
      <label className="grid gap-[8px]">
        <FieldLabel>Path position</FieldLabel>
        <input value={pct} onChange={(event) => onPctChange(event.target.value)} className={mutedInputClassName} />
      </label>
      <label className="grid gap-[8px]">
        <FieldLabel>Label side</FieldLabel>
        <select
          value={side}
          onChange={(event) => onSideChange(event.target.value as LabelSide)}
          className={mutedInputClassName}
        >
          {labelSides.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function LabelTuningEditor({
  label,
  fallbackSide,
  config,
  onToggleSideOverride,
  onSideOverrideChange,
  onFieldChange,
  onReset,
}: {
  label: string;
  fallbackSide: LabelSide;
  config: JourneyMarkerLabelConfig | undefined;
  onToggleSideOverride: (enabled: boolean) => void;
  onSideOverrideChange: (side: LabelSide) => void;
  onFieldChange: (field: keyof JourneyMarkerLabelConfig, value: string) => void;
  onReset: () => void;
}) {
  const overrideEnabled = Boolean(config?.side);

  return (
    <div className="grid gap-[12px] rounded-[14px] border border-black/10 bg-white p-[14px]">
      <div className="flex flex-wrap items-center justify-between gap-[10px]">
        <p className="text-[16px] text-[#191919]" style={{ fontWeight: 'bold' }}>
          {label}
        </p>
        <button
          type="button"
          onClick={onReset}
          className={`rounded-full border border-black/10 bg-[#FAFAFA] px-[12px] py-[6px] text-[13px] text-[#191919] ${interactiveButtonClassName}`}
          style={{ fontWeight: 'bold' }}
        >
          Reset
        </button>
      </div>

      <label className="flex items-center justify-between rounded-[12px] border border-black/10 bg-[#FAFAFA] px-[12px] py-[10px]">
        <span className="text-[15px] text-[#191919]">Override label side</span>
        <Switch checked={overrideEnabled} onCheckedChange={onToggleSideOverride} />
      </label>

      {overrideEnabled ? (
        <label className="grid gap-[8px]">
          <FieldLabel>Override side</FieldLabel>
          <select
            value={config?.side ?? fallbackSide}
            onChange={(event) => onSideOverrideChange(event.target.value as LabelSide)}
            className={mutedInputClassName}
          >
            {labelSides.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="grid gap-[12px] md:grid-cols-2">
        <label className="grid gap-[8px]">
          <FieldLabel>Distance</FieldLabel>
          <input
            value={config?.distance ?? ''}
            onChange={(event) => onFieldChange('distance', event.target.value)}
            className={mutedInputClassName}
            placeholder="30"
          />
        </label>
        <label className="grid gap-[8px]">
          <FieldLabel>Max width</FieldLabel>
          <input
            value={config?.maxWidth ?? ''}
            onChange={(event) => onFieldChange('maxWidth', event.target.value)}
            className={mutedInputClassName}
            placeholder="240"
          />
        </label>
      </div>

      <div className="grid gap-[12px] md:grid-cols-2">
        <label className="grid gap-[8px]">
          <FieldLabel>Shift X</FieldLabel>
          <input
            value={config?.shiftX ?? ''}
            onChange={(event) => onFieldChange('shiftX', event.target.value)}
            className={mutedInputClassName}
            placeholder="0"
          />
        </label>
        <label className="grid gap-[8px]">
          <FieldLabel>Shift Y</FieldLabel>
          <input
            value={config?.shiftY ?? ''}
            onChange={(event) => onFieldChange('shiftY', event.target.value)}
            className={mutedInputClassName}
            placeholder="0"
          />
        </label>
      </div>
    </div>
  );
}

export function BuilderMapView() {
  const { orgSlug = '', mapSlug = '' } = useParams();
  const { organization } = useOrganization();
  const [project, setProject] = useState<JourneyMapProject | null | undefined>(undefined);
  const [draftMap, setDraftMap] = useState<JourneyMapConfig | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getJourneyMapProject(orgSlug, mapSlug).then(setProject);
  }, [orgSlug, mapSlug]);

  useEffect(() => {
    if (!project) return;
    setDraftMap(project.map);
  }, [project]);

  const updateDraftMap = (updater: (current: JourneyMapConfig) => JourneyMapConfig) => {
    setDraftMap((current) => (current ? updater(current) : current));
    setSaveMessage(null);
  };

  const updateCurrentMarker = (
    index: number,
    updater: (marker: CurrentStateMarkerConfig) => CurrentStateMarkerConfig,
  ) => {
    updateDraftMap((current) => ({
      ...current,
      currentStateMarkers: current.currentStateMarkers.map((marker, markerIndex) =>
        markerIndex === index ? updater(marker) : marker,
      ),
    }));
  };

  const updateFutureMarker = (
    index: number,
    updater: (marker: FutureStateMarkerConfig) => FutureStateMarkerConfig,
  ) => {
    updateDraftMap((current) => ({
      ...current,
      futureStateMarkers: current.futureStateMarkers.map((marker, markerIndex) =>
        markerIndex === index ? updater(marker) : marker,
      ),
    }));
  };

  const updateLabelConfig = (
    state: StateKey,
    index: number,
    key: LabelConfigKey,
    updater: (config: JourneyMarkerLabelConfig | undefined) => JourneyMarkerLabelConfig,
  ) => {
    if (state === 'current') {
      updateCurrentMarker(index, (marker) => ({ ...marker, [key]: updater(marker[key]) }));
      return;
    }
    updateFutureMarker(index, (marker) => ({ ...marker, [key]: updater(marker[key]) }));
  };

  const updateStage = (index: number, updater: (stage: JourneyStageConfig) => JourneyStageConfig) => {
    updateDraftMap((current) => {
      const stage = current.stages[index];
      const nextStage = updater(stage);
      const nextCurrentSummary = {
        ...(current.currentSummaries[index] ?? buildStageSummary(stage, stage.currentSummary)),
        number: nextStage.number,
        name: nextStage.title,
        color: nextStage.color,
      };
      const nextFutureSummary = {
        ...(current.futureSummaries[index] ?? buildStageSummary(stage, stage.futureSummary)),
        number: nextStage.number,
        name: nextStage.title,
        color: nextStage.color,
      };

      return {
        ...current,
        stages: current.stages.map((item, itemIndex) => (itemIndex === index ? nextStage : item)),
        currentSummaries: current.currentSummaries.map((item, itemIndex) =>
          itemIndex === index ? nextCurrentSummary : item,
        ),
        futureSummaries: current.futureSummaries.map((item, itemIndex) =>
          itemIndex === index ? nextFutureSummary : item,
        ),
        theme: {
          ...current.theme,
          stageColors: current.theme.stageColors.map((item, itemIndex) =>
            itemIndex === index ? nextStage.color : item,
          ),
        },
      };
    });
  };

  const addStage = () => {
    updateDraftMap((current) => {
      const newStage = createStage(current.stages.length);
      return {
        ...current,
        stages: [...current.stages, newStage],
        currentSummaries: [
          ...current.currentSummaries,
          buildStageSummary(newStage, newStage.currentSummary),
        ],
        futureSummaries: [
          ...current.futureSummaries,
          buildStageSummary(newStage, newStage.futureSummary),
        ],
        theme: {
          ...current.theme,
          stageColors: [...current.theme.stageColors, newStage.color],
        },
      };
    });
  };

  const removeStage = (index: number) => {
    updateDraftMap((current) => {
      if (current.stages.length <= 1) return current;
      const removedStage = current.stages[index];
      const remainingStages = current.stages.filter((_, stageIndex) => stageIndex !== index);
      const fallbackStageId = remainingStages[0]?.id ?? current.stages[0].id;

      return {
        ...current,
        stages: remainingStages,
        currentSummaries: current.currentSummaries.filter((_, stageIndex) => stageIndex !== index),
        futureSummaries: current.futureSummaries.filter((_, stageIndex) => stageIndex !== index),
        theme: {
          ...current.theme,
          stageColors: current.theme.stageColors.filter((_, stageIndex) => stageIndex !== index),
        },
        futureStateMarkers: current.futureStateMarkers.map((marker) =>
          marker.stageId === removedStage.id ? { ...marker, stageId: fallbackStageId } : marker,
        ),
      };
    });
  };

  const addCurrentStep = () => {
    updateDraftMap((current) => ({
      ...current,
      currentStateMarkers: distributeMarkerPlacements(
        [
          ...current.currentStateMarkers,
          {
            id: `current-step-${Date.now().toString(36)}`,
            label: 'New step',
            labelVariant: 'plain',
            icon: 'warning',
            modalTitle: 'New step',
            desktop: {
              pct: nextPct(
                current.currentStateMarkers[current.currentStateMarkers.length - 1]?.desktop.pct,
                0.2,
              ),
              side: 'below',
            },
            mobile: {
              pct: nextPct(
                current.currentStateMarkers[current.currentStateMarkers.length - 1]?.mobile.pct,
                0.2,
              ),
              side: 'right',
            },
          },
        ],
        'current',
      ),
    }));
  };

  const addFutureStep = () => {
    updateDraftMap((current) => {
      const lastMarker = current.futureStateMarkers[current.futureStateMarkers.length - 1];
      return {
        ...current,
        futureStateMarkers: distributeMarkerPlacements(
          [
            ...current.futureStateMarkers,
            {
              id: `future-step-${Date.now().toString(36)}`,
              label: 'New step',
              modalTitle: 'New step',
              labelVariant: 'interactive-card',
              stageId: current.stages[0]?.id ?? '',
              desktop: { pct: nextPct(lastMarker?.desktop.pct, 0.2), side: 'below' },
              mobile: { pct: nextPct(lastMarker?.mobile.pct, 0.2), side: 'right' },
              beforeImage: '',
              afterImage: '',
            },
          ],
          'future',
        ),
      };
    });
  };

  const removeCurrentStep = (index: number) => {
    updateDraftMap((current) => ({
      ...current,
      currentStateMarkers: distributeMarkerPlacements(
        current.currentStateMarkers.filter((_, markerIndex) => markerIndex !== index),
        'current',
      ),
    }));
  };

  const removeFutureStep = (index: number) => {
    updateDraftMap((current) => ({
      ...current,
      futureStateMarkers: distributeMarkerPlacements(
        current.futureStateMarkers.filter((_, markerIndex) => markerIndex !== index),
        'future',
      ),
    }));
  };

  const autoArrangeState = (state: StateKey) => {
    updateDraftMap((current) => ({
      ...current,
      currentStateMarkers:
        state === 'current'
          ? distributeMarkerPlacements(current.currentStateMarkers, 'current')
          : current.currentStateMarkers,
      futureStateMarkers:
        state === 'future'
          ? distributeMarkerPlacements(current.futureStateMarkers, 'future')
          : current.futureStateMarkers,
    }));
  };

  if (project === undefined) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-[24px] py-[48px]" style={{ fontFamily: 'Arial, sans-serif' }}>
        <div className="mx-auto max-w-[900px] rounded-[16px] border border-black/10 bg-white p-[24px]">
          <p className="text-[18px] text-[#5f5f5f]">Loading builder project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-[24px] py-[48px]" style={{ fontFamily: 'Arial, sans-serif' }}>
        <div className="mx-auto max-w-[900px] rounded-[16px] border border-black/10 bg-white p-[24px]">
          <p className="mb-[8px] text-[24px] text-[#191919]" style={{ fontWeight: 'bold' }}>
            Map not found
          </p>
          <p className="mb-[16px] text-[16px] leading-[1.5] text-[#5f5f5f]">
            This builder route does not have a matching project configuration yet.
          </p>
          <Link
            to="/app"
            className={`text-[14px] text-[#8C1D40] ${interactiveLinkClassName}`}
            style={{ fontWeight: 'bold' }}
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!draftMap) return null;

  const stateLabels = draftMap.stateLabels ?? { current: 'State 1', future: 'State 2' };
  const publishing = draftMap.publishing ?? { siteSlug: draftMap.slug };
  const previewHref = `/preview/${project.organization.slug}/${draftMap.slug}`;
  const publishedHref = `/published/${project.organization.slug}/${publishing.siteSlug}`;
  const previewProject: JourneyMapProject = {
    organization: project.organization,
    map: {
      ...draftMap,
      publishing,
    },
  };

  const handleSaveDraft = () => {
    saveDraftProject(previewProject);
    setSaveMessage('Draft saved locally. Open preview map to review the latest version.');
  };

  const handleResetDraft = () => {
    clearDraftProject(project.organization.slug, project.map.slug);
    setDraftMap(project.map);
    setSaveMessage('Local draft cleared. Reverted to the last loaded version.');
  };

  const handlePublish = () => {
    const snapshot = savePublishedJourneyMap(previewProject, publishing.siteSlug);
    saveDraftProject(previewProject);
    setDraftMap((current) =>
      current
        ? {
            ...current,
            publishing: {
              ...current.publishing,
              siteSlug: snapshot.siteSlug,
              lastPublishedAt: snapshot.publishedAt,
            },
          }
        : current,
    );
    setSaveMessage(`Published to /published/${snapshot.orgSlug}/${snapshot.siteSlug}`);
  };

  const handleDownloadPng = async () => {
    if (!exportRef.current) return;
    setIsExportingPng(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: draftMap.theme.pageBackground,
      });
      const link = document.createElement('a');
      link.download = `${draftMap.slug}.png`;
      link.href = dataUrl;
      link.click();
      setSaveMessage('PNG download started.');
    } catch {
      setSaveMessage('PNG export failed. Try again in a moment.');
    } finally {
      setIsExportingPng(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="mx-auto max-w-[1200px] px-[24px] py-[32px] md:px-[40px] md:py-[48px]">
        <div className="mb-[24px] flex flex-col gap-[8px]">
          <p className="text-[14px] text-[#767676]">
            {project.organization.name} / {draftMap.slug}
          </p>
          <div className="flex flex-wrap items-center gap-[16px]">
            <h1 className="text-[34px] leading-[1.05] tracking-[-1.2px] text-[#191919]" style={{ fontWeight: 'bold' }}>
              {draftMap.title}
            </h1>
            <Link
              to="/app"
              className={`inline-flex items-center gap-[8px] rounded-full border border-black/10 bg-[#FAFAFA] px-[16px] py-[10px] text-[14px] text-[#191919] ${interactiveLinkClassName}`}
              style={{ fontWeight: 'bold' }}
            >
              <House className="size-[16px]" />
              Back to home
            </Link>
            <div className="ml-auto">
              <Link
                to={previewHref}
                className={`rounded-full border border-black/10 bg-white px-[16px] py-[10px] text-[14px] text-[#191919] ${interactiveLinkClassName}`}
                style={{ fontWeight: 'bold' }}
              >
                Open preview map
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-[24px] grid gap-[16px] md:grid-cols-3">
          <div className="rounded-[16px] border border-black/10 bg-white p-[20px]">
            <p className="mb-[8px] text-[14px] text-[#767676]">Active organization</p>
            <p className="text-[20px] text-[#191919]" style={{ fontWeight: 'bold' }}>
              {organization?.name ?? project.organization.name}
            </p>
          </div>
          <div className="rounded-[16px] border border-black/10 bg-white p-[20px]">
            <p className="mb-[8px] text-[14px] text-[#767676]">Data source</p>
            <p className="text-[20px] text-[#191919]" style={{ fontWeight: 'bold' }}>
              {hasSupabaseConfig ? 'Supabase + local drafts' : 'Local draft registry'}
            </p>
          </div>
          <div className="rounded-[16px] border border-black/10 bg-white p-[20px]">
            <p className="mb-[8px] text-[14px] text-[#767676]">Published URL</p>
            <p className="text-[16px] break-all text-[#191919]" style={{ fontWeight: 'bold' }}>
              {publishedHref}
            </p>
          </div>
        </div>

        <div className="mb-[20px] flex flex-wrap items-start justify-between gap-[12px]">
          <div className="max-w-[760px]">
            <p className="text-[24px] text-[#191919]" style={{ fontWeight: 'bold' }}>
              Draft editor
            </p>
            <p className="text-[16px] leading-[1.5] text-[#5f5f5f]">
              Manage map content, states, stages, publishing, and responsive step placement. New steps auto-arrange into safe zones by default, and you can still override any placement manually.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-[10px]">
            {saveMessage ? (
              <div className="rounded-full bg-[#FAFAFA] px-[12px] py-[8px] text-[14px] text-[#5f5f5f]">
                {saveMessage}
              </div>
            ) : null}
            <button
              onClick={handleResetDraft}
              className={`rounded-full border border-black/10 bg-[#FAFAFA] px-[16px] py-[10px] text-[14px] text-[#191919] ${interactiveButtonClassName}`}
              style={{ fontWeight: 'bold' }}
            >
              Reset draft
            </button>
            <button
              onClick={handlePublish}
              className={`rounded-full border border-black/10 bg-white px-[16px] py-[10px] text-[14px] text-[#191919] ${interactiveButtonClassName}`}
              style={{ fontWeight: 'bold' }}
            >
              Publish map
            </button>
            <button
              onClick={handleDownloadPng}
              className={`inline-flex items-center gap-[8px] rounded-full border border-black/10 bg-white px-[16px] py-[10px] text-[14px] text-[#191919] ${interactiveButtonClassName}`}
              style={{ fontWeight: 'bold' }}
            >
              <Download className="size-[16px]" />
              {isExportingPng ? 'Preparing PNG...' : 'Download PNG'}
            </button>
            <button
              onClick={handleSaveDraft}
              className={`rounded-full bg-[#8C1D40] px-[16px] py-[10px] text-[14px] text-white ${interactiveButtonClassName}`}
              style={{ fontWeight: 'bold' }}
            >
              Save draft
            </button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="gap-[20px]">
          <TabsList className={builderTabsListClassName}>
            <TabsTrigger value="overview" className={builderTabsTriggerClassName}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="stages" className={builderTabsTriggerClassName}>
              Stages
            </TabsTrigger>
            <TabsTrigger value="steps" className={builderTabsTriggerClassName}>
              Steps
            </TabsTrigger>
            <TabsTrigger value="preview" className={builderTabsTriggerClassName}>
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-[16px] lg:grid-cols-[0.95fr_1.05fr]">
              <div className="grid gap-[16px]">
                <SectionCard title="Map settings" description="Edit the core labels, names, and publishing fields for this map.">
                  <div className="grid gap-[12px]">
                    <label className="grid gap-[8px]">
                      <FieldLabel>Map title</FieldLabel>
                      <input
                        value={draftMap.title}
                        onChange={(event) =>
                          updateDraftMap((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        className={inputClassName}
                      />
                    </label>

                    <label className="grid gap-[8px]">
                      <FieldLabel>Brand title</FieldLabel>
                      <input
                        value={draftMap.brand.title}
                        onChange={(event) =>
                          updateDraftMap((current) => ({
                            ...current,
                            brand: { ...current.brand, title: event.target.value },
                          }))
                        }
                        className={inputClassName}
                      />
                    </label>

                    <div className="grid gap-[12px] md:grid-cols-2">
                      <label className="grid gap-[8px]">
                        <FieldLabel>First state name</FieldLabel>
                        <input
                          value={stateLabels.current}
                          onChange={(event) =>
                            updateDraftMap((current) => ({
                              ...current,
                              stateLabels: {
                                ...(current.stateLabels ?? {
                                  current: 'State 1',
                                  future: 'State 2',
                                }),
                                current: event.target.value,
                              },
                            }))
                          }
                          className={inputClassName}
                        />
                      </label>
                      <label className="grid gap-[8px]">
                        <FieldLabel>Second state name</FieldLabel>
                        <input
                          value={stateLabels.future}
                          onChange={(event) =>
                            updateDraftMap((current) => ({
                              ...current,
                              stateLabels: {
                                ...(current.stateLabels ?? {
                                  current: 'State 1',
                                  future: 'State 2',
                                }),
                                future: event.target.value,
                              },
                            }))
                          }
                          className={inputClassName}
                        />
                      </label>
                    </div>

                    <div className="grid gap-[12px] md:grid-cols-2">
                      <label className="grid gap-[8px]">
                        <FieldLabel>Published URL slug</FieldLabel>
                        <input
                          value={publishing.siteSlug}
                          onChange={(event) =>
                            updateDraftMap((current) => ({
                              ...current,
                              publishing: {
                                ...(current.publishing ?? { siteSlug: current.slug }),
                                siteSlug: slugify(event.target.value) || current.slug,
                              },
                            }))
                          }
                          className={inputClassName}
                        />
                      </label>
                      <label className="grid gap-[8px]">
                        <FieldLabel>Custom domain</FieldLabel>
                        <input
                          value={publishing.customDomain ?? ''}
                          onChange={(event) =>
                            updateDraftMap((current) => ({
                              ...current,
                              publishing: {
                                ...(current.publishing ?? { siteSlug: current.slug }),
                                customDomain: event.target.value || undefined,
                              },
                            }))
                          }
                          className={inputClassName}
                          placeholder="Optional"
                        />
                      </label>
                    </div>

                    <div className="rounded-[12px] border border-black/10 bg-white p-[14px]">
                      <p className="mb-[4px] text-[14px] text-[#767676]">Published preview URL</p>
                      <p className="break-all text-[15px] text-[#191919]">{publishedHref}</p>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Feature visibility" description="Turn key map behaviors on or off without changing the content itself.">
                  <div className="grid gap-[12px]">
                    {[
                      ['currentStateEnabled', `Show ${stateLabels.current}`],
                      ['futureStateEnabled', `Show ${stateLabels.future}`],
                      ['guidedTourEnabled', 'Show guided tour'],
                      ['comparisonModalEnabled', 'Show comparison modal'],
                    ].map(([key, label]) => (
                      <label
                        key={key}
                        className="flex items-center justify-between rounded-[12px] border border-black/10 bg-white px-[14px] py-[12px]"
                      >
                        <span className="text-[16px] text-[#191919]">{label}</span>
                        <Switch
                          checked={draftMap.features[key as keyof typeof draftMap.features]}
                          onCheckedChange={(checked) =>
                            updateDraftMap((current) => ({
                              ...current,
                              features: {
                                ...current.features,
                                [key]: checked,
                              },
                            }))
                          }
                        />
                      </label>
                    ))}
                  </div>
                </SectionCard>
              </div>

              <div className="grid gap-[16px]">
                <SectionCard title="Theme and renderer" description="These values control the preview and export appearance.">
                  <div className="grid gap-[12px]">
                    <div className="grid gap-[12px] md:grid-cols-2">
                      <label className="grid gap-[8px]">
                        <FieldLabel>Page background</FieldLabel>
                        <input
                          value={draftMap.theme.pageBackground}
                          onChange={(event) =>
                            updateDraftMap((current) => ({
                              ...current,
                              theme: { ...current.theme, pageBackground: event.target.value },
                              brand: { ...current.brand, pageBackground: event.target.value },
                            }))
                          }
                          className={inputClassName}
                        />
                      </label>
                      <label className="grid gap-[8px]">
                        <FieldLabel>Panel background</FieldLabel>
                        <input
                          value={draftMap.theme.panelBackground}
                          onChange={(event) =>
                            updateDraftMap((current) => ({
                              ...current,
                              theme: { ...current.theme, panelBackground: event.target.value },
                            }))
                          }
                          className={inputClassName}
                        />
                      </label>
                    </div>

                    <div className="grid gap-[12px] md:grid-cols-2">
                      <label className="grid gap-[8px]">
                        <FieldLabel>Road stroke width</FieldLabel>
                        <input
                          value={draftMap.theme.pathStrokeWidth}
                          onChange={(event) =>
                            updateDraftMap((current) => ({
                              ...current,
                              theme: {
                                ...current.theme,
                                pathStrokeWidth: Number(event.target.value) || current.theme.pathStrokeWidth,
                              },
                            }))
                          }
                          className={inputClassName}
                        />
                      </label>
                      <label className="grid gap-[8px]">
                        <FieldLabel>Centerline stroke width</FieldLabel>
                        <input
                          value={draftMap.theme.centerlineStrokeWidth}
                          onChange={(event) =>
                            updateDraftMap((current) => ({
                              ...current,
                              theme: {
                                ...current.theme,
                                centerlineStrokeWidth:
                                  Number(event.target.value) || current.theme.centerlineStrokeWidth,
                              },
                            }))
                          }
                          className={inputClassName}
                        />
                      </label>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Guided tour" description="Control the floating onboarding copy and which step it anchors to.">
                  <div className="grid gap-[12px]">
                    <label className="grid gap-[8px]">
                      <FieldLabel>Popover title</FieldLabel>
                      <input
                        value={draftMap.guidedTour.title}
                        onChange={(event) =>
                          updateDraftMap((current) => ({
                            ...current,
                            guidedTour: { ...current.guidedTour, title: event.target.value },
                          }))
                        }
                        className={inputClassName}
                      />
                    </label>
                    <label className="grid gap-[8px]">
                      <FieldLabel>Popover body</FieldLabel>
                      <textarea
                        value={draftMap.guidedTour.body}
                        onChange={(event) =>
                          updateDraftMap((current) => ({
                            ...current,
                            guidedTour: { ...current.guidedTour, body: event.target.value },
                          }))
                        }
                        rows={4}
                        className={inputClassName}
                      />
                    </label>

                    <div className="grid gap-[12px] md:grid-cols-2">
                      <label className="grid gap-[8px]">
                        <FieldLabel>Desktop anchor step ID</FieldLabel>
                        <input
                          value={draftMap.guidedTour.desktopAnchorMarkerId}
                          onChange={(event) =>
                            updateDraftMap((current) => ({
                              ...current,
                              guidedTour: {
                                ...current.guidedTour,
                                desktopAnchorMarkerId: event.target.value,
                              },
                            }))
                          }
                          className={inputClassName}
                        />
                      </label>
                      <label className="grid gap-[8px]">
                        <FieldLabel>Mobile anchor step ID</FieldLabel>
                        <input
                          value={draftMap.guidedTour.mobileAnchorMarkerId}
                          onChange={(event) =>
                            updateDraftMap((current) => ({
                              ...current,
                              guidedTour: {
                                ...current.guidedTour,
                                mobileAnchorMarkerId: event.target.value,
                              },
                            }))
                          }
                          className={inputClassName}
                        />
                      </label>
                    </div>
                  </div>
                </SectionCard>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stages">
            <SectionCard
              title="Stages"
              description="Add, remove, and rename stages. Each stage also carries a color and summary copy for both states."
              actions={
                <button
                  onClick={addStage}
                  className={`rounded-full border border-black/10 bg-white px-[16px] py-[10px] text-[14px] text-[#191919] ${interactiveButtonClassName}`}
                  style={{ fontWeight: 'bold' }}
                >
                  Add stage
                </button>
              }
            >
              <div className="grid gap-[12px]">
                {draftMap.stages.map((stage, index) => (
                  <section key={stage.id} className="rounded-[14px] border border-black/10 bg-white p-[16px]">
                    <div className="mb-[14px] flex flex-wrap items-center justify-between gap-[10px]">
                      <div>
                        <p className="text-[18px] text-[#191919]" style={{ fontWeight: 'bold' }}>
                          Stage {index + 1}
                        </p>
                        <p className="text-[14px] text-[#767676]">{stage.id}</p>
                      </div>
                      <button
                        onClick={() => removeStage(index)}
                        disabled={draftMap.stages.length <= 1}
                        className={`rounded-full border border-black/10 bg-[#FAFAFA] px-[14px] py-[8px] text-[14px] text-[#191919] ${interactiveButtonClassName} disabled:cursor-not-allowed disabled:opacity-50`}
                        style={{ fontWeight: 'bold' }}
                      >
                        Remove stage
                      </button>
                    </div>

                    <div className="grid gap-[12px] lg:grid-cols-[0.22fr_0.5fr_0.28fr]">
                      <label className="grid gap-[8px]">
                        <FieldLabel>Stage number</FieldLabel>
                        <input
                          value={stage.number}
                          onChange={(event) =>
                            updateStage(index, (currentStage) => ({
                              ...currentStage,
                              number: event.target.value,
                            }))
                          }
                          className={mutedInputClassName}
                        />
                      </label>
                      <label className="grid gap-[8px]">
                        <FieldLabel>Stage title</FieldLabel>
                        <input
                          value={stage.title}
                          onChange={(event) =>
                            updateStage(index, (currentStage) => ({
                              ...currentStage,
                              title: event.target.value,
                            }))
                          }
                          className={mutedInputClassName}
                        />
                      </label>
                      <div className="grid gap-[8px]">
                        <FieldLabel>Stage color</FieldLabel>
                        <div className="grid grid-cols-[52px_1fr] gap-[8px]">
                          <input
                            type="color"
                            value={stage.color}
                            onChange={(event) =>
                              updateStage(index, (currentStage) => ({
                                ...currentStage,
                                color: event.target.value,
                              }))
                            }
                            className="h-[48px] w-full rounded-[12px] border border-black/10 bg-white p-[4px]"
                          />
                          <input
                            value={stage.color}
                            onChange={(event) =>
                              updateStage(index, (currentStage) => ({
                                ...currentStage,
                                color: event.target.value,
                              }))
                            }
                            className={mutedInputClassName}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-[12px] grid gap-[12px] lg:grid-cols-2">
                      <label className="grid gap-[8px]">
                        <FieldLabel>{stateLabels.current} summary</FieldLabel>
                        <textarea
                          value={draftMap.currentSummaries[index]?.description ?? ''}
                          onChange={(event) =>
                            updateDraftMap((current) => ({
                              ...current,
                              currentSummaries: current.currentSummaries.map((summary, summaryIndex) =>
                                summaryIndex === index
                                  ? { ...summary, description: event.target.value }
                                  : summary,
                              ),
                              stages: current.stages.map((item, stageIndex) =>
                                stageIndex === index
                                  ? { ...item, currentSummary: event.target.value }
                                  : item,
                              ),
                            }))
                          }
                          rows={4}
                          className={mutedInputClassName}
                        />
                      </label>
                      <label className="grid gap-[8px]">
                        <FieldLabel>{stateLabels.future} summary</FieldLabel>
                        <textarea
                          value={draftMap.futureSummaries[index]?.description ?? ''}
                          onChange={(event) =>
                            updateDraftMap((current) => ({
                              ...current,
                              futureSummaries: current.futureSummaries.map((summary, summaryIndex) =>
                                summaryIndex === index
                                  ? { ...summary, description: event.target.value }
                                  : summary,
                              ),
                              stages: current.stages.map((item, stageIndex) =>
                                stageIndex === index
                                  ? { ...item, futureSummary: event.target.value }
                                  : item,
                              ),
                            }))
                          }
                          rows={4}
                          className={mutedInputClassName}
                        />
                      </label>
                    </div>
                  </section>
                ))}
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="steps">
            <Tabs defaultValue="current" className="gap-[16px]">
              <TabsList className={builderTabsListClassName}>
                <TabsTrigger value="current" className={builderTabsTriggerClassName}>
                  {stateLabels.current}
                </TabsTrigger>
                <TabsTrigger value="future" className={builderTabsTriggerClassName}>
                  {stateLabels.future}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="current">
                <SectionCard
                  title={`${stateLabels.current} steps`}
                  description="Every step can use any step type. New steps auto-arrange into safe desktop and mobile zones."
                  actions={
                    <div className="flex flex-wrap gap-[10px]">
                      <button
                        onClick={() => autoArrangeState('current')}
                        className={`rounded-full border border-black/10 bg-white px-[16px] py-[10px] text-[14px] text-[#191919] ${interactiveButtonClassName}`}
                        style={{ fontWeight: 'bold' }}
                      >
                        Auto arrange
                      </button>
                      <button
                        onClick={addCurrentStep}
                        className={`rounded-full border border-black/10 bg-white px-[16px] py-[10px] text-[14px] text-[#191919] ${interactiveButtonClassName}`}
                        style={{ fontWeight: 'bold' }}
                      >
                        Add step
                      </button>
                    </div>
                  }
                >
                  <div className="grid gap-[12px]">
                    {draftMap.currentStateMarkers.map((marker, index) => {
                      const desktopSideOverride = Boolean(marker.desktopLabel?.side);
                      const mobileSideOverride = Boolean(marker.mobileLabel?.side);

                      return (
                        <details key={marker.id} open className="rounded-[14px] border border-black/10 bg-white p-[16px]">
                          <summary
                            className="cursor-pointer rounded-[8px] text-[18px] text-[#191919] transition-colors hover:bg-black/5 active:bg-black/10"
                            style={{ fontWeight: 'bold' }}
                          >
                            Step {index + 1}
                          </summary>

                          <div className="mt-[14px] grid gap-[12px]">
                            <div className="flex justify-end">
                              <button
                                onClick={() => removeCurrentStep(index)}
                                className={`rounded-full border border-black/10 bg-[#FAFAFA] px-[14px] py-[8px] text-[14px] text-[#191919] ${interactiveButtonClassName}`}
                                style={{ fontWeight: 'bold' }}
                              >
                                Remove step
                              </button>
                            </div>

                            <label className="grid gap-[8px]">
                              <FieldLabel>Step label</FieldLabel>
                              <textarea
                                value={marker.label}
                                onChange={(event) =>
                                  updateCurrentMarker(index, (currentMarker) => ({
                                    ...currentMarker,
                                    label: event.target.value,
                                  }))
                                }
                                rows={3}
                                className={mutedInputClassName}
                              />
                            </label>

                            <div className="grid gap-[12px] md:grid-cols-2">
                              <label className="grid gap-[8px]">
                                <FieldLabel>Step type</FieldLabel>
                                <select
                                  value={getStepType(marker)}
                                  onChange={(event) =>
                                    updateCurrentMarker(index, (currentMarker) =>
                                      applyStepType(currentMarker, event.target.value as StepType),
                                    )
                                  }
                                  className={mutedInputClassName}
                                >
                                  {stepTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="grid gap-[8px]">
                                <FieldLabel>Step ID</FieldLabel>
                                <input
                                  value={marker.id}
                                  onChange={(event) =>
                                    updateCurrentMarker(index, (currentMarker) => ({
                                      ...currentMarker,
                                      id: slugify(event.target.value) || currentMarker.id,
                                    }))
                                  }
                                  className={mutedInputClassName}
                                />
                              </label>
                            </div>

                            <label className="grid gap-[8px]">
                              <FieldLabel>Modal title</FieldLabel>
                              <input
                                value={marker.modalTitle ?? ''}
                                onChange={(event) =>
                                  updateCurrentMarker(index, (currentMarker) => ({
                                    ...currentMarker,
                                    modalTitle: event.target.value || undefined,
                                  }))
                                }
                                className={mutedInputClassName}
                              />
                            </label>

                            <div className="grid gap-[12px] xl:grid-cols-2">
                              <PlacementEditor
                                label="Desktop placement"
                                pct={marker.desktop.pct}
                                side={marker.desktop.side}
                                onPctChange={(value) =>
                                  updateCurrentMarker(index, (currentMarker) => ({
                                    ...currentMarker,
                                    desktop: {
                                      ...currentMarker.desktop,
                                      pct: Number(value) || currentMarker.desktop.pct,
                                    },
                                  }))
                                }
                                onSideChange={(value) =>
                                  updateCurrentMarker(index, (currentMarker) => ({
                                    ...currentMarker,
                                    desktop: { ...currentMarker.desktop, side: value },
                                  }))
                                }
                              />
                              <PlacementEditor
                                label="Mobile placement"
                                pct={marker.mobile.pct}
                                side={marker.mobile.side}
                                onPctChange={(value) =>
                                  updateCurrentMarker(index, (currentMarker) => ({
                                    ...currentMarker,
                                    mobile: {
                                      ...currentMarker.mobile,
                                      pct: Number(value) || currentMarker.mobile.pct,
                                    },
                                  }))
                                }
                                onSideChange={(value) =>
                                  updateCurrentMarker(index, (currentMarker) => ({
                                    ...currentMarker,
                                    mobile: { ...currentMarker.mobile, side: value },
                                  }))
                                }
                              />
                            </div>

                            <div className="grid gap-[12px] xl:grid-cols-2">
                              <LabelTuningEditor
                                label="Desktop label tuning"
                                fallbackSide={marker.desktop.side}
                                config={marker.desktopLabel}
                                onToggleSideOverride={(enabled) =>
                                  updateLabelConfig('current', index, 'desktopLabel', (config) =>
                                    buildLabelConfigWithOptionalSide(config, enabled, marker.desktop.side),
                                  )
                                }
                                onSideOverrideChange={(side) =>
                                  updateLabelConfig('current', index, 'desktopLabel', (config) => ({
                                    ...(config ?? {}),
                                    side,
                                  }))
                                }
                                onFieldChange={(field, value) =>
                                  updateLabelConfig('current', index, 'desktopLabel', (config) =>
                                    buildLabelConfigPatch(
                                      desktopSideOverride || field !== 'side'
                                        ? config
                                        : { ...(config ?? {}), side: marker.desktop.side },
                                      field,
                                      value,
                                    ),
                                  )
                                }
                                onReset={() =>
                                  updateCurrentMarker(index, (currentMarker) => ({
                                    ...currentMarker,
                                    desktopLabel: undefined,
                                  }))
                                }
                              />

                              <LabelTuningEditor
                                label="Mobile label tuning"
                                fallbackSide={marker.mobile.side}
                                config={marker.mobileLabel}
                                onToggleSideOverride={(enabled) =>
                                  updateLabelConfig('current', index, 'mobileLabel', (config) =>
                                    buildLabelConfigWithOptionalSide(config, enabled, marker.mobile.side),
                                  )
                                }
                                onSideOverrideChange={(side) =>
                                  updateLabelConfig('current', index, 'mobileLabel', (config) => ({
                                    ...(config ?? {}),
                                    side,
                                  }))
                                }
                                onFieldChange={(field, value) =>
                                  updateLabelConfig('current', index, 'mobileLabel', (config) =>
                                    buildLabelConfigPatch(
                                      mobileSideOverride || field !== 'side'
                                        ? config
                                        : { ...(config ?? {}), side: marker.mobile.side },
                                      field,
                                      value,
                                    ),
                                  )
                                }
                                onReset={() =>
                                  updateCurrentMarker(index, (currentMarker) => ({
                                    ...currentMarker,
                                    mobileLabel: undefined,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </SectionCard>
              </TabsContent>

              <TabsContent value="future">
                <SectionCard
                  title={`${stateLabels.future} steps`}
                  description="Future steps support stage assignment, before and after images, and the same shared step types."
                  actions={
                    <div className="flex flex-wrap gap-[10px]">
                      <button
                        onClick={() => autoArrangeState('future')}
                        className={`rounded-full border border-black/10 bg-white px-[16px] py-[10px] text-[14px] text-[#191919] ${interactiveButtonClassName}`}
                        style={{ fontWeight: 'bold' }}
                      >
                        Auto arrange
                      </button>
                      <button
                        onClick={addFutureStep}
                        className={`rounded-full border border-black/10 bg-white px-[16px] py-[10px] text-[14px] text-[#191919] ${interactiveButtonClassName}`}
                        style={{ fontWeight: 'bold' }}
                      >
                        Add step
                      </button>
                    </div>
                  }
                >
                  <div className="grid gap-[12px]">
                    {draftMap.futureStateMarkers.map((marker, index) => {
                      const desktopSideOverride = Boolean(marker.desktopLabel?.side);
                      const mobileSideOverride = Boolean(marker.mobileLabel?.side);

                      return (
                        <details key={marker.id} open className="rounded-[14px] border border-black/10 bg-white p-[16px]">
                          <summary
                            className="cursor-pointer rounded-[8px] text-[18px] text-[#191919] transition-colors hover:bg-black/5 active:bg-black/10"
                            style={{ fontWeight: 'bold' }}
                          >
                            Step {index + 1}
                          </summary>

                          <div className="mt-[14px] grid gap-[12px]">
                            <div className="flex justify-end">
                              <button
                                onClick={() => removeFutureStep(index)}
                                className={`rounded-full border border-black/10 bg-[#FAFAFA] px-[14px] py-[8px] text-[14px] text-[#191919] ${interactiveButtonClassName}`}
                                style={{ fontWeight: 'bold' }}
                              >
                                Remove step
                              </button>
                            </div>

                            <label className="grid gap-[8px]">
                              <FieldLabel>Step label</FieldLabel>
                              <textarea
                                value={marker.label}
                                onChange={(event) =>
                                  updateFutureMarker(index, (currentMarker) => ({
                                    ...currentMarker,
                                    label: event.target.value,
                                  }))
                                }
                                rows={3}
                                className={mutedInputClassName}
                              />
                            </label>

                            <div className="grid gap-[12px] md:grid-cols-2">
                              <label className="grid gap-[8px]">
                                <FieldLabel>Step type</FieldLabel>
                                <select
                                  value={getStepType(marker)}
                                  onChange={(event) =>
                                    updateFutureMarker(index, (currentMarker) =>
                                      applyStepType(currentMarker, event.target.value as StepType),
                                    )
                                  }
                                  className={mutedInputClassName}
                                >
                                  {stepTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <label className="grid gap-[8px]">
                                <FieldLabel>Stage</FieldLabel>
                                <select
                                  value={marker.stageId}
                                  onChange={(event) =>
                                    updateFutureMarker(index, (currentMarker) => ({
                                      ...currentMarker,
                                      stageId: event.target.value,
                                    }))
                                  }
                                  className={mutedInputClassName}
                                >
                                  {draftMap.stages.map((stage) => (
                                    <option key={stage.id} value={stage.id}>
                                      {stage.title}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>

                            <div className="grid gap-[12px] md:grid-cols-2">
                              <label className="grid gap-[8px]">
                                <FieldLabel>Modal title</FieldLabel>
                                <input
                                  value={marker.modalTitle ?? ''}
                                  onChange={(event) =>
                                    updateFutureMarker(index, (currentMarker) => ({
                                      ...currentMarker,
                                      modalTitle: event.target.value || undefined,
                                    }))
                                  }
                                  className={mutedInputClassName}
                                />
                              </label>
                              <label className="grid gap-[8px]">
                                <FieldLabel>Step ID</FieldLabel>
                                <input
                                  value={marker.id}
                                  onChange={(event) =>
                                    updateFutureMarker(index, (currentMarker) => ({
                                      ...currentMarker,
                                      id: slugify(event.target.value) || currentMarker.id,
                                    }))
                                  }
                                  className={mutedInputClassName}
                                />
                              </label>
                            </div>

                            <div className="grid gap-[12px] md:grid-cols-2">
                              <label className="grid gap-[8px]">
                                <FieldLabel>Before image filename</FieldLabel>
                                <input
                                  value={marker.beforeImage ?? ''}
                                  onChange={(event) =>
                                    updateFutureMarker(index, (currentMarker) => ({
                                      ...currentMarker,
                                      beforeImage: event.target.value || undefined,
                                    }))
                                  }
                                  className={mutedInputClassName}
                                />
                              </label>
                              <label className="grid gap-[8px]">
                                <FieldLabel>After image filename</FieldLabel>
                                <input
                                  value={marker.afterImage ?? ''}
                                  onChange={(event) =>
                                    updateFutureMarker(index, (currentMarker) => ({
                                      ...currentMarker,
                                      afterImage: event.target.value || undefined,
                                    }))
                                  }
                                  className={mutedInputClassName}
                                />
                              </label>
                            </div>

                            <div className="grid gap-[12px] xl:grid-cols-2">
                              <PlacementEditor
                                label="Desktop placement"
                                pct={marker.desktop.pct}
                                side={marker.desktop.side}
                                onPctChange={(value) =>
                                  updateFutureMarker(index, (currentMarker) => ({
                                    ...currentMarker,
                                    desktop: {
                                      ...currentMarker.desktop,
                                      pct: Number(value) || currentMarker.desktop.pct,
                                    },
                                  }))
                                }
                                onSideChange={(value) =>
                                  updateFutureMarker(index, (currentMarker) => ({
                                    ...currentMarker,
                                    desktop: { ...currentMarker.desktop, side: value },
                                  }))
                                }
                              />
                              <PlacementEditor
                                label="Mobile placement"
                                pct={marker.mobile.pct}
                                side={marker.mobile.side}
                                onPctChange={(value) =>
                                  updateFutureMarker(index, (currentMarker) => ({
                                    ...currentMarker,
                                    mobile: {
                                      ...currentMarker.mobile,
                                      pct: Number(value) || currentMarker.mobile.pct,
                                    },
                                  }))
                                }
                                onSideChange={(value) =>
                                  updateFutureMarker(index, (currentMarker) => ({
                                    ...currentMarker,
                                    mobile: { ...currentMarker.mobile, side: value },
                                  }))
                                }
                              />
                            </div>

                            <div className="grid gap-[12px] xl:grid-cols-2">
                              <LabelTuningEditor
                                label="Desktop label tuning"
                                fallbackSide={marker.desktop.side}
                                config={marker.desktopLabel}
                                onToggleSideOverride={(enabled) =>
                                  updateLabelConfig('future', index, 'desktopLabel', (config) =>
                                    buildLabelConfigWithOptionalSide(config, enabled, marker.desktop.side),
                                  )
                                }
                                onSideOverrideChange={(side) =>
                                  updateLabelConfig('future', index, 'desktopLabel', (config) => ({
                                    ...(config ?? {}),
                                    side,
                                  }))
                                }
                                onFieldChange={(field, value) =>
                                  updateLabelConfig('future', index, 'desktopLabel', (config) =>
                                    buildLabelConfigPatch(
                                      desktopSideOverride || field !== 'side'
                                        ? config
                                        : { ...(config ?? {}), side: marker.desktop.side },
                                      field,
                                      value,
                                    ),
                                  )
                                }
                                onReset={() =>
                                  updateFutureMarker(index, (currentMarker) => ({
                                    ...currentMarker,
                                    desktopLabel: undefined,
                                  }))
                                }
                              />

                              <LabelTuningEditor
                                label="Mobile label tuning"
                                fallbackSide={marker.mobile.side}
                                config={marker.mobileLabel}
                                onToggleSideOverride={(enabled) =>
                                  updateLabelConfig('future', index, 'mobileLabel', (config) =>
                                    buildLabelConfigWithOptionalSide(config, enabled, marker.mobile.side),
                                  )
                                }
                                onSideOverrideChange={(side) =>
                                  updateLabelConfig('future', index, 'mobileLabel', (config) => ({
                                    ...(config ?? {}),
                                    side,
                                  }))
                                }
                                onFieldChange={(field, value) =>
                                  updateLabelConfig('future', index, 'mobileLabel', (config) =>
                                    buildLabelConfigPatch(
                                      mobileSideOverride || field !== 'side'
                                        ? config
                                        : { ...(config ?? {}), side: marker.mobile.side },
                                      field,
                                      value,
                                    ),
                                  )
                                }
                                onReset={() =>
                                  updateFutureMarker(index, (currentMarker) => ({
                                    ...currentMarker,
                                    mobileLabel: undefined,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </SectionCard>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="preview">
            <SectionCard
              title="Live preview"
              description="This preview uses the same renderer as the public map. Publishing and PNG export both use this draft configuration."
            >
              <div className="overflow-hidden rounded-[16px] border border-black/10 bg-white">
                <JourneyMap projectOverride={previewProject} />
              </div>
            </SectionCard>
          </TabsContent>
        </Tabs>
      </div>

      <div className="pointer-events-none fixed left-[-10000px] top-0 w-[1280px]" aria-hidden="true">
        <div ref={exportRef}>
          <JourneyMap projectOverride={previewProject} />
        </div>
      </div>
    </div>
  );
}
