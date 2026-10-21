import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronDown } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import imgLogo from 'figma:asset/ed52d950de27f23ebc18b225e72eff9d85fd6cb6.png';
import warningIcon from '../../../warningIcon.svg';
import emailIcon from '../../../emailIcon-2.svg';
import { PlatformModal } from './PlatformModal';
import { GuidedTourPopover } from './GuidedTourPopover';
import { journeyStages } from '../data/journeyData';
import { comparisonImageAssetsByFilename } from '../data/comparisonImages';
import type { JourneyMapProject } from '../../builder';
import { asuNondegreeProject } from '../../builder';
import { normalizeMapConfig } from '../../builder/normalize';
import { getGradientColorStops } from '../../builder/gradient';

// The road path — extended well beyond edges so it bleeds off-screen
const ROAD_PATH = "M-800 438H254.925C327.274 438 385.925 379.349 385.925 307V143.038C385.925 72.8767 442.801 16 512.962 16C583.123 16 640 72.8767 640 143.038V457.203C640 527.231 696.769 584 766.797 584C836.825 584 893.594 527.231 893.594 457.203V253C893.594 180.651 952.245 122 1024.59 122H2100";

// Label offset for future state step dots
const LABEL_OFFSET = 32;
const MOBILE_BREAKPOINT = 980;
const MOBILE_ROAD_HEIGHT = 1090;
const MOBILE_ROAD_ASPECT_RATIO = 514 / 980;

// Reference width the path was designed for
const BASE_WIDTH = 1280;
const ORIGINAL_PATH_HEIGHT = 620;
const DESKTOP_MAP_HEIGHT = 568;
const VIEWBOX_Y_OFFSET = 10;

type JourneyState = 'current' | 'future';
type LabelSide = 'above' | 'below' | 'left' | 'right';

interface ComputedPoint {
  x: number;
  y: number;
}

interface MobileFutureLabelConfig {
  side: LabelSide;
  distance?: number;
  maxWidth?: number;
  shiftX?: number;
  shiftY?: number;
}

interface CurrentStateMarker {
  desktopPct: number;
  mobilePct: number;
  label: string;
  side: LabelSide;
  mobileSide: LabelSide;
  labelVariant: 'plain' | 'card' | 'interactive-card';
  icon?: 'warning' | 'email';
  desktopLabel?: MobileFutureLabelConfig;
  mobileLabel?: MobileFutureLabelConfig;
}

interface MobileCurrentLabelConfig {
  side: LabelSide;
}

interface FutureStateMarker {
  desktopPct: number;
  mobilePct: number;
  label: string;
  side: LabelSide;
  mobileSide: LabelSide;
  labelVariant: 'plain' | 'card' | 'interactive-card';
  icon?: 'warning' | 'email';
  desktopLabel?: MobileFutureLabelConfig;
  mobileLabel?: MobileFutureLabelConfig;
  beforeImage?: string;
  afterImage?: string;
  stageIdx: number;
  stepIdx: number;
}

interface SelectedStep {
  stageIdx: number;
  stepIdx: number;
  label: string;
  markerIndex: number;
  beforeImg?: string;
  afterImg?: string;
}

export interface MarkerPlacementEdit {
  state: JourneyState;
  /** Set when the future state is showing a persona's own steps. */
  personaId: string | null;
  index: number;
  layout: 'desktop' | 'mobile';
  pct?: number;
  side?: LabelSide;
}

const MIN_DRAG_PCT = 0.1;
const MAX_DRAG_PCT = 0.95;
const SIDE_OPTIONS: Array<{ side: LabelSide; Icon: typeof ArrowUp }> = [
  { side: 'above', Icon: ArrowUp },
  { side: 'below', Icon: ArrowDown },
  { side: 'left', Icon: ArrowLeft },
  { side: 'right', Icon: ArrowRight },
];

interface JourneyMapProps {
  projectOverride?: JourneyMapProject;
  exportMode?: boolean;
  /**
   * Turns on editing: step dots can be dragged along the road and clicking one lets you pick
   * its label side. Every change is reported here; the caller owns the map data.
   */
  onPlacementChange?: (edit: MarkerPlacementEdit) => void;
  /** Forces the desktop or mobile layout instead of following the browser width. */
  layoutOverride?: 'desktop' | 'mobile';
  /** Keeps the selected persona in the page URL (?persona=) so a specific view can be shared. */
  syncPersonaToUrl?: boolean;
}

