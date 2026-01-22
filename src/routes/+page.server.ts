// src/routes/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
  // If there's an OAuth code in the URL, redirect to the callback handler
  // This handles cases where Supabase redirects to / instead of /auth/callback
  const code = url.searchParams.get('code');
  if (code) {
    console.log('🟡 [home] OAuth code detected on home page, redirecting to callback');
    const redirectTo = url.searchParams.get('redirectTo') || '/';
    throw redirect(302, `/auth/callback?code=${encodeURIComponent(code)}&redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return {};
};
