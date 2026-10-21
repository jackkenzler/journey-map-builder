import { toPng } from 'html-to-image';
import { Copy, Download, House, Monitor, Plus, Smartphone, Upload } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { uploadMapImage } from '../../../builder/images';
import {
  getJourneyMapProject,
  getJourneyMapProjectBySlug,
  publishJourneyMapProject,
  saveDraftProject,
} from '../../../builder/repository';
import { hasSupabaseConfig } from '../../../builder/supabase';
import {
  MAX_FUTURE_PERSONAS,
  type CurrentStateMarkerConfig,
  type FuturePersonaConfig,
  type FutureStateMarkerConfig,
  type JourneyMapConfig,
  type JourneyMapProject,
  type JourneyMarkerConfig,
  type JourneyMarkerLabelConfig,
  type JourneyStageConfig,
  type JourneyStageSummaryConfig,
  type LabelSide,
} from '../../../builder/types';
import { JourneyMap, type MarkerPlacementEdit } from '../JourneyMap';
import { RoadGradientEditor } from './RoadGradientEditor';
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
  'inline-flex h-auto w-full max-w-full flex-wrap items-center gap-[8px] rounded-full border border-[#D0D0D0] bg-[#FAFAFA] p-[8px]';
const builderTabsTriggerClassName =
  'min-h-[46px] min-w-[160px] flex-1 rounded-full px-[18px] py-[10px] text-[16px] font-bold text-[#747474] data-[state=active]:bg-[#8C1D40] data-[state=active]:text-white data-[state=active]:shadow-[0px_20px_12px_rgba(0,0,0,0.01),0px_9px_9px_rgba(0,0,0,0.03),0px_2px_5px_rgba(0,0,0,0.06)] hover:bg-black/5 hover:text-[#191919]';

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

