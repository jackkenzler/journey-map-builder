import { SignedIn } from '@clerk/clerk-react';
import { PenSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getJourneyMapProject, getJourneyMapProjectBySlug, getPublishedJourneyMapBySiteSlug } from '../../../builder/repository';
import type { JourneyMapProject } from '../../../builder/types';
import { JourneyMap } from '../JourneyMap';

function FloatingBuilderButton({
  href,
}: {
  href: string;
}) {
  return (
    <SignedIn>
      <div className="pointer-events-none fixed left-1/2 top-[18px] z-50 -translate-x-1/2">
        <Link
          to={href}
          className="pointer-events-auto inline-flex items-center gap-[8px] rounded-full border border-black/10 bg-white px-[16px] py-[10px] text-[14px] text-[#191919] shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-150 hover:bg-[#f3f3f3] active:scale-[0.98] cursor-pointer"
          style={{ fontWeight: 'bold' }}
        >
          <PenSquare className="size-[16px]" />
          Back to builder editor
        </Link>
      </div>
    </SignedIn>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] px-[24px] py-[48px]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="mx-auto max-w-[900px] rounded-[16px] border border-black/10 bg-white p-[24px]">
        <p className="text-[18px] text-[#5f5f5f]">{label}</p>
      </div>
    </div>
  );
}

function MissingState({ title, body, showBuilderLink = true }: { title: string; body: string; showBuilderLink?: boolean }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] px-[24px] py-[48px]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="mx-auto max-w-[900px] rounded-[16px] border border-black/10 bg-white p-[24px]">
        <p className="mb-[8px] text-[24px] text-[#191919]" style={{ fontWeight: 'bold' }}>
          {title}
        </p>
        <p className="mb-[16px] text-[16px] leading-[1.5] text-[#5f5f5f]">{body}</p>
        {showBuilderLink ? (
          <Link to="/app" className="text-[14px] text-[#8C1D40]" style={{ fontWeight: 'bold' }}>
            Back to builder home
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function JourneyMapPreviewPage() {
  const { orgSlug, mapSlug = '' } = useParams();
  const [project, setProject] = useState<JourneyMapProject | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setProject(undefined);
    setError(null);

    const load = orgSlug ? getJourneyMapProject(orgSlug, mapSlug) : getJourneyMapProjectBySlug(mapSlug);
    load
      .then((result) => {
        if (!cancelled) setProject(result);
      })
      .catch((loadError: Error) => {
        if (cancelled) return;
        setError(loadError.message);
        setProject(null);
      });

    return () => {
      cancelled = true;
    };
  }, [orgSlug, mapSlug]);

  if (project === undefined) {
    return <LoadingState label="Loading preview map..." />;
  }

  if (!project) {
    return (
      <MissingState
        title="Preview not found"
        body={
          error ??
          'Previews show your saved draft, so they are only available while signed in to the builder. Share the published link to show this map to others.'
        }
      />
    );
  }

  return (
    <>
      <FloatingBuilderButton href={`/app/maps/${project.map.slug}`} />
      <JourneyMap projectOverride={project} syncPersonaToUrl />
    </>
  );
}

export function PublishedJourneyMapPage() {
  const { siteSlug = '' } = useParams();
  const [project, setProject] = useState<JourneyMapProject | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setProject(undefined);
    setError(null);

    getPublishedJourneyMapBySiteSlug(siteSlug)
      .then((result) => {
        if (!cancelled) setProject(result);
      })
      .catch((loadError: Error) => {
        if (cancelled) return;
        setError(loadError.message);
        setProject(null);
      });

    return () => {
      cancelled = true;
    };
  }, [siteSlug]);

  if (project === undefined) {
    return <LoadingState label="Loading published map..." />;
  }

  if (!project) {
    return (
      <MissingState
        title="Published map not found"
        body={error ?? 'This published journey map link does not exist, or it has not been published yet.'}
        showBuilderLink={false}
      />
    );
  }

  return <JourneyMap projectOverride={project} syncPersonaToUrl />;
}