export function JourneyMap({
  projectOverride,
  exportMode = false,
  syncPersonaToUrl = false,
  onPlacementChange,
  layoutOverride,
}: JourneyMapProps = {}) {
  const editable = Boolean(onPlacementChange) && !exportMode;
  const activeProject = projectOverride ?? asuNondegreeProject;
  const activeMap = useMemo(() => normalizeMapConfig(activeProject.map), [activeProject.map]);
  const [activePersonaId, setActivePersonaId] = useState<string | null>(() => {
    if (!syncPersonaToUrl || typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get('persona');
  });
  const [journeyState, setJourneyState] = useState<JourneyState>('future');
  const [markersTransitioning, setMarkersTransitioning] = useState(false);
  const [selectedStep, setSelectedStep] = useState<SelectedStep | null>(null);
  const [showElements, setShowElements] = useState(exportMode || editable);
  const [editSelection, setEditSelection] = useState<{ state: JourneyState; index: number } | null>(null);
  const dragRef = useRef<{ state: JourneyState; index: number; startX: number; startY: number; moved: boolean } | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [currentPositions, setCurrentPositions] = useState<ComputedPoint[]>([]);
  const [futurePositions, setFuturePositions] = useState<ComputedPoint[]>([]);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [pressedDotCircle, setPressedDotCircle] = useState<number | null>(null);
  const [pressedDotLabel, setPressedDotLabel] = useState<number | null>(null);
  const [highlightedPainPoint, setHighlightedPainPoint] = useState<number | null>(null);
  const [hoveredToggle, setHoveredToggle] = useState<'current' | 'future' | null>(null);
  const [pressedToggle, setPressedToggle] = useState<'current' | 'future' | null>(null);
  const [containerWidth, setContainerWidth] = useState(BASE_WIDTH);
  const [viewportWidth, setViewportWidth] = useState(
    exportMode ? BASE_WIDTH : (typeof window !== 'undefined' ? window.innerWidth : BASE_WIDTH)
  );
  const roadRef = useRef<SVGPathElement>(null);
  const dashRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageColors = activeMap.stages.map((stage) => stage.color).filter(Boolean);
  const gradientColors = stageColors.length > 0 ? stageColors : activeMap.theme.stageColors;
  const gradientColorStops = getGradientColorStops(gradientColors, activeMap.theme.gradientTransitions);
  const stateLabels = activeMap.stateLabels ?? { current: 'Current state', future: 'Future state' };
  const currentSummaryData = activeMap.currentSummaries.map((stage) => ({
    num: stage.number,
    name: stage.name,
    color: stage.color,
    desc: stage.description,
  }));
  const personas = activeMap.futurePersonas ?? [];
  const personasEnabled = Boolean(activeMap.features.futurePersonasEnabled) && personas.length > 0;
  const activePersona = personasEnabled ? personas.find((persona) => persona.id === activePersonaId) : undefined;
  const futureMarkerConfigs = activePersona?.markers ?? activeMap.futureStateMarkers;
  const futureSummaryData = activeMap.futureSummaries.map((stage, index) => ({
    num: stage.number,
    name: stage.name,
    color: stage.color,
    desc: activePersona?.summaryOverrides?.[activeMap.stages[index]?.id ?? '']?.trim() || stage.description,
  }));
  const currentStateMarkers: CurrentStateMarker[] = activeMap.currentStateMarkers.map((marker) => ({
    desktopPct: marker.desktop.pct,
    mobilePct: marker.mobile.pct,
    label: marker.label,
    side: marker.desktop.side,
    mobileSide: marker.mobile.side,
    labelVariant: marker.labelVariant ?? 'plain',
    icon: marker.icon,
    desktopLabel: marker.desktopLabel,
    mobileLabel: marker.mobileLabel,
  }));
  const stageIdxById = new Map(activeMap.stages.map((stage, index) => [stage.id, index]));
  const stepCountsByStageId = new Map<string, number>();
  const futureStateMarkers: FutureStateMarker[] = futureMarkerConfigs.map((marker) => {
    const stageIdx = stageIdxById.get(marker.stageId) ?? 0;
    const stepIdx = stepCountsByStageId.get(marker.stageId) ?? 0;
    stepCountsByStageId.set(marker.stageId, stepIdx + 1);

    return {
      desktopPct: marker.desktop.pct,
      mobilePct: marker.mobile.pct,
      label: marker.label,
      side: marker.desktop.side,
      mobileSide: marker.mobile.side,
      labelVariant: marker.labelVariant ?? 'interactive-card',
      icon: marker.icon,
      desktopLabel: marker.desktopLabel,
      mobileLabel: marker.mobileLabel,
      beforeImage: marker.beforeImage,
      afterImage: marker.afterImage,
      stageIdx,
      stepIdx,
    };
  });

  const scaleX = containerWidth / BASE_WIDTH;
  const isMobileLayout = layoutOverride ? layoutOverride === 'mobile' : viewportWidth < MOBILE_BREAKPOINT;
  const mobilePaddingX = Math.max(28, Math.min(56, containerWidth * 0.08));
  const mobilePaddingY = 24;
  const mobileTrackHeight = MOBILE_ROAD_HEIGHT;
  const mobileMapHeight = mobileTrackHeight + mobilePaddingY * 2;
  const mobileTrackWidth = mobileTrackHeight * MOBILE_ROAD_ASPECT_RATIO;
  const mobileRoadScaleX = mobileTrackWidth / ORIGINAL_PATH_HEIGHT;
  const mobileRoadScaleY = mobileTrackHeight / BASE_WIDTH;
  const mobileRoadStartX = isMobileLayout ? (containerWidth - mobileTrackWidth) / 2 : 0;
  const labelOffset = isMobileLayout ? 44 : LABEL_OFFSET;
  const summaryGap = isMobileLayout ? 18 : 30;
  const features = {
    summaryPanelEnabled: true,
    ...activeMap.features,
  };
  const availableStates = ([
    features.currentStateEnabled ? 'current' : null,
    features.futureStateEnabled ? 'future' : null,
  ].filter(Boolean) as JourneyState[]);

  const getResponsiveSide = (defaultSide: LabelSide, index: number) => {
    if (!isMobileLayout) return defaultSide;
    return index % 2 === 0 ? 'right' : 'left';
  };

  const getFutureMobileLabelConfig = (marker: FutureStateMarker, index: number, defaultSide: LabelSide) => {
    if (!isMobileLayout) {
      return {
        side: marker.desktopLabel?.side ?? defaultSide,
        distance: marker.desktopLabel?.distance ?? LABEL_OFFSET,
        maxWidth: marker.desktopLabel?.maxWidth ?? 200,
        shiftX: marker.desktopLabel?.shiftX ?? 0,
        shiftY: marker.desktopLabel?.shiftY ?? 0,
      };
    }

    const config = marker.mobileLabel;
    return {
      side: config?.side ?? marker.mobileSide ?? getResponsiveSide(defaultSide, index),
      distance: config?.distance ?? labelOffset,
      maxWidth: config?.maxWidth ?? Math.min(260, containerWidth * 0.56),
      shiftX: config?.shiftX ?? 0,
      shiftY: config?.shiftY ?? 0,
    };
  };

  const getFutureMarkerPct = (marker: FutureStateMarker) =>
    isMobileLayout ? marker.mobilePct : marker.desktopPct;

  const getCurrentMarkerPct = (marker: CurrentStateMarker) =>
    isMobileLayout ? marker.mobilePct : marker.desktopPct;

  const getCurrentMobileSide = (marker: CurrentStateMarker, index: number, defaultSide: LabelSide) =>
    isMobileLayout ? (marker.mobileSide ?? getResponsiveSide(defaultSide, index)) : defaultSide;

  const resolveConfigImage = (image?: string) => {
    if (!image) return undefined;
    if (
      image.startsWith('http://') ||
      image.startsWith('https://') ||
      image.startsWith('/') ||
      image.startsWith('data:') ||
      image.startsWith('blob:')
    ) {
      return image;
    }
    return comparisonImageAssetsByFilename[image] ?? image;
  };

  const getMarkerPosition = (pos: ComputedPoint, index = -1, markerType: 'current' | 'future' = 'future') => {
    if (!isMobileLayout) {
      return {
        x: pos.x * scaleX,
        y: pos.y + VIEWBOX_Y_OFFSET,
      };
    }
    const baseY = mobilePaddingY + pos.x * mobileRoadScaleY;
    const topShift = index === 0 ? (pos.x * mobileRoadScaleY) * 0.25 : 0;

    return {
      x: mobileRoadStartX + (ORIGINAL_PATH_HEIGHT - (pos.y + VIEWBOX_Y_OFFSET)) * mobileRoadScaleX,
      y: baseY - topShift,
    };
  };

  const getLabelStyle = (
    x: number,
    y: number,
    side: LabelSide,
    distance = labelOffset,
    shiftX = 0,
    shiftY = 0,
  ): React.CSSProperties => (
    side === 'above' ? { left: x + shiftX, top: y - distance + shiftY, transform: 'translate(-50%, -100%)' } :
    side === 'below' ? { left: x + shiftX, top: y + distance + shiftY, transform: 'translate(-50%, 0)' } :
    side === 'left' ? { left: x - distance + shiftX, top: y + shiftY, transform: 'translate(-100%, -50%)' } :
    { left: x + distance + shiftX, top: y + shiftY, transform: 'translate(0, -50%)' }
  );

  // ── Editing: drag a step along the road and pick its label side ──
  const [isDraggingMarker, setIsDraggingMarker] = useState(false);

  // Finds the point on the road closest to the pointer, comparing in screen space so the
  // desktop and mobile mappings (including the first-step nudge) are handled exactly.
  const findNearestPct = (pointerX: number, pointerY: number, index: number) => {
    const path = roadRef.current;
    if (!path) return null;

    const total = path.getTotalLength();
    const distanceAt = (length: number) => {
      const point = path.getPointAtLength(length);
      const placed = getMarkerPosition({ x: point.x, y: point.y }, index);
      return (placed.x - pointerX) ** 2 + (placed.y - pointerY) ** 2;
    };

    const coarseSteps = 300;
    let bestLength = 0;
    let bestDistance = Infinity;
    for (let step = 0; step <= coarseSteps; step += 1) {
      const length = (total * step) / coarseSteps;
      const distance = distanceAt(length);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestLength = length;
      }
    }

    const span = total / coarseSteps;
    const from = Math.max(0, bestLength - span);
    const to = Math.min(total, bestLength + span);
    for (let step = 0; step <= 40; step += 1) {
      const length = from + ((to - from) * step) / 40;
      const distance = distanceAt(length);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestLength = length;
      }
    }

    const pct = Math.min(MAX_DRAG_PCT, Math.max(MIN_DRAG_PCT, bestLength / total));
    return Number(pct.toFixed(4));
  };

  const getEditHandlers = (state: JourneyState, index: number) => ({
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = { state, index, startX: event.clientX, startY: event.clientY, moved: false };
      setEditSelection({ state, index });
    },
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.state !== state || drag.index !== index) return;
      if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 4) return;

      drag.moved = true;
      setIsDraggingMarker(true);
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;
      const pct = findNearestPct(event.clientX - bounds.left, event.clientY - bounds.top, index);
      if (pct === null) return;
      onPlacementChange?.({
        state,
        personaId: activePersona?.id ?? null,
        index,
        layout: isMobileLayout ? 'mobile' : 'desktop',
        pct,
      });
    },
    onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      dragRef.current = null;
      setIsDraggingMarker(false);
    },
    onPointerCancel: () => {
      dragRef.current = null;
      setIsDraggingMarker(false);
    },
  });

  const handleToggle = (newState: JourneyState) => {
    if (newState === journeyState) return;
    setEditSelection(null);
    setSelectedStep(null);
    setHighlightedPainPoint(null);
    setMarkersTransitioning(true);
    setTimeout(() => {
      setJourneyState(newState);
      setMarkersTransitioning(false);
    }, 250);
  };

  const handlePersonaChange = (personaId: string | null) => {
    if (personaId === (activePersona?.id ?? null)) return;
    setEditSelection(null);
    setSelectedStep(null);
    setHoveredDot(null);
    setHighlightedPainPoint(null);
    setShowPopover(false);
    setMarkersTransitioning(true);
    setTimeout(() => {
      setActivePersonaId(personaId);
      setMarkersTransitioning(false);
    }, 250);

    if (syncPersonaToUrl && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (personaId) url.searchParams.set('persona', personaId);
      else url.searchParams.delete('persona');
      window.history.replaceState(null, '', url);
    }
  };

  // Track container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setContainerWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (exportMode) {
      setViewportWidth(BASE_WIDTH);
      return;
    }

    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);
    return () => window.removeEventListener('resize', updateViewportWidth);
  }, [exportMode]);

  useEffect(() => {
    if (availableStates.length === 0) return;
    if (!availableStates.includes(journeyState)) {
      setJourneyState(availableStates[0]);
    }
  }, [availableStates, journeyState]);

  // Compute all positions from the path using getPointAtLength
  const computePositions = () => {
    const path = roadRef.current;
    if (!path) return;

    const totalLength = path.getTotalLength();

    setCurrentPositions(
      currentStateMarkers.map(m => {
        const pt = path.getPointAtLength(totalLength * getCurrentMarkerPct(m));
        return { x: pt.x, y: pt.y };
      })
    );

    setFuturePositions(
      futureStateMarkers.map(m => {
        const pt = path.getPointAtLength(totalLength * getFutureMarkerPct(m));
        return { x: pt.x, y: pt.y };
      })
    );
  };
  const computePositionsRef = useRef(computePositions);
  computePositionsRef.current = computePositions;

  // Recompute positions whenever the layout or the visible step set changes. This runs before paint
  // so switching personas never shows markers at stale positions.
  const markerPlacementKey = JSON.stringify([
    isMobileLayout,
    currentStateMarkers.map(getCurrentMarkerPct),
    futureStateMarkers.map(getFutureMarkerPct),
  ]);
  useLayoutEffect(() => {
    computePositionsRef.current();
  }, [containerWidth, markerPlacementKey]);

  // Path draw-in animation
  useEffect(() => {
    if (exportMode || editable) {
      computePositionsRef.current();
      setShowElements(true);
      setShowPopover(false);
      return;
    }

    const road = roadRef.current;
    if (!road) return;

    computePositionsRef.current();

    const totalLength = road.getTotalLength();
    road.style.strokeDasharray = `${totalLength}`;
    road.style.strokeDashoffset = `${totalLength}`;

    if (dashRef.current) {
      dashRef.current.style.clipPath = `inset(0 100% 0 0)`;
    }

    const duration = 2500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      road.style.strokeDashoffset = `${totalLength * (1 - eased)}`;

      if (dashRef.current) {
        dashRef.current.style.clipPath = `inset(0 ${(1 - eased) * 100}% 0 0)`;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setShowElements(true);
        setShowPopover(true);
      }
    };

    const timer = setTimeout(() => requestAnimationFrame(animate), 300);
    return () => clearTimeout(timer);
  }, [exportMode, editable]);

  const markersVisible = showElements && !markersTransitioning;
  const summaryData = journeyState === 'current' ? currentSummaryData : futureSummaryData;
  const desktopGuidedTourIndex = Math.max(0, activeMap.futureStateMarkers.findIndex(marker => marker.id === activeMap.guidedTour.desktopAnchorMarkerId));
  const mobileGuidedTourIndex = Math.max(0, activeMap.futureStateMarkers.findIndex(marker => marker.id === activeMap.guidedTour.mobileAnchorMarkerId));

  const showPersonaPicker = journeyState === 'future' && features.futureStateEnabled && personasEnabled;
  const personaPicker = showPersonaPicker ? (
    <label className="flex min-w-0 items-center gap-[12px]">
      <span className={`shrink-0 text-[14px] text-[#767676] ${isMobileLayout ? '' : 'hidden xl:inline'}`}>Persona</span>
      <span className="relative block min-w-0 flex-1">
        <select
          value={activePersona?.id ?? ''}
          onChange={(event) => handlePersonaChange(event.target.value || null)}
          className="h-[52px] w-full min-w-[170px] max-w-[300px] cursor-pointer appearance-none truncate rounded-full border border-[#D0D0D0] bg-[#FAFAFA] py-[8px] pl-[20px] pr-[48px] text-[16px] text-[#191919] outline-none transition-colors duration-150 hover:bg-[#F0F0F0] focus-visible:ring-2 focus-visible:ring-[#8C1D40]"
          style={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}
          aria-label="Choose a persona"
        >
          <option value="">{activeMap.futureDefaultPersonaName?.trim() || 'Default'}</option>
          {personas.map((persona) => (
            <option key={persona.id} value={persona.id}>
              {persona.name.trim() || 'Untitled persona'}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-[18px] top-1/2 size-[18px] -translate-y-1/2 text-[#747474]" />
      </span>
    </label>
  ) : null;

  const selectedStage = selectedStep ? journeyStages[selectedStep.stageIdx] : null;
  const selectedPlatform = selectedStage?.platforms[0] || null;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ fontFamily: 'Arial, sans-serif', background: activeMap.theme.pageBackground }}>
      {/* Header */}
      <div className="bg-white border-b border-[#e8e8e8] shrink-0 relative z-30">
        <div className="flex items-center justify-between gap-[16px] px-[12px] py-[12px] md:px-[40px] md:py-[24px] lg:px-[85px]">
          <div className="flex items-center gap-[16px] min-w-0">
            <div className="h-[48px] w-[95px] relative shrink-0">
              <img alt="ASU Logo" className="absolute h-[148%] left-[-14%] top-[-24%] w-[127%] max-w-none" src={imgLogo} />
            </div>
            {!isMobileLayout && (
              <p className="leading-none text-[#191919] text-[24px] tracking-[-0.84px] whitespace-nowrap truncate" style={{ fontWeight: 'bold' }}>
                {activeMap.brand.title}
              </p>
            )}
          </div>
          <div className="flex items-center gap-[20px] shrink-0">
          {showPersonaPicker && !isMobileLayout && personaPicker}
          {/* State Toggle */}
          {availableStates.length > 1 ? (
          <div
            style={{
              background: '#FAFAFA',
              border: '1px solid #D0D0D0',
              borderRadius: 100,
              padding: 8,
              display: 'inline-flex',
              gap: 8,
              position: 'relative',
              flexShrink: 0,
            }}
          >
            {/* Sliding pill */}
            <div
              style={{
                position: 'absolute',
                top: 8,
                bottom: 8,
                left: journeyState === 'current' ? 8 : 'calc(50% + 4px)',
                width: 'calc(50% - 12px)',
                background: pressedToggle === journeyState ? '#6B1530' : hoveredToggle === journeyState ? '#7A1938' : '#8C1D40',
                borderRadius: 100,
                boxShadow: pressedToggle === journeyState ? 'none' : '0px 20px 12px rgba(0,0,0,0.01), 0px 9px 9px rgba(0,0,0,0.03), 0px 2px 5px rgba(0,0,0,0.06)',
                transform: pressedToggle === journeyState ? 'scale(0.97)' : 'scale(1)',
                transition: 'left 200ms ease, background 150ms ease, box-shadow 150ms ease, transform 100ms ease',
                pointerEvents: 'none',
              }}
            />
            {availableStates.map((state) => {
              const isActive = journeyState === state;
              const isHovered = hoveredToggle === state;
              const isPressed = pressedToggle === state;
              return (
                <button
                  key={state}
                  onClick={() => handleToggle(state)}
                  onMouseEnter={() => setHoveredToggle(state)}
                  onMouseLeave={() => { setHoveredToggle(null); setPressedToggle(null); }}
                  onMouseDown={() => setPressedToggle(state)}
                  onMouseUp={() => setPressedToggle(null)}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: isMobileLayout ? '8px 8px' : '8px 16px',
                    background: !isActive
                      ? isPressed ? 'rgba(0,0,0,0.10)' : isHovered ? 'rgba(0,0,0,0.06)' : 'transparent'
                      : 'transparent',
                    border: 'none',
                    borderRadius: 100,
                    color: isActive ? '#FAFAFA' : '#747474',
                    fontWeight: 'bold',
                    fontSize: 16,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontFamily: 'Arial, sans-serif',
                    transition: 'background 150ms ease, color 200ms ease',
                  }}
                >
                  {state === 'current' ? stateLabels.current : stateLabels.future}
                </button>
              );
            })}
          </div>
          ) : (
            <div className="rounded-full border border-[#D0D0D0] bg-[#FAFAFA] px-[18px] py-[12px] text-[16px] text-[#191919]" style={{ fontWeight: 'bold' }}>
              {availableStates[0] === 'current' ? stateLabels.current : stateLabels.future}
            </div>
          )}
          </div>
        </div>
        {showPersonaPicker && isMobileLayout && (
          <div className="border-t border-[#e8e8e8] px-[12px] py-[12px]">{personaPicker}</div>
        )}
      </div>

      {/* Map + Summary */}
      <div
        className="flex flex-col items-center pb-[80px] pt-0 relative z-10"
        style={{ marginTop: isMobileLayout ? 0 : -14 }}
      >
        {/* Map Grid */}
        <div className="w-full max-w-[1200px] px-[24px]">
        <div
          ref={containerRef}
          className="relative w-full transition-[height] duration-300 ease-out"
          style={{ height: isMobileLayout ? mobileMapHeight : DESKTOP_MAP_HEIGHT, marginTop: 0, overflow: 'visible', ...(editable ? { userSelect: 'none', WebkitUserSelect: 'none' } : {}) }}
          onPointerDown={editable ? () => setEditSelection(null) : undefined}
        >
          {/* SVG for road only */}
          <svg
            className="absolute inset-0 w-full"
            viewBox={isMobileLayout ? `0 0 ${containerWidth} ${mobileMapHeight}` : `0 -10 ${containerWidth} ${DESKTOP_MAP_HEIGHT}`}
            preserveAspectRatio="none"
            fill="none"
            style={{ overflow: 'visible', height: isMobileLayout ? mobileMapHeight : DESKTOP_MAP_HEIGHT }}
          >
            <defs>
              <linearGradient id="pathGradient" gradientUnits="userSpaceOnUse" x1="110" x2="1347" y1="297.5" y2="297.5">
                {gradientColorStops.map((stop, index) => (
                  <stop
                    key={`${stop.color}-${stop.offset}-${index}`}
                    stopColor={stop.color}
                    offset={stop.offset}
                  />
                ))}
              </linearGradient>
            </defs>

            {/* Thick colored road */}
            {isMobileLayout ? (
              <g transform={`translate(${mobileRoadStartX}, ${mobilePaddingY})`}>
                <g transform={`scale(${mobileRoadScaleX}, ${mobileRoadScaleY})`}>
                  <g transform={`matrix(0 1 -1 0 ${ORIGINAL_PATH_HEIGHT} 0)`}>
                    <path
                      ref={roadRef}
                      d={ROAD_PATH}
                      stroke="url(#pathGradient)"
                      strokeWidth={activeMap.theme.pathStrokeWidth}
                      strokeLinecap="butt"
                      strokeLinejoin="round"
                      fill="none"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      ref={dashRef}
                      d={ROAD_PATH}
                      stroke="black"
                      strokeDasharray="12 12"
                      strokeLinecap="butt"
                      strokeOpacity="0.25"
                      strokeWidth={activeMap.theme.centerlineStrokeWidth}
                      fill="none"
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                </g>
              </g>
            ) : (
              <g transform={`scale(${scaleX}, 1)`}>
                <path
                  ref={roadRef}
                  d={ROAD_PATH}
                  stroke="url(#pathGradient)"
                  strokeWidth={activeMap.theme.pathStrokeWidth}
                  strokeLinecap="butt"
                  strokeLinejoin="round"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  ref={dashRef}
                  d={ROAD_PATH}
                  stroke="black"
                  strokeDasharray="12 12"
                  strokeLinecap="butt"
                  strokeOpacity="0.25"
                  strokeWidth={activeMap.theme.centerlineStrokeWidth}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            )}
          </svg>

          {/* HTML overlay — pixel-positioned, never scaled */}

          {/* ── Current state: Pain point markers ── */}
          {currentPositions.map((pos, i) => {
            const marker = currentStateMarkers[i];
            if (!marker) return null;
            const { x: pixelX, y: pixelY } = getMarkerPosition(pos, i, 'current');
            const side = getCurrentMobileSide(marker, i, marker.side);
            const labelStyle = getLabelStyle(pixelX, pixelY, side);
            const showCardLabel = marker.labelVariant !== 'plain';
            return (
              <div
                key={`pp-${i}`}
                style={{
                  opacity: journeyState === 'current' && features.currentStateEnabled ? (markersVisible ? 1 : 0) : 0,
                  transition: 'opacity 0.25s ease',
                  pointerEvents: 'none',
                }}
              >
                {editable && journeyState === 'current' && (
                  <div
                    className="absolute rounded-full"
                    style={{
                      left: pixelX - (isMobileLayout ? 30 : 34),
                      top: pixelY - (isMobileLayout ? 30 : 34),
                      width: isMobileLayout ? 60 : 68,
                      height: isMobileLayout ? 60 : 68,
                      pointerEvents: 'auto',
                      cursor: isDraggingMarker ? 'grabbing' : 'grab',
                      touchAction: 'none',
                      background: editSelection?.state === 'current' && editSelection.index === i ? 'rgba(140,29,64,0.08)' : 'transparent',
                    }}
                    {...getEditHandlers('current', i)}
                  />
                )}
                {/* Marker icon / dot */}
                {marker.icon === 'email' ? (
                  <img
                    src={emailIcon}
                    alt=""
                    className="absolute"
                    style={{
                      left: pixelX - (isMobileLayout ? 20 : 23),
                      top: pixelY - (isMobileLayout ? 20 : 23),
                      width: isMobileLayout ? 40 : 46,
                      height: isMobileLayout ? 40 : 46,
                      pointerEvents: 'none',
                    }}
                  />
                ) : marker.icon === 'warning' ? (
                  <img
                    src={warningIcon}
                    alt=""
                    className="absolute"
                    style={{
                      left: pixelX - (isMobileLayout ? 22 : 25),
                      top: pixelY - (isMobileLayout ? 20 : 22),
                      width: isMobileLayout ? 44 : 50,
                      height: isMobileLayout ? 40 : 45,
                      pointerEvents: 'none',
                    }}
                  />
                ) : (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: pixelX - (isMobileLayout ? 8 : 9),
                      top: pixelY - (isMobileLayout ? 8 : 9),
                      width: isMobileLayout ? 16 : 18,
                      height: isMobileLayout ? 16 : 18,
                      borderRadius: '50%',
                      background: '#191919',
                      border: '3px solid white',
                    }}
                  />
                )}
                {/* Label */}
                <div
                  className="absolute"
                  style={labelStyle}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      minWidth: isMobileLayout ? 0 : 150,
                      maxWidth: isMobileLayout ? Math.min(280, containerWidth * 0.66) : 180,
                      fontFamily: 'Arial, sans-serif',
                      fontSize: 16,
                      color: '#191919',
                      textAlign: 'center',
                      lineHeight: 1.35,
                      padding: isMobileLayout ? '12px' : '12px 10px',
                      borderRadius: showCardLabel ? 6 : 0,
                      background: showCardLabel ? 'rgba(255,255,255,0.8)' : 'transparent',
                      border: showCardLabel ? '1px solid rgba(0,0,0,0.1)' : '1px solid transparent',
                      backdropFilter: showCardLabel ? 'blur(16px)' : undefined,
                      WebkitBackdropFilter: showCardLabel ? 'blur(16px)' : undefined,
                      boxShadow: showCardLabel ? '0px 2px 8px rgba(0,0,0,0.1)' : 'none',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {marker.label}
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── Future state: Step dots + labels ── */}
          {futurePositions.map((pos, i) => {
            const marker = futureStateMarkers[i];
            if (!marker) return null;
            const lines = marker.label.split('\n');
            const isHovered = hoveredDot === i;
            const isCirclePressed = pressedDotCircle === i;
            const isLabelPressed = pressedDotLabel === i;
            const { x: pixelX, y: pixelY } = getMarkerPosition(pos, i, 'future');
            const guidedTourDotIndex = isMobileLayout ? mobileGuidedTourIndex : desktopGuidedTourIndex;
            const isGuidedTourDot = !activePersona && i === guidedTourDotIndex;
            const showActiveFutureStyle = isMobileLayout || isHovered;

            const mobileLabelConfig = getFutureMobileLabelConfig(marker, i, marker.side);
            const side = mobileLabelConfig.side;
            const labelStyle = getLabelStyle(
              pixelX,
              pixelY,
              side,
              mobileLabelConfig.distance,
              mobileLabelConfig.shiftX,
              mobileLabelConfig.shiftY,
            );

            return (
              <div
                key={`future-${activePersona?.id ?? 'default'}-${i}`}
                style={{
                  opacity: journeyState === 'future' && features.futureStateEnabled ? (markersVisible ? 1 : 0) : 0,
                  transition: 'opacity 0.25s ease',
                  pointerEvents: journeyState === 'future' && features.futureStateEnabled ? 'auto' : 'none',
                }}
              >
                {/* Pulse ring on first dot while popover is visible */}
                {features.guidedTourEnabled && activeMap.guidedTour.enabled && isGuidedTourDot && showPopover && journeyState === 'future' && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: pixelX - 24,
                      top: pixelY - 24,
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      border: '2px solid #999',
                      animation: 'dotPulse 2s ease-out infinite',
                    }}
                  />
                )}
                {/* Invisible hit area */}
                <div
                  className="absolute cursor-pointer rounded-full"
                  style={{
                    left: pixelX - (isMobileLayout ? 34 : 40),
                    top: pixelY - (isMobileLayout ? 34 : 40),
                    width: isMobileLayout ? 68 : 80,
                    height: isMobileLayout ? 68 : 80,
                    background: editable && editSelection?.state === 'future' && editSelection.index === i
                      ? 'rgba(140,29,64,0.08)'
                      : isHovered ? 'rgba(0,0,0,0.05)' : 'transparent',
                    transition: 'background 0.2s ease',
                    ...(editable ? { cursor: isDraggingMarker ? 'grabbing' : 'grab', touchAction: 'none' } : {}),
                  }}
                  {...(editable ? getEditHandlers('future', i) : {})}
                  onClick={() => {
                    if (!features.comparisonModalEnabled || editable) return;
                    setSelectedStep({
                      stageIdx: marker.stageIdx,
                      stepIdx: marker.stepIdx,
                      label: marker.label.split('\n').join(' '),
                      markerIndex: i,
                      beforeImg: resolveConfigImage(marker.beforeImage),
                      afterImg: resolveConfigImage(marker.afterImage),
                    });
                  }}
                  onMouseEnter={() => setHoveredDot(i)}
                  onMouseLeave={() => { setHoveredDot(null); setPressedDotCircle(null); }}
                  onMouseDown={() => setPressedDotCircle(i)}
                  onMouseUp={() => setPressedDotCircle(null)}
                />
                {/* Dot / Icon */}
                {marker.icon === 'email' ? (
                  <img
                    src={emailIcon}
                    alt="Email"
                    className="absolute pointer-events-none"
                    style={{
                      left: pixelX - (isMobileLayout ? 20 : 23),
                      top: pixelY - (isMobileLayout ? 20 : 23),
                      width: isMobileLayout ? 40 : 46,
                      height: isMobileLayout ? 40 : 46,
                      transform: isCirclePressed ? 'scale(0.9)' : isHovered ? 'scale(1.4)' : 'scale(1)',
                      filter: showActiveFutureStyle && !isCirclePressed ? 'drop-shadow(0 3px 8px rgba(0,0,0,0.4))' : 'none',
                      transition: 'transform 0.2s ease, filter 0.2s ease',
                    }}
                  />
                ) : marker.icon === 'warning' ? (
                  <img
                    src={warningIcon}
                    alt="Warning"
                    className="absolute pointer-events-none"
                    style={{
                      left: pixelX - (isMobileLayout ? 22 : 25),
                      top: pixelY - (isMobileLayout ? 20 : 22),
                      width: isMobileLayout ? 44 : 50,
                      height: isMobileLayout ? 40 : 45,
                      transform: isCirclePressed ? 'scale(0.9)' : isHovered ? 'scale(1.08)' : 'scale(1)',
                      filter: showActiveFutureStyle && !isCirclePressed ? 'drop-shadow(0 3px 8px rgba(0,0,0,0.35))' : 'none',
                      transition: 'transform 0.2s ease, filter 0.2s ease',
                    }}
                  />
                ) : (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: pixelX - (isMobileLayout ? 8 : 9),
                      top: pixelY - (isMobileLayout ? 8 : 9),
                      width: isMobileLayout ? 16 : 18,
                      height: isMobileLayout ? 16 : 18,
                      borderRadius: '50%',
                      background: '#191919',
                      border: '3px solid white',
                      transform: isCirclePressed ? 'scale(0.9)' : isHovered ? 'scale(1.5)' : 'scale(1)',
                      boxShadow: showActiveFutureStyle && !isCirclePressed ? '0 3px 12px rgba(0,0,0,0.45)' : 'none',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  />
                )}
                {/* Label */}
                <div
                  className="absolute"
                  style={{ ...labelStyle, pointerEvents: 'none' }}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      fontFamily: 'Arial, sans-serif',
                      fontSize: 16,
                      color: '#191919',
                      textAlign: 'center',
                      lineHeight: 1.35,
                      padding: isMobileLayout ? '12px' : '12px 10px',
                      borderRadius: 6,
                      background: marker.labelVariant === 'card'
                        ? 'rgba(255,255,255,0.8)'
                        : marker.labelVariant === 'interactive-card'
                          ? showActiveFutureStyle ? 'rgba(255,255,255,0.8)' : 'transparent'
                          : 'transparent',
                      border: marker.labelVariant === 'plain'
                        ? '1px solid transparent'
                        : marker.labelVariant === 'card'
                          ? '1px solid rgba(0,0,0,0.1)'
                          : showActiveFutureStyle ? '1px solid rgba(0,0,0,0.1)' : '1px solid transparent',
                      backdropFilter: marker.labelVariant === 'plain'
                        ? undefined
                        : marker.labelVariant === 'card' || showActiveFutureStyle ? 'blur(16px)' : undefined,
                      WebkitBackdropFilter: marker.labelVariant === 'plain'
                        ? undefined
                        : marker.labelVariant === 'card' || showActiveFutureStyle ? 'blur(16px)' : undefined,
                      boxShadow: marker.labelVariant === 'plain'
                        ? 'none'
                        : marker.labelVariant === 'card' || showActiveFutureStyle ? '0px 2px 8px rgba(0,0,0,0.1)' : 'none',
                      transform: isLabelPressed ? 'scale(0.95)' : 'scale(1)',
                      transition: 'background 0.2s ease, border 0.2s ease, box-shadow 0.2s ease',
                      whiteSpace: 'pre-line',
                      maxWidth: isMobileLayout ? mobileLabelConfig.maxWidth : 200,
                      pointerEvents: journeyState === 'future' && !editable ? 'auto' : 'none',
                      cursor: journeyState === 'future' ? 'pointer' : 'default',
                    }}
                    onClick={() => {
                      if (!features.comparisonModalEnabled || editable) return;
                      setSelectedStep({
                        stageIdx: marker.stageIdx,
                        stepIdx: marker.stepIdx,
                        label: marker.label.split('\n').join(' '),
                        markerIndex: i,
                        beforeImg: resolveConfigImage(marker.beforeImage),
                        afterImg: resolveConfigImage(marker.afterImage),
                      });
                    }}
                    onMouseEnter={() => setHoveredDot(i)}
                    onMouseLeave={() => { setHoveredDot(null); setPressedDotLabel(null); }}
                    onMouseDown={() => setPressedDotLabel(i)}
                    onMouseUp={() => setPressedDotLabel(null)}
                  >
                    {lines.join('\n')}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Edit mode: selection ring and label side picker */}
          {editable && editSelection && editSelection.state === journeyState && (() => {
            const isCurrent = journeyState === 'current';
            const pos = (isCurrent ? currentPositions : futurePositions)[editSelection.index];
            const marker = isCurrent ? currentStateMarkers[editSelection.index] : futureStateMarkers[editSelection.index];
            if (!pos || !marker) return null;

            const { x, y } = getMarkerPosition(pos, editSelection.index, journeyState);
            const activeSide = isCurrent
              ? getCurrentMobileSide(currentStateMarkers[editSelection.index], editSelection.index, marker.side)
              : getFutureMobileLabelConfig(futureStateMarkers[editSelection.index], editSelection.index, marker.side).side;
            const pct = isCurrent
              ? getCurrentMarkerPct(currentStateMarkers[editSelection.index])
              : getFutureMarkerPct(futureStateMarkers[editSelection.index]);
            const showBelow = activeSide === 'above' || y < 110;
            const popoverLeft = Math.min(Math.max(x, 120), Math.max(120, containerWidth - 120));

            return (
              <>
                <div
                  className="pointer-events-none absolute rounded-full"
                  style={{ left: x - 26, top: y - 26, width: 52, height: 52, border: '2px dashed #8C1D40', zIndex: 44 }}
                />
                {!isDraggingMarker && (
                  <div
                    className="absolute rounded-[12px] border border-black/10 bg-white p-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
                    style={{
                      left: popoverLeft,
                      top: showBelow ? y + 38 : y - 38,
                      transform: showBelow ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
                      zIndex: 45,
                      fontFamily: 'Arial, sans-serif',
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    <p className="mb-[8px] text-center text-[12px] text-[#767676]">
                      Label side · {Math.round(pct * 100)}% along road
                    </p>
                    <div className="flex gap-[6px]">
                      {SIDE_OPTIONS.map(({ side, Icon }) => (
                        <button
                          key={side}
                          type="button"
                          aria-label={`Label ${side}`}
                          title={`Label ${side}`}
                          onClick={() =>
                            onPlacementChange?.({
                              state: journeyState,
                              personaId: activePersona?.id ?? null,
                              index: editSelection.index,
                              layout: isMobileLayout ? 'mobile' : 'desktop',
                              side,
                            })
                          }
                          className="inline-flex size-[34px] cursor-pointer items-center justify-center rounded-full border transition-colors"
                          style={{
                            background: activeSide === side ? '#8C1D40' : '#FAFAFA',
                            color: activeSide === side ? '#FFFFFF' : '#191919',
                            borderColor: activeSide === side ? '#8C1D40' : 'rgba(0,0,0,0.12)',
                          }}
                        >
                          <Icon className="size-[16px]" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {/* Guided Tour Popover — only in Future state, anchored to the guided-tour dot */}
          {features.guidedTourEnabled && activeMap.guidedTour.enabled && !activePersona && futurePositions.length > (isMobileLayout ? mobileGuidedTourIndex : desktopGuidedTourIndex) && journeyState === 'future' && (
            <GuidedTourPopover
              visible={showPopover}
              onDismiss={() => setShowPopover(false)}
              anchorX={getMarkerPosition(futurePositions[isMobileLayout ? mobileGuidedTourIndex : desktopGuidedTourIndex], isMobileLayout ? mobileGuidedTourIndex : desktopGuidedTourIndex, 'future').x}
              anchorY={getMarkerPosition(futurePositions[isMobileLayout ? mobileGuidedTourIndex : desktopGuidedTourIndex], isMobileLayout ? mobileGuidedTourIndex : desktopGuidedTourIndex, 'future').y}
              placement={isMobileLayout ? 'below' : 'above'}
              compact={isMobileLayout}
              title={activeMap.guidedTour.title}
              body={activeMap.guidedTour.body}
            />
          )}
        </div>
        </div>

        {/* Summary Section */}
        {features.summaryPanelEnabled && (
          <div
            className="w-full max-w-[1200px] px-[24px] relative z-10"
            style={{
              opacity: showElements ? (markersTransitioning ? 0 : 1) : 0,
              transform: showElements ? 'translateY(0)' : 'translateY(20px)',
              transition: markersTransitioning
                ? 'opacity 0.25s ease'
                : 'opacity 0.25s ease, transform 0.6s ease 0.2s',
            }}
          >
            <div className="bg-white/80 backdrop-blur-[25px] rounded-[12px] border border-black/10 shadow-[0px_10px_22px_0px_rgba(0,0,0,0.05),0px_40px_40px_0px_rgba(0,0,0,0.04)]">
              <div
                className={`grid p-[24px] md:p-[32px] ${isMobileLayout ? 'grid-cols-1' : ''}`}
                style={{
                  gap: summaryGap,
                  ...(isMobileLayout ? {} : { gridTemplateColumns: `repeat(${Math.max(summaryData.length, 1)}, minmax(0, 1fr))` }),
                }}
              >
                {summaryData.map((stage) => (
                  <div key={stage.num} className="min-w-0 flex flex-col gap-[16px]">
                    <div className="flex flex-col gap-[4px]">
                      <p className="text-[40px] tracking-[-1.4px] leading-none" style={{ color: stage.color, fontWeight: 'bold' }}>{stage.num}</p>
                      <p className="text-[24px] text-black tracking-[-0.84px] leading-[1.1]" style={{ fontWeight: 'bold' }}>{stage.name}</p>
                    </div>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full" style={{ backgroundColor: stage.color }} />
                      <p className="pl-[16px] text-[16px] text-[#191919] opacity-60 leading-[1.4]">{stage.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Platform Modal */}
      <AnimatePresence>
        {features.comparisonModalEnabled && selectedStep && selectedPlatform && selectedStage && (
          <PlatformModal
            platform={selectedPlatform}
            stageColor={stageColors[selectedStep.stageIdx]}
            stepLabel={selectedStep.label}
            stageName={selectedStage.title}
            beforeLabel={stateLabels.current}
            afterLabel={stateLabels.future}
            onClose={() => setSelectedStep(null)}
            beforeImg={selectedStep.beforeImg}
            afterImg={selectedStep.afterImg}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
