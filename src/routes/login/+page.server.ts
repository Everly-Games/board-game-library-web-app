// src/routes/login/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

// Only allow same-site, relative redirects
function getSafeRedirect(url: URL, fallback = '/') {
  const redirectTo = url.searchParams.get('redirectTo');
  if (!redirectTo) return fallback;
  if (redirectTo.startsWith('/')) return redirectTo;
  return fallback;
}

export const load: PageServerLoad = async ({ locals, url }) => {
  // If already logged in, send them "home"
  if (locals.session) {
    const next = getSafeRedirect(url, '/');
    throw redirect(302, next);
  }

  return {};
};

export const actions: Actions = {
  // Email/password login (named action: "login")
  login: async ({ request, locals, url }) => {
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

  // Google login (named action: "google")
  google: async ({ locals, url }) => {
    console.log('🔵 [login/google] Google action hit');

    // Where do we ultimately want to land? (home by default)
    const next = getSafeRedirect(url, '/');
    const redirectTo = `${url.origin}/auth/callback?redirectTo=${encodeURIComponent(next)}`;

    console.log('🌐 [login/google] Using redirectTo:', redirectTo);

    const { data, error } = await locals.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo }
    });

    if (error) {
      console.error('🔴 [login/google] Supabase OAuth error:', error);
      return fail(400, { error: error.message });
    }

    if (!data?.url) {
      console.error('🔴 [login/google] No redirect URL from Supabase OAuth');
      return fail(500, { error: 'Could not start Google sign-in.' });
    }

    console.log('🟢 [login/google] Redirecting to:', data.url);
    throw redirect(302, data.url);
  }
};
