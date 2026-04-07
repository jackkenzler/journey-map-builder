import { ClerkLoaded, ClerkLoading, OrganizationSwitcher, SignedIn, SignedOut, SignIn, UserButton } from '@clerk/clerk-react';
import { Link, Outlet } from 'react-router';

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
          <p>2. Enable organizations.</p>
          <p>3. Add the publishable key locally and in Vercel.</p>
          <p>4. Later we’ll add server-side persistence with Supabase for maps, versions, and assets.</p>
        </div>

        <div className="mt-[24px] flex gap-[12px]">
          <Link
            to="/"
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
          <div className="flex min-h-screen items-center justify-center px-[24px] py-[40px]">
            <div className="w-full max-w-[460px] rounded-[20px] border border-black/10 bg-white p-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
              <SignIn />
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="border-b border-black/10 bg-white">
            <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-[16px] px-[24px] py-[16px] md:px-[40px]">
              <div className="flex items-center gap-[16px]">
                <Link to="/app" className="text-[22px] text-[#191919]" style={{ fontWeight: 'bold' }}>
                  Journey Map Builder
                </Link>
                <Link to="/" className="text-[14px] text-[#5f5f5f] transition-colors duration-150 hover:text-[#191919] active:opacity-70 cursor-pointer">
                  Open preview map
                </Link>
              </div>

              <div className="flex items-center gap-[12px]">
                <OrganizationSwitcher
                  hidePersonal
                  appearance={{
                    elements: {
                      rootBox: 'shrink-0',
                    },
                  }}
                />
                <UserButton />
              </div>
            </div>
          </div>

          <Outlet />
        </SignedIn>
      </ClerkLoaded>
    </div>
  );
}
