// src/routes/signin/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

// Only allow same-site, relative redirects
function getSafeRedirect(url: URL, fallback = '/') {
  const redirectTo = url.searchParams.get('redirectTo');
  if (!redirectTo) return fallback;
  if (redirectTo.startsWith('/')) return redirectTo;
  return fallback;
}

export const load: PageServerLoad = async ({ locals, url, setHeaders, cookies }) => {
  // Prevent caching of signin page to ensure fresh data after logout
  setHeaders({
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  // Debug: Check session and cookies
  const allCookies = cookies.getAll().map(c => c.name);
  console.log('🔵 [signin/load] Cookies:', allCookies);
  console.log('🔵 [signin/load] Session exists:', !!locals.session);
  console.log('🔵 [signin/load] User:', locals.user?.email || 'none');

  // If already logged in, send them "home"
  if (locals.session) {
    console.log('🟡 [signin/load] Already logged in, redirecting home');
    const next = getSafeRedirect(url, '/');
    throw redirect(302, next);
  }

  return {};
};

export const actions: Actions = {
  // Email/password signin (named action: "signin")
  signin: async ({ request, locals, url }) => {
    const form = await request.formData();

    const email = (form.get('email') ?? '').toString().trim();
    const password = (form.get('password') ?? '').toString();

    if (!email || !password) {
      return fail(400, { error: 'Email and password are required.' });
    }

    const { error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return fail(400, { error: error.message });
    }

    const next = getSafeRedirect(url, '/');
    throw redirect(302, next);
  },

  // Google signin (named action: "google")
  google: async ({ locals, url, cookies }) => {
    console.log('🔵 [signin/google] Google action hit');
    
    // Debug: Check session and cookies
    const allCookies = cookies.getAll().map(c => c.name);
    console.log('🔵 [signin/google] Cookies:', allCookies);
    console.log('🔵 [signin/google] Session exists:', !!locals.session);
    console.log('🔵 [signin/google] User:', locals.user?.email || 'none');

    // If already logged in, redirect home instead of starting OAuth
    if (locals.session) {
      console.log('🟡 [signin/google] Already logged in, redirecting home');
      const next = getSafeRedirect(url, '/');
      throw redirect(302, next);
    }

    // Where do we ultimately want to land? (home by default)
    const next = getSafeRedirect(url, '/');
    const redirectTo = `${url.origin}/auth/callback?redirectTo=${encodeURIComponent(next)}`;

    console.log('🌐 [signin/google] Using redirectTo:', redirectTo);

    const { data, error } = await locals.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo }
    });

    if (error) {
      console.error('🔴 [signin/google] Supabase OAuth error:', error);
      return fail(400, { error: error.message });
    }

    if (!data?.url) {
      console.error('🔴 [signin/google] No redirect URL from Supabase OAuth');
      return fail(500, { error: 'Could not start Google sign-in.' });
    }

    console.log('🟢 [signin/google] Redirecting to:', data.url);
    throw redirect(302, data.url);
  }
};
