import type { UserResource } from '@clerk/types';

const defaultAdminEmails = ['jkenzler@asu.edu'];

function normalizedEmails(value: string | undefined) {
  if (!value) return [];

  return value
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function getBuilderAdminEmails() {
  const configured = normalizedEmails(import.meta.env.VITE_BUILDER_ADMIN_EMAILS);
  return configured.length > 0 ? configured : defaultAdminEmails;
}

export function getBuilderRole(user: UserResource | null | undefined) {
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  if (!email) return 'editor';
  return getBuilderAdminEmails().includes(email) ? 'admin' : 'editor';
}
