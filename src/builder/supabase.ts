import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

interface ClerkGlobal {
  load: () => Promise<unknown>;
  session?: { getToken: () => Promise<string | null> } | null;
}

/**
 * Supabase trusts Clerk as a third-party auth provider, so every request carries the
 * signed-in user's Clerk session token. Signed-out viewers (published links) send no
 * token and are treated as anonymous.
 */
async function getClerkToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const clerk = (window as unknown as { Clerk?: ClerkGlobal }).Clerk;
  if (!clerk) return null;

  try {
    await clerk.load();
    return (await clerk.session?.getToken()) ?? null;
  } catch {
    return null;
  }
}

export const supabase =
  hasSupabaseConfig && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, { accessToken: getClerkToken })
    : null;

export async function getSignedInUserId(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const clerk = (window as unknown as { Clerk?: ClerkGlobal & { user?: { id: string } | null } }).Clerk;
  if (!clerk) return null;

  try {
    await clerk.load();
    return clerk.user?.id ?? null;
  } catch {
    return null;
  }
}
