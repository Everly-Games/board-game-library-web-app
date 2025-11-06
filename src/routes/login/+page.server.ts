// src/routes/login/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.session) {
    throw redirect(302, '/settings');
  }

  return {};
};

export const actions: Actions = {
  // Email/password login (named action: "login")
  login: async ({ request, locals }) => {
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

    throw redirect(302, '/settings');
  },

  // Google login (named action: "google")
  google: async ({ locals }) => {
    console.log('🔵 [login/google] Google action hit');

    const { data, error } = await locals.supabase.auth.signInWithOAuth({
      provider: 'google'
      // options: { redirectTo: 'http://localhost:5173/settings' } // optional
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
