export type JourneyState = 'current' | 'future';
export type LabelSide = 'above' | 'below' | 'left' | 'right';
export type MemberRole = 'owner' | 'editor' | 'viewer';
export type MarkerIcon = 'warning' | 'email';
export type MarkerLabelVariant = 'plain' | 'card' | 'interactive-card';

export interface BuilderBrandConfig {
  title: string;
  logoAsset: string;
  faviconAsset?: string;
  pageBackground: string;
}

export interface BuilderThemeConfig {
  pageBackground: string;
  panelBackground: string;
  pathStrokeWidth: number;
  centerlineStrokeWidth: number;
  stageColors: string[];
}

export interface JourneyStageSummaryConfig {
  number: string;
  name: string;
  color: string;
  description: string;
}

export interface JourneyStageConfig {
  id: string;
  number: string;
  title: string;
  color: string;
  description: string;
  currentSummary: string;
  futureSummary: string;
}

export interface JourneyMarkerPlacement {
  pct: number;
  side: LabelSide;
}

export interface JourneyMarkerLabelConfig {
  side?: LabelSide;
  distance?: number;
  maxWidth?: number;
  shiftX?: number;
  shiftY?: number;
}

export interface JourneyMarkerConfig {
  id: string;
  label: string;
  modalTitle?: string;
  icon?: MarkerIcon;
  labelVariant?: MarkerLabelVariant;
  desktop: JourneyMarkerPlacement;
  mobile: JourneyMarkerPlacement;
  desktopLabel?: JourneyMarkerLabelConfig;
  mobileLabel?: JourneyMarkerLabelConfig;
}

export interface CurrentStateMarkerConfig extends JourneyMarkerConfig {}

export interface FutureStateMarkerConfig extends JourneyMarkerConfig {
  stageId: string;
  beforeImage?: string;
  afterImage?: string;
}

export const MAX_FUTURE_PERSONAS = 10;

/**
 * An alternate version of the future state for a specific persona. It has its own
 * steps (and therefore its own images) but shares the map's stages and road.
 */
export interface FuturePersonaConfig {
  id: string;
  name: string;
  markers: FutureStateMarkerConfig[];
  /** Per-stage summary copy that replaces the default future summary, keyed by stage id. */
  summaryOverrides?: Record<string, string>;
}

export interface GuidedTourConfig {
  enabled: boolean;
  title: string;
  body: string;
  desktopAnchorMarkerId: string;
  mobileAnchorMarkerId: string;
}

export interface JourneyMapFeaturesConfig {
  currentStateEnabled: boolean;
  futureStateEnabled: boolean;
  comparisonModalEnabled: boolean;
  guidedTourEnabled: boolean;
  summaryPanelEnabled: boolean;
  /** Shows a persona dropdown on the future state. Persona data is kept when this is off. */
  futurePersonasEnabled?: boolean;
}

export interface JourneyMapStateLabelsConfig {
  current: string;
  future: string;
}

export interface JourneyMapPublishingConfig {
  siteSlug: string;
  customDomain?: string;
  lastPublishedAt?: string;
}

export interface JourneyMapConfig {
  id: string;
  slug: string;
  title: string;
  brand: BuilderBrandConfig;
  theme: BuilderThemeConfig;
  stateLabels: JourneyMapStateLabelsConfig;
  publishing: JourneyMapPublishingConfig;
  features: JourneyMapFeaturesConfig;
  stages: JourneyStageConfig[];
  currentSummaries: JourneyStageSummaryConfig[];
  futureSummaries: JourneyStageSummaryConfig[];
  currentStateMarkers: CurrentStateMarkerConfig[];
  futureStateMarkers: FutureStateMarkerConfig[];
  /** Label for the base future state in the persona dropdown. */
  futureDefaultPersonaName?: string;
  futurePersonas?: FuturePersonaConfig[];
  guidedTour: GuidedTourConfig;
}

export interface JourneyMapProject {
  map: JourneyMapConfig;
}
