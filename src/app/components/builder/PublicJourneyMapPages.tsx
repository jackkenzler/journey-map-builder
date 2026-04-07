import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { loadPublishedJourneyMap } from '../../../builder/draftStorage';
import { getJourneyMapProject } from '../../../builder/repository';
import type { JourneyMapProject } from '../../../builder/types';
import { JourneyMap } from '../JourneyMap';

function LoadingState({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] px-[24px] py-[48px]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="mx-auto max-w-[900px] rounded-[16px] border border-black/10 bg-white p-[24px]">
        <p className="text-[18px] text-[#5f5f5f]">{label}</p>
      </div>
    </div>
  );
}

function MissingState({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] px-[24px] py-[48px]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="mx-auto max-w-[900px] rounded-[16px] border border-black/10 bg-white p-[24px]">
        <p className="mb-[8px] text-[24px] text-[#191919]" style={{ fontWeight: 'bold' }}>
          {title}
        </p>
        <p className="mb-[16px] text-[16px] leading-[1.5] text-[#5f5f5f]">{body}</p>
        <Link to="/app" className="text-[14px] text-[#8C1D40]" style={{ fontWeight: 'bold' }}>
          Back to builder home
        </Link>
      </div>
    </div>
  );
}

export function JourneyMapPreviewPage() {
  const { orgSlug = '', mapSlug = '' } = useParams();
  const [project, setProject] = useState<JourneyMapProject | null | undefined>(undefined);

  useEffect(() => {
    getJourneyMapProject(orgSlug, mapSlug).then(setProject);
  }, [orgSlug, mapSlug]);

  if (project === undefined) {
    return <LoadingState label="Loading preview map..." />;
  }

  if (!project) {
    return <MissingState title="Preview not found" body="This journey map preview does not exist yet." />;
  }

  return <JourneyMap projectOverride={project} />;
}

export function PublishedJourneyMapPage() {
  const { orgSlug = '', siteSlug = '' } = useParams();
  const [project, setProject] = useState<JourneyMapProject | null | undefined>(undefined);

  useEffect(() => {
    const published = loadPublishedJourneyMap(orgSlug, siteSlug);
    setProject(published?.project ?? null);
  }, [orgSlug, siteSlug]);

  if (project === undefined) {
    return <LoadingState label="Loading published map..." />;
  }

  if (!project) {
    return <MissingState title="Published map not found" body="This published journey map URL does not exist yet." />;
  }

  return <JourneyMap projectOverride={project} />;
}
