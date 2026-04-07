import type { JourneyMapConfig, MemberRole } from './types';

export interface BuilderOrganizationRecord {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BuilderOrganizationMemberRecord {
  id: string;
  organizationId: string;
  clerkUserId: string;
  role: MemberRole;
  createdAt: string;
}

export interface BuilderJourneyMapRecord {
  id: string;
  organizationId: string;
  slug: string;
  title: string;
  description?: string | null;
  status: 'draft' | 'published' | 'archived';
  currentVersionId?: string | null;
  publishedVersionId?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BuilderJourneyMapVersionRecord {
  id: string;
  journeyMapId: string;
  versionNumber: number;
  configJson: JourneyMapConfig;
  changeNote?: string | null;
  createdBy?: string | null;
  createdAt: string;
}

export interface BuilderAssetRecord {
  id: string;
  organizationId: string;
  journeyMapId?: string | null;
  kind: 'logo' | 'favicon' | 'comparison-before' | 'comparison-after' | 'icon' | 'other';
  filePath: string;
  fileName: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
  metadataJson: Record<string, unknown>;
  createdBy?: string | null;
  createdAt: string;
}

export interface BuilderPublishedSiteRecord {
  id: string;
  organizationId: string;
  journeyMapId: string;
  journeyMapVersionId: string;
  publishedUrl?: string | null;
  publishedAt: string;
  publishedBy?: string | null;
}
