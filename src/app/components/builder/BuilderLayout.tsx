import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignIn, UserButton, useUser } from '@clerk/clerk-react';
import { Link, Outlet } from 'react-router';
import { getBuilderRole } from '../../../builder/access';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ClerkSetupNotice() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] px-[24px] py-[48px]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="mx-auto max-w-[820px] rounded-[20px] border border-black/10 bg-white p-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <p className="mb-[8px] text-[14px] uppercase tracking-[0.08em] text-[#8C1D40]">Builder Auth Setup</p>
        <h1 className="mb-[12px] text-[36px] leading-[1.05] tracking-[-1.2px] text-[#191919]" style={{ fontWeight: 'bold' }}>
          Add Clerk to activate the builder
        </h1>
        <div className="grid gap-[12px] text-[17px] leading-[1.6] text-[#5f5f5f]">
          <p>The builder routes are now auth-ready, but this project still needs a Clerk publishable key before sign-in can run.</p>
          <p>Add the following to your local env and Vercel project envs:</p>
        </div>

        <div className="mt-[20px] rounded-[16px] bg-[#FAFAFA] p-[18px] font-mono text-[15px] text-[#191919]">
          VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
        </div>

        <div className="mt-[20px] grid gap-[10px] text-[16px] leading-[1.6] text-[#5f5f5f]">
          <p>Recommended next platform setup:</p>
          <p>1. Create a Clerk app.</p>
          <p>2. Configure sign-in for your users.</p>
          <p>3. Add the publishable key locally and in Vercel.</p>
          <p>4. Later we’ll add server-side persistence with Supabase for maps, versions, and assets.</p>
        </div>

        <div className="mt-[24px] flex gap-[12px]">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-black/10 bg-[#FAFAFA] px-[16px] py-[10px] text-[14px] text-[#191919] transition-all duration-150 hover:bg-[#f0f0f0] active:scale-[0.98] cursor-pointer"
            style={{ fontWeight: 'bold' }}
          >
            Open preview map
          </Link>
        </div>
      </div>
    </div>
  );
}

function BuilderAuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 18% 18%, rgba(140,29,64,0.08), transparent 26%), radial-gradient(circle at 82% 24%, rgba(0,163,224,0.08), transparent 24%), linear-gradient(180deg, #FAFAFA 0%, #F4F4F1 100%)',
        }}
      />

      <div className="absolute inset-x-[-6%] top-[-6%] h-[112%] opacity-[0.9]">
        <svg
          viewBox="0 0 1440 960"
          className="h-full w-full"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="auth-road-gradient" x1="120" y1="460" x2="1280" y2="460" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#78BE20" />
              <stop offset="24%" stopColor="#00A3E0" />
              <stop offset="56%" stopColor="#FF7F32" />
              <stop offset="78%" stopColor="#E74973" />
              <stop offset="100%" stopColor="#FFC627" />
            </linearGradient>
            <filter id="auth-road-blur" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>

          <path
            d="M-80 600H300C390 600 462 528 462 438V246C462 156 536 84 626 84C716 84 790 156 790 246V686C790 770 858 838 942 838C1026 838 1094 770 1094 686V386C1094 296 1168 222 1258 222H1520"
            stroke="url(#auth-road-gradient)"
            strokeWidth="74"
            strokeLinecap="round"
            filter="url(#auth-road-blur)"
            opacity="0.18"
          />

          <path
            d="M-80 600H300C390 600 462 528 462 438V246C462 156 536 84 626 84C716 84 790 156 790 246V686C790 770 858 838 942 838C1026 838 1094 770 1094 686V386C1094 296 1168 222 1258 222H1520"
            stroke="url(#auth-road-gradient)"
            strokeWidth="52"
            strokeLinecap="round"
            style={{
              strokeDasharray: 2600,
              strokeDashoffset: 2600,
              animation: 'builderRoadReveal 2.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            }}
          />

          <path
            d="M-80 600H300C390 600 462 528 462 438V246C462 156 536 84 626 84C716 84 790 156 790 246V686C790 770 858 838 942 838C1026 838 1094 770 1094 686V386C1094 296 1168 222 1258 222H1520"
            stroke="#192F52"
            strokeOpacity="0.26"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="18 18"
            style={{
              animation: 'builderRoadDrift 16s linear infinite',
            }}
          />
        </svg>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,250,250,0.06)_0%,rgba(250,250,250,0.12)_34%,rgba(250,250,250,0.34)_64%,rgba(250,250,250,0.58)_100%)]" />
    </div>
  );
}

function BuilderShell() {
  const { user } = useUser();
  const builderRole = getBuilderRole(user);

  return (
    <>
      <div className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-[16px] px-[24px] py-[16px] md:px-[40px]">
          <div className="flex items-center gap-[16px]">
            <Link to="/app" className="text-[22px] text-[#191919]" style={{ fontWeight: 'bold' }}>
              Journey Map Builder
            </Link>
            <Link
              to="/preview/nondegree-discovery"
              target="_blank"
              rel="noreferrer"
              className="text-[14px] text-[#5f5f5f] transition-colors duration-150 hover:text-[#191919] active:opacity-70 cursor-pointer"
            >
              Open preview map
            </Link>
          </div>

          <div className="flex items-center gap-[12px]">
            <div className="hidden items-center rounded-full bg-[#FAFAFA] px-[12px] py-[8px] md:inline-flex">
              <span className="text-[14px] text-[#191919]" style={{ fontWeight: 'bold' }}>
                {builderRole === 'admin' ? 'Admin' : 'Editor'}
              </span>
            </div>
            <UserButton />
          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
}

export function BuilderLayout() {
  if (!clerkPublishableKey) {
    return <ClerkSetupNotice />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <ClerkLoading>
        <div className="flex min-h-screen items-center justify-center px-[24px] text-[16px] text-[#5f5f5f]">
          Loading builder authentication...
        </div>
      </ClerkLoading>

      <ClerkLoaded>
        <SignedOut>
          <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-[24px] py-[40px]">
            <BuilderAuthBackground />
            <style>{`
              @keyframes builderRoadReveal {
                from { stroke-dashoffset: 2600; }
                to { stroke-dashoffset: 0; }
              }

              @keyframes builderRoadDrift {
                from { stroke-dashoffset: 0; }
                to { stroke-dashoffset: -720; }
              }
            `}</style>
            <div className="relative z-10 w-full max-w-[460px] rounded-[20px] border border-black/10 bg-white/95 p-[20px] shadow-[0_28px_70px_rgba(0,0,0,0.08)] backdrop-blur-[8px]">
              <SignIn
                forceRedirectUrl="/app"
                fallbackRedirectUrl="/app"
                signUpForceRedirectUrl="/app"
                signUpFallbackRedirectUrl="/app"
              />
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <BuilderShell />
        </SignedIn>
      </ClerkLoaded>
    </div>
  );
}
