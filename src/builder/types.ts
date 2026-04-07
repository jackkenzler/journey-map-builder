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
  guidedTour: GuidedTourConfig;
}

export interface OrganizationConfig {
  id: string;
  slug: string;
  name: string;
}

export interface JourneyMapProject {
  organization: OrganizationConfig;
  map: JourneyMapConfig;
}
