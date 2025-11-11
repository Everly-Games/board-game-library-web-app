// src/routes/auth/callback/+server.ts
import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

function getSafeRedirect(url: URL, fallback = '/') {
  const redirectTo = url.searchParams.get('redirectTo');
  if (!redirectTo) return fallback;
  if (redirectTo.startsWith('/')) return redirectTo;
  return fallback;
}

export const GET: RequestHandler = async ({ url, locals }) => {
  console.log('🟣 [auth/callback] HIT on', url.origin, url.pathname, url.search);

  const code = url.searchParams.get('code');
  const next = getSafeRedirect(url, '/');

  if (!code) {
    console.error('🔴 [auth/callback] Missing "code" in URL');
    throw redirect(302, '/signin');
  }

  const { data, error } = await locals.supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('🔴 [auth/callback] exchangeCodeForSession error:', error);
    throw redirect(302, '/signin?error=oauth');
  }

  console.log('🟢 [auth/callback] Session created for:', data.session?.user?.email);

  // Session cookie is now set
  throw redirect(302, next);
};