function removeInteractiveCards<T extends JourneyMarkerConfig>(markers: T[]) {
  return markers.map((marker) =>
    marker.labelVariant === 'interactive-card'
      ? { ...marker, labelVariant: 'card' }
      : marker,
  );
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

function UploadField({
  label,
  onChange,
  disabled,
  hasValue,
  uploading,
}: {
  label: string;
  onChange: (file: File | null) => void | Promise<void>;
  disabled?: boolean;
  hasValue: boolean;
  uploading?: boolean;
}) {
  const blocked = disabled || uploading;
  return (
    <label className="grid gap-[8px]">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-[12px] rounded-[12px] border border-black/10 bg-white px-[12px] py-[10px]">
        <span
          className={`inline-flex items-center gap-[8px] rounded-full px-[14px] py-[9px] text-[14px] text-white ${interactiveButtonClassName} ${blocked ? 'cursor-not-allowed bg-[#B7B7B7]' : 'bg-[#8C1D40] hover:bg-[#7a1938]'}`}
          style={{ fontWeight: 'bold' }}
        >
          <Upload className="size-[16px]" />
          {uploading ? 'Uploading...' : 'Upload photo'}
        </span>
        <span className="text-[14px] text-[#5f5f5f]">
          {hasValue ? 'Image hosted and ready' : 'PNG, JPG, or WebP, up to 10 MB'}
        </span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={async (event) => {
            const file = event.target.files?.[0] ?? null;
            await onChange(file);
            event.target.value = '';
          }}
          className="hidden"
          disabled={blocked}
        />
      </div>
    </label>
  );
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

      <div className="grid gap-[12px] md:grid-cols-3">
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
        <label className="grid gap-[8px]">
          <FieldLabel>Fixed width</FieldLabel>
          <input
            value={config?.width ?? ''}
            onChange={(event) => onFieldChange('width', event.target.value)}
            className={mutedInputClassName}
            placeholder="Auto"
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

function FutureStepsEditor({
  title,
  description,
  markers,
  onMarkersChange,
  stages,
  comparisonModalEnabled,
}: {
  title: string;
  description: string;
  markers: FutureStateMarkerConfig[];
  onMarkersChange: (updater: (current: FutureStateMarkerConfig[]) => FutureStateMarkerConfig[]) => void;
  stages: JourneyStageConfig[];
  comparisonModalEnabled: boolean;
}) {
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const updateMarker = (
    index: number,
    updater: (marker: FutureStateMarkerConfig) => FutureStateMarkerConfig,
  ) => {
    onMarkersChange((current) => current.map((marker, markerIndex) => (markerIndex === index ? updater(marker) : marker)));
  };

  const updateLabelConfig = (
    index: number,
    key: LabelConfigKey,
    updater: (config: JourneyMarkerLabelConfig | undefined) => JourneyMarkerLabelConfig,
  ) => {
    updateMarker(index, (marker) => ({ ...marker, [key]: updater(marker[key]) }));
  };

  const addStep = () => {
    onMarkersChange((current) => {
      const lastMarker = current[current.length - 1];
      return distributeMarkerPlacements(
        [
          ...current,
          {
            id: `future-step-${Date.now().toString(36)}`,
            label: 'New step',
            modalTitle: 'New step',
            labelVariant: 'interactive-card',
            stageId: stages[0]?.id ?? '',
            desktop: { pct: nextPct(lastMarker?.desktop.pct, 0.2), side: 'below' },
            mobile: { pct: nextPct(lastMarker?.mobile.pct, 0.2), side: 'right' },
            beforeImage: '',
            afterImage: '',
          },
        ],
        'future',
      );
    });
  };

  const removeStep = (index: number) => {
    onMarkersChange((current) =>
      distributeMarkerPlacements(current.filter((_, markerIndex) => markerIndex !== index), 'future'),
    );
  };

  const uploadImage = async (index: number, field: 'beforeImage' | 'afterImage', file: File | null) => {
    if (!file) return;
    const key = `${index}-${field}`;
    setUploadingKey(key);
    setUploadError(null);
    try {
      const url = await uploadMapImage(file, file.name);
      updateMarker(index, (currentMarker) => ({ ...currentMarker, [field]: url }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setUploadingKey(null);
    }
  };

  return (
    <SectionCard
      title={title}
      description={description}
      actions={
        <div className="flex flex-wrap gap-[10px]">
          <button
            onClick={() => onMarkersChange((current) => distributeMarkerPlacements(current, 'future'))}
            className={`rounded-full border border-black/10 bg-white px-[16px] py-[10px] text-[14px] text-[#191919] ${interactiveButtonClassName}`}
            style={{ fontWeight: 'bold' }}
          >
            Auto arrange
          </button>
          <button
            onClick={addStep}
            className={`rounded-full border border-black/10 bg-white px-[16px] py-[10px] text-[14px] text-[#191919] ${interactiveButtonClassName}`}
            style={{ fontWeight: 'bold' }}
          >
            Add step
          </button>
        </div>
      }
    >
      {uploadError ? (
        <p className="mb-[12px] rounded-[12px] border border-[#E4B4B4] bg-[#FFF4F4] px-[14px] py-[10px] text-[14px] text-[#8A1F1F]">
          {uploadError}
        </p>
      ) : null}
      <div className="grid gap-[12px]">
        {markers.map((marker, index) => {
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
                    onClick={() => removeStep(index)}
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
                      updateMarker(index, (currentMarker) => ({
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
                        updateMarker(index, (currentMarker) =>
                          applyStepType(currentMarker, event.target.value as StepType),
                        )
                      }
                      className={mutedInputClassName}
                    >
                      {stepTypeOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          disabled={!comparisonModalEnabled && option.value === 'interactive-card'}
                        >
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
                        updateMarker(index, (currentMarker) => ({
                          ...currentMarker,
                          stageId: event.target.value,
                        }))
                      }
                      className={mutedInputClassName}
                    >
                      {stages.map((stage) => (
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
                        updateMarker(index, (currentMarker) => ({
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
                        updateMarker(index, (currentMarker) => ({
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
                    <FieldLabel>Before image URL</FieldLabel>
                    <input
                      value={marker.beforeImage ?? ''}
                      onChange={(event) =>
                        updateMarker(index, (currentMarker) => ({
                          ...currentMarker,
                          beforeImage: event.target.value || undefined,
                        }))
                      }
                      className={mutedInputClassName}
                      disabled={!comparisonModalEnabled}
                      placeholder={comparisonModalEnabled ? 'Paste an image URL or upload below' : 'Enable comparison modal first'}
                    />
                  </label>
                  <label className="grid gap-[8px]">
                    <FieldLabel>After image URL</FieldLabel>
                    <input
                      value={marker.afterImage ?? ''}
                      onChange={(event) =>
                        updateMarker(index, (currentMarker) => ({
                          ...currentMarker,
                          afterImage: event.target.value || undefined,
                        }))
                      }
                      className={mutedInputClassName}
                      disabled={!comparisonModalEnabled}
                      placeholder={comparisonModalEnabled ? 'Paste an image URL or upload below' : 'Enable comparison modal first'}
                    />
                  </label>
                </div>

                <div className="grid gap-[12px] md:grid-cols-2">
                  <UploadField
                    label="Upload before image"
                    hasValue={Boolean(marker.beforeImage)}
                uploading={uploadingKey === `${index}-beforeImage`}
                    disabled={!comparisonModalEnabled}
                    onChange={(file) => uploadImage(index, 'beforeImage', file)}
                  />
                  <UploadField
                    label="Upload after image"
                    hasValue={Boolean(marker.afterImage)}
                uploading={uploadingKey === `${index}-afterImage`}
                    disabled={!comparisonModalEnabled}
                    onChange={(file) => uploadImage(index, 'afterImage', file)}
                  />
                </div>

                <div className="grid gap-[12px] md:grid-cols-2">
                  <div className="rounded-[12px] border border-black/10 bg-[#FAFAFA] px-[12px] py-[10px] text-[14px] text-[#5f5f5f]">
                    {marker.beforeImage
                      ? 'Before image configured'
                      : 'Before image will use a placeholder until one is uploaded'}
                  </div>
                  <div className="rounded-[12px] border border-black/10 bg-[#FAFAFA] px-[12px] py-[10px] text-[14px] text-[#5f5f5f]">
                    {marker.afterImage
                      ? 'After image configured'
                      : 'After image will use a placeholder until one is uploaded'}
                  </div>
                </div>

                <div className="grid gap-[12px] xl:grid-cols-2">
                  <PlacementEditor
                    label="Desktop placement"
                    pct={marker.desktop.pct}
                    side={marker.desktop.side}
                    onPctChange={(value) =>
                      updateMarker(index, (currentMarker) => ({
                        ...currentMarker,
                        desktop: {
                          ...currentMarker.desktop,
                          pct: Number(value) || currentMarker.desktop.pct,
                        },
                      }))
                    }
                    onSideChange={(value) =>
                      updateMarker(index, (currentMarker) => ({
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
                      updateMarker(index, (currentMarker) => ({
                        ...currentMarker,
                        mobile: {
                          ...currentMarker.mobile,
                          pct: Number(value) || currentMarker.mobile.pct,
                        },
                      }))
                    }
                    onSideChange={(value) =>
                      updateMarker(index, (currentMarker) => ({
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
                      updateLabelConfig(index, 'desktopLabel', (config) =>
                        buildLabelConfigWithOptionalSide(config, enabled, marker.desktop.side),
                      )
                    }
                    onSideOverrideChange={(side) =>
                      updateLabelConfig(index, 'desktopLabel', (config) => ({
                        ...(config ?? {}),
                        side,
                      }))
                    }
                    onFieldChange={(field, value) =>
                      updateLabelConfig(index, 'desktopLabel', (config) =>
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
                      updateMarker(index, (currentMarker) => ({
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
                      updateLabelConfig(index, 'mobileLabel', (config) =>
                        buildLabelConfigWithOptionalSide(config, enabled, marker.mobile.side),
                      )
                    }
                    onSideOverrideChange={(side) =>
                      updateLabelConfig(index, 'mobileLabel', (config) => ({
                        ...(config ?? {}),
                        side,
                      }))
                    }
                    onFieldChange={(field, value) =>
                      updateLabelConfig(index, 'mobileLabel', (config) =>
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
                      updateMarker(index, (currentMarker) => ({
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
  );
}

export function BuilderMapView() {
  const { orgSlug, mapSlug = '' } = useParams();
  const [project, setProject] = useState<JourneyMapProject | null | undefined>(undefined);
  const [draftMap, setDraftMap] = useState<JourneyMapConfig | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [activeStepsTab, setActiveStepsTab] = useState<StateKey>('current');
  const [editingPersonaId, setEditingPersonaId] = useState<string | null>(null);
  const [previewLayout, setPreviewLayout] = useState<'desktop' | 'mobile'>('desktop');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setProject(undefined);
    setLoadError(null);

    const load = orgSlug ? getJourneyMapProject(orgSlug, mapSlug) : getJourneyMapProjectBySlug(mapSlug);
    load
      .then((result) => {
        if (!cancelled) setProject(result);
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setLoadError(error.message);
        setProject(null);
      });

    return () => {
      cancelled = true;
    };
  }, [orgSlug, mapSlug]);

  useEffect(() => {
    if (!project) return;
    setDraftMap(project.map);
    setSavedSnapshot(JSON.stringify(project.map));
    setEditingPersonaId(null);
  }, [project]);

  const hasUnsavedChanges = useMemo(
    () => Boolean(draftMap) && JSON.stringify(draftMap) !== savedSnapshot,
    [draftMap, savedSnapshot],
  );

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (!draftMap) return;
    const features = {
      summaryPanelEnabled: true,
      ...draftMap.features,
    };
    const nextVisibleStates = ([
      features.currentStateEnabled ? 'current' : null,
      features.futureStateEnabled ? 'future' : null,
    ].filter(Boolean) as StateKey[]);

    if (nextVisibleStates.length === 0) return;
    if (!nextVisibleStates.includes(activeStepsTab)) {
      setActiveStepsTab(nextVisibleStates[0]);
    }
  }, [activeStepsTab, draftMap]);

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

  const updateLabelConfig = (
    _state: 'current',
    index: number,
    key: LabelConfigKey,
    updater: (config: JourneyMarkerLabelConfig | undefined) => JourneyMarkerLabelConfig,
  ) => {
    updateCurrentMarker(index, (marker) => ({ ...marker, [key]: updater(marker[key]) }));
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
          // Give the new last stage the second half of whatever road the last stage had left.
          gradientTransitions: current.theme.gradientTransitions
            ? [...current.theme.gradientTransitions, (current.theme.gradientTransitions.at(-1) ?? 0) / 2 + 0.5]
            : undefined,
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
          // Removing a stage merges it into its neighbour: drop the fade point on its left edge.
          gradientTransitions: current.theme.gradientTransitions?.filter(
            (_, transitionIndex) => transitionIndex !== Math.max(index - 1, 0),
          ),
        },
        futureStateMarkers: current.futureStateMarkers.map((marker) =>
          marker.stageId === removedStage.id ? { ...marker, stageId: fallbackStageId } : marker,
        ),
        futurePersonas: (current.futurePersonas ?? []).map((persona) => ({
          ...persona,
          markers: persona.markers.map((marker) =>
            marker.stageId === removedStage.id ? { ...marker, stageId: fallbackStageId } : marker,
          ),
        })),
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

  const removeCurrentStep = (index: number) => {
    updateDraftMap((current) => ({
      ...current,
      currentStateMarkers: distributeMarkerPlacements(
        current.currentStateMarkers.filter((_, markerIndex) => markerIndex !== index),
        'current',
      ),
    }));
  };

  const autoArrangeCurrentState = () => {
    updateDraftMap((current) => ({
      ...current,
      currentStateMarkers: distributeMarkerPlacements(current.currentStateMarkers, 'current'),
    }));
  };

  // Applies a drag or label-side change made directly on the live preview.
  const handlePlacementEdit = (edit: MarkerPlacementEdit) => {
    const apply = <T extends JourneyMarkerConfig>(marker: T): T => {
      const next: T = {
        ...marker,
        ...(edit.label !== undefined ? { label: edit.label } : {}),
        [edit.layout]: {
          ...marker[edit.layout],
          ...(edit.pct !== undefined ? { pct: edit.pct } : {}),
          ...(edit.side ? { side: edit.side } : {}),
        },
      };

      // A per-layout label side override would hide the change, so clear it.
      const labelKey: LabelConfigKey = edit.layout === 'desktop' ? 'desktopLabel' : 'mobileLabel';
      if (edit.side && marker[labelKey]?.side) {
        const { side: _removed, ...rest } = marker[labelKey]!;
        next[labelKey] = Object.keys(rest).length > 0 ? rest : undefined;
      }

      if (edit.width !== undefined) {
        const labelConfig = { ...(next[labelKey] ?? {}) };
        if (edit.width === null) delete labelConfig.width;
        else labelConfig.width = edit.width;
        next[labelKey] = Object.keys(labelConfig).length > 0 ? labelConfig : undefined;
      }
      return next;
    };
    const applyAt = <T extends JourneyMarkerConfig>(markers: T[]) =>
      markers.map((marker, index) => (index === edit.index ? apply(marker) : marker));

    updateDraftMap((current) => {
      if (edit.state === 'current') {
        return { ...current, currentStateMarkers: applyAt(current.currentStateMarkers) };
      }
      if (edit.personaId) {
        return {
          ...current,
          futurePersonas: (current.futurePersonas ?? []).map((persona) =>
            persona.id === edit.personaId ? { ...persona, markers: applyAt(persona.markers) } : persona,
          ),
        };
      }
      return { ...current, futureStateMarkers: applyAt(current.futureStateMarkers) };
    });
  };

  const personas = draftMap?.futurePersonas ?? [];
  const editingPersona = personas.find((persona) => persona.id === editingPersonaId) ?? null;

  const updatePersona = (personaId: string, updater: (persona: FuturePersonaConfig) => FuturePersonaConfig) => {
    updateDraftMap((current) => ({
      ...current,
      futurePersonas: (current.futurePersonas ?? []).map((persona) =>
        persona.id === personaId ? updater(persona) : persona,
      ),
    }));
  };

  const addPersona = () => {
    const existing = draftMap?.futurePersonas ?? [];
    if (existing.length >= MAX_FUTURE_PERSONAS) return;

    const persona: FuturePersonaConfig = {
      id: `persona-${Date.now().toString(36)}`,
      name: `Persona ${existing.length + 1}`,
      // Start from the main future steps so there is something to edit; it can be changed freely.
      markers: JSON.parse(JSON.stringify(draftMap?.futureStateMarkers ?? [])) as FutureStateMarkerConfig[],
    };
    updateDraftMap((current) => ({
      ...current,
      futurePersonas: [...(current.futurePersonas ?? []), persona].slice(0, MAX_FUTURE_PERSONAS),
    }));
    setEditingPersonaId(persona.id);
  };

  const removePersona = (personaId: string) => {
    const persona = personas.find((item) => item.id === personaId);
    if (!persona) return;
    if (!window.confirm(`Delete "${persona.name.trim() || 'this persona'}" and all of its steps?`)) return;

    updateDraftMap((current) => ({
      ...current,
      futurePersonas: (current.futurePersonas ?? []).filter((item) => item.id !== personaId),
    }));
    setEditingPersonaId(null);
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
            {loadError ?? 'This builder route does not have a matching project configuration yet.'}
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
  const defaultPersonaName = draftMap.futureDefaultPersonaName?.trim() || 'Default';
  const features = {
    summaryPanelEnabled: true,
    ...draftMap.features,
  };
  const visibleStepStates = ([
    features.currentStateEnabled ? 'current' : null,
    features.futureStateEnabled ? 'future' : null,
  ].filter(Boolean) as StateKey[]);
  const publishing = draftMap.publishing ?? { siteSlug: draftMap.slug };
  const previewHref = `/preview/${draftMap.slug}`;
  const publishedHref = `/published/${publishing.siteSlug}`;
  const previewProject: JourneyMapProject = {
    map: {
      ...draftMap,
      publishing,
    },
  };

  const publishedUrl = `${window.location.origin}${publishedHref}`;

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await saveDraftProject(previewProject);
      setSavedSnapshot(JSON.stringify(draftMap));
      setSaveMessage('Draft saved to your account. You can open it from any device.');
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : 'Save failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDraft = () => {
    if (hasUnsavedChanges && !window.confirm('Discard your unsaved changes and go back to the last saved draft?')) return;
    setDraftMap(project.map);
    setSavedSnapshot(JSON.stringify(project.map));
    setEditingPersonaId(null);
    setSaveMessage('Unsaved changes discarded.');
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      const result = await publishJourneyMapProject(previewProject);
      setDraftMap(result.project.map);
      setSavedSnapshot(JSON.stringify(result.project.map));
      setSaveMessage(`Published. Anyone with the link can view it: ${window.location.origin}/published/${result.siteSlug}`);
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : 'Publish failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publishedUrl);
      setSaveMessage('Published link copied.');
    } catch {
      setSaveMessage(`Copy this link: ${publishedUrl}`);
    }
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
            Map key: {draftMap.slug}
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
                target="_blank"
                rel="noreferrer"
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
            <p className="mb-[8px] text-[14px] text-[#767676]">Map status</p>
            <p className="text-[20px] text-[#191919]" style={{ fontWeight: 'bold' }}>
              {draftMap.publishing.lastPublishedAt ? 'Published and editable' : 'Draft in progress'}
            </p>
            <p className="mt-[6px] text-[14px] leading-[1.5] text-[#767676]">
              {draftMap.publishing.lastPublishedAt
                ? 'Changes stay in draft until you publish again.'
                : 'This map is only visible in the builder until you publish it.'}
            </p>
          </div>
          <div className="rounded-[16px] border border-black/10 bg-white p-[20px]">
            <p className="mb-[8px] text-[14px] text-[#767676]">Draft storage</p>
            <p className="text-[20px] text-[#191919]" style={{ fontWeight: 'bold' }}>
              {!hasSupabaseConfig ? 'Cloud not configured' : hasUnsavedChanges ? 'Unsaved changes' : 'Saved to your account'}
            </p>
            <p className="mt-[6px] text-[14px] leading-[1.5] text-[#767676]">
              {hasSupabaseConfig
                ? 'Drafts and uploaded images are stored online, so they follow you to any device.'
                : 'Add the Supabase environment variables to save drafts and host images.'}
            </p>
          </div>
          <div className="rounded-[16px] border border-black/10 bg-white p-[20px]">
            <p className="mb-[8px] text-[14px] text-[#767676]">Public link</p>
            <div className="flex items-start gap-[10px]">
              <Link
                to={publishedHref}
                target="_blank"
                rel="noreferrer"
                className={`text-[16px] break-all text-[#8C1D40] underline underline-offset-4 ${interactiveLinkClassName}`}
                style={{ fontWeight: 'bold' }}
              >
                {publishedHref}
              </Link>
              <button
                type="button"
                onClick={handleCopyLink}
                aria-label="Copy public link"
                title="Copy public link"
                className={`inline-flex size-[32px] shrink-0 items-center justify-center rounded-full border border-black/10 bg-[#FAFAFA] text-[#191919] ${interactiveButtonClassName}`}
              >
                <Copy className="size-[14px]" />
              </button>
            </div>
            <p className="mt-[6px] text-[14px] leading-[1.5] text-[#767676]">
              {draftMap.publishing.lastPublishedAt
                ? 'Anyone with this link can view the published map.'
                : 'Works for anyone once you publish.'}
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
              Discard changes
            </button>
            <button
              onClick={handlePublish}
              disabled={isSaving}
              className={`rounded-full border border-black/10 bg-white px-[16px] py-[10px] text-[14px] text-[#191919] ${interactiveButtonClassName} disabled:cursor-wait disabled:opacity-60`}
              style={{ fontWeight: 'bold' }}
            >
              {isSaving ? 'Working...' : 'Publish map'}
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
              disabled={isSaving}
              className={`rounded-full bg-[#8C1D40] px-[16px] py-[10px] text-[14px] text-white ${interactiveButtonClassName} disabled:cursor-wait disabled:opacity-60`}
              style={{ fontWeight: 'bold' }}
            >
              {isSaving ? 'Saving...' : 'Save draft'}
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
                      <Link
                        to={publishedHref}
                        target="_blank"
                        rel="noreferrer"
                        className={`break-all text-[15px] text-[#8C1D40] underline underline-offset-4 ${interactiveLinkClassName}`}
                      >
                        {publishedHref}
                      </Link>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Feature visibility" description="Turn key map behaviors on or off without changing the content itself.">
                  <div className="grid gap-[12px]">
                    {[
                      ['currentStateEnabled', 'Show current state'],
                      ['futureStateEnabled', 'Show future state'],
                      ['futurePersonasEnabled', 'Show persona dropdown on future state'],
                      ['summaryPanelEnabled', 'Show summary panel'],
                      ['guidedTourEnabled', 'Show guided tour'],
                      ['comparisonModalEnabled', 'Show comparison modal'],
                    ].map(([key, label]) => (
                      <label
                        key={key}
                        className="flex items-center justify-between rounded-[12px] border border-black/10 bg-white px-[14px] py-[12px]"
                      >
                        <span className="text-[16px] text-[#191919]">{label}</span>
                        <Switch
                          checked={Boolean(features[key as keyof typeof features])}
                          onCheckedChange={(checked) =>
                            updateDraftMap((current) => ({
                              ...current,
                              features: {
                                summaryPanelEnabled: true,
                                ...current.features,
                                [key]: checked,
                              },
                              currentStateMarkers:
                                key === 'comparisonModalEnabled' && !checked
                                  ? removeInteractiveCards(current.currentStateMarkers)
                                  : current.currentStateMarkers,
                              futureStateMarkers:
                                key === 'comparisonModalEnabled' && !checked
                                  ? removeInteractiveCards(current.futureStateMarkers)
                                  : current.futureStateMarkers,
                              futurePersonas:
                                key === 'comparisonModalEnabled' && !checked
                                  ? (current.futurePersonas ?? []).map((persona) => ({
                                      ...persona,
                                      markers: removeInteractiveCards(persona.markers),
                                    }))
                                  : current.futurePersonas,
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
                        disabled={!features.guidedTourEnabled}
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
                        disabled={!features.guidedTourEnabled}
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
                          disabled={!features.guidedTourEnabled}
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
                          disabled={!features.guidedTourEnabled}
                        />
                      </label>
                    </div>
                    {!features.guidedTourEnabled ? (
                      <p className="text-[14px] leading-[1.5] text-[#767676]">
                        Turn guided tour visibility back on to edit the popover content and anchor steps.
                      </p>
                    ) : null}
                  </div>
                </SectionCard>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stages" className="grid gap-[16px]">
            <SectionCard
              title="Road gradient"
              description="Drag the handles to choose where the road fades from one stage color into the next. Stages don't have to take up equal space."
            >
              <RoadGradientEditor
                stages={draftMap.stages}
                transitions={draftMap.theme.gradientTransitions}
                onChange={(gradientTransitions) =>
                  updateDraftMap((current) => ({
                    ...current,
                    theme: { ...current.theme, gradientTransitions },
                  }))
                }
              />
            </SectionCard>

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
            {visibleStepStates.length === 0 ? (
              <SectionCard
                title="Steps"
                description="Turn on current state or future state in Feature visibility to edit their steps."
              >
                <p className="text-[16px] leading-[1.5] text-[#5f5f5f]">
                  Both states are currently hidden, so there are no editable step groups to show here.
                </p>
              </SectionCard>
            ) : (
            <Tabs value={activeStepsTab} onValueChange={(value) => setActiveStepsTab(value as StateKey)} className="gap-[16px]">
              {visibleStepStates.length > 1 ? (
                <TabsList className={builderTabsListClassName}>
                  {features.currentStateEnabled ? (
                    <TabsTrigger value="current" className={builderTabsTriggerClassName}>
                      {stateLabels.current}
                    </TabsTrigger>
                  ) : null}
                  {features.futureStateEnabled ? (
                    <TabsTrigger value="future" className={builderTabsTriggerClassName}>
                      {stateLabels.future}
                    </TabsTrigger>
                  ) : null}
                </TabsList>
              ) : null}

              {features.currentStateEnabled ? (
              <TabsContent value="current">
                <SectionCard
                  title={`${stateLabels.current} steps`}
                  description="Every step can use any step type. New steps auto-arrange into safe desktop and mobile zones."
                  actions={
                    <div className="flex flex-wrap gap-[10px]">
                      <button
                        onClick={autoArrangeCurrentState}
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
                                    <option
                                      key={option.value}
                                      value={option.value}
                                      disabled={!features.comparisonModalEnabled && option.value === 'interactive-card'}
                                    >
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
              ) : null}

              {features.futureStateEnabled ? (
              <TabsContent value="future">
                <div className="grid gap-[16px]">
                  <SectionCard
                    title="Personas"
                    description={`Show a persona dropdown on the ${stateLabels.future.toLowerCase()} so each persona can have its own version of the steps, images, and summaries. Add up to ${MAX_FUTURE_PERSONAS}.`}
                  >
                    <div className="grid gap-[14px]">
                      <label className="flex items-center justify-between rounded-[12px] border border-black/10 bg-white px-[14px] py-[12px]">
                        <span className="text-[16px] text-[#191919]">Show persona dropdown</span>
                        <Switch
                          checked={Boolean(features.futurePersonasEnabled)}
                          onCheckedChange={(checked) =>
                            updateDraftMap((current) => ({
                              ...current,
                              features: { ...current.features, futurePersonasEnabled: checked },
                            }))
                          }
                        />
                      </label>

                      {features.futurePersonasEnabled ? (
                        <>
                          <div className="flex flex-wrap items-center gap-[8px]">
                            <button
                              type="button"
                              onClick={() => setEditingPersonaId(null)}
                              className={`rounded-full border px-[16px] py-[9px] text-[14px] ${interactiveButtonClassName} ${
                                !editingPersona ? 'border-[#8C1D40] bg-[#8C1D40] text-white' : 'border-black/10 bg-white text-[#191919]'
                              }`}
                              style={{ fontWeight: 'bold' }}
                            >
                              {defaultPersonaName}
                            </button>
                            {personas.map((persona) => (
                              <button
                                key={persona.id}
                                type="button"
                                onClick={() => setEditingPersonaId(persona.id)}
                                className={`rounded-full border px-[16px] py-[9px] text-[14px] ${interactiveButtonClassName} ${
                                  editingPersona?.id === persona.id
                                    ? 'border-[#8C1D40] bg-[#8C1D40] text-white'
                                    : 'border-black/10 bg-white text-[#191919]'
                                }`}
                                style={{ fontWeight: 'bold' }}
                              >
                                {persona.name.trim() || 'Untitled persona'}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={addPersona}
                              disabled={personas.length >= MAX_FUTURE_PERSONAS}
                              className={`inline-flex items-center gap-[6px] rounded-full border border-dashed border-black/30 bg-[#FAFAFA] px-[16px] py-[9px] text-[14px] text-[#191919] ${interactiveButtonClassName} disabled:cursor-not-allowed disabled:opacity-50`}
                              style={{ fontWeight: 'bold' }}
                            >
                              <Plus className="size-[14px]" />
                              Add persona
                            </button>
                            <span className="text-[13px] text-[#767676]">
                              {personas.length} of {MAX_FUTURE_PERSONAS}
                            </span>
                          </div>

                          {editingPersona ? (
                            <div className="grid gap-[12px] rounded-[14px] border border-black/10 bg-white p-[16px]">
                              <div className="flex flex-wrap items-end gap-[12px]">
                                <label className="grid min-w-[220px] flex-1 gap-[8px]">
                                  <FieldLabel>Persona name</FieldLabel>
                                  <input
                                    value={editingPersona.name}
                                    onChange={(event) => updatePersona(editingPersona.id, (persona) => ({ ...persona, name: event.target.value }))}
                                    className={mutedInputClassName}
                                    maxLength={60}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removePersona(editingPersona.id)}
                                  className={`rounded-full border border-black/10 bg-[#FAFAFA] px-[14px] py-[10px] text-[14px] text-[#191919] ${interactiveButtonClassName}`}
                                  style={{ fontWeight: 'bold' }}
                                >
                                  Delete persona
                                </button>
                              </div>

                              <div className="grid gap-[12px]">
                                <FieldLabel>Stage summaries (leave blank to use the {defaultPersonaName} summary)</FieldLabel>
                                {draftMap.stages.map((stage, stageIndex) => (
                                  <label key={stage.id} className="grid gap-[6px]">
                                    <span className="text-[14px] text-[#191919]" style={{ fontWeight: 'bold' }}>
                                      {stage.number} {stage.title}
                                    </span>
                                    <textarea
                                      value={editingPersona.summaryOverrides?.[stage.id] ?? ''}
                                      onChange={(event) =>
                                        updatePersona(editingPersona.id, (persona) => ({
                                          ...persona,
                                          summaryOverrides: { ...persona.summaryOverrides, [stage.id]: event.target.value },
                                        }))
                                      }
                                      rows={3}
                                      placeholder={draftMap.futureSummaries[stageIndex]?.description ?? ''}
                                      className={mutedInputClassName}
                                    />
                                  </label>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <label className="grid max-w-[420px] gap-[8px]">
                              <FieldLabel>Dropdown name for the main {stateLabels.future.toLowerCase()}</FieldLabel>
                              <input
                                value={draftMap.futureDefaultPersonaName ?? ''}
                                onChange={(event) =>
                                  updateDraftMap((current) => ({ ...current, futureDefaultPersonaName: event.target.value || undefined }))
                                }
                                placeholder="Default"
                                className={mutedInputClassName}
                                maxLength={60}
                              />
                            </label>
                          )}
                        </>
                      ) : (
                        <p className="text-[14px] leading-[1.5] text-[#767676]">
                          Off: the {stateLabels.future.toLowerCase()} shows one set of steps. Any personas you have created are kept and come back when you turn this on.
                        </p>
                      )}
                    </div>
                  </SectionCard>

                  {editingPersona ? (
                    <FutureStepsEditor
                      key={editingPersona.id}
                      title={`${editingPersona.name.trim() || 'Persona'} steps`}
                      description="This persona's own steps. They can differ completely from the other versions, including images, stages, and placement."
                      markers={editingPersona.markers}
                      onMarkersChange={(updater) =>
                        updatePersona(editingPersona.id, (persona) => ({ ...persona, markers: updater(persona.markers) }))
                      }
                      stages={draftMap.stages}
                      comparisonModalEnabled={features.comparisonModalEnabled}
                    />
                  ) : (
                    <FutureStepsEditor
                      key="default-future"
                      title={`${stateLabels.future} steps${features.futurePersonasEnabled ? ` (${defaultPersonaName})` : ''}`}
                      description="Future steps support stage assignment, before and after images, and the same shared step types."
                      markers={draftMap.futureStateMarkers}
                      onMarkersChange={(updater) =>
                        updateDraftMap((current) => ({ ...current, futureStateMarkers: updater(current.futureStateMarkers) }))
                      }
                      stages={draftMap.stages}
                      comparisonModalEnabled={features.comparisonModalEnabled}
                    />
                  )}
                </div>
              </TabsContent>
              ) : null}
            </Tabs>
            )}
          </TabsContent>

          <TabsContent value="preview">
            <SectionCard
              title="Live preview"
              description="Drag a step dot along the road to change its path position. Click a dot to choose which side its label sits on. Changes apply to the draft immediately, and publishing and PNG export use it."
              actions={
                <div className="inline-flex rounded-full border border-black/10 bg-[#FAFAFA] p-[4px]">
                  {([
                    ['desktop', 'Desktop', Monitor],
                    ['mobile', 'Mobile', Smartphone],
                  ] as const).map(([value, label, Icon]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPreviewLayout(value)}
                      className={`inline-flex items-center gap-[6px] rounded-full px-[14px] py-[7px] text-[14px] ${interactiveButtonClassName} ${
                        previewLayout === value ? 'bg-[#8C1D40] text-white' : 'text-[#191919]'
                      }`}
                      style={{ fontWeight: 'bold' }}
                    >
                      <Icon className="size-[15px]" />
                      {label}
                    </button>
                  ))}
                </div>
              }
            >
              <p className="mb-[12px] text-[14px] leading-[1.5] text-[#767676]">
                You are editing the {previewLayout} placement. Switch to {previewLayout === 'desktop' ? 'Mobile' : 'Desktop'} to adjust the other layout, and use the state toggle in the preview to edit the other state.
              </p>
              <div
                className={`overflow-hidden rounded-[16px] border border-black/10 bg-white ${previewLayout === 'mobile' ? 'mx-auto max-w-[430px]' : ''}`}
              >
                <JourneyMap
                  projectOverride={previewProject}
                  onPlacementChange={handlePlacementEdit}
                  layoutOverride={previewLayout}
                />
              </div>
            </SectionCard>
          </TabsContent>
        </Tabs>
      </div>

      <div className="pointer-events-none fixed left-[-10000px] top-0 w-[1280px]" aria-hidden="true">
        <div ref={exportRef}>
          <JourneyMap projectOverride={previewProject} exportMode />
        </div>
      </div>
    </div>
  );
}
