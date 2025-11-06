// src/routes/signup/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.session) {
    // Already logged in → send to settings (or home if you prefer)
    throw redirect(302, '/settings');
  }

  return {};
};

export const actions: Actions = {
  // Email/password signup
  signup: async ({ request, locals }) => {
    const form = await request.formData();

    const email = (form.get('email') ?? '').toString().trim();
    const password = (form.get('password') ?? '').toString();
    const passwordConfirm = (form.get('password_confirm') ?? '').toString();

    if (!email || !password) {
      return fail(400, { error: 'Email and password are required.' });
    }

    if (password !== passwordConfirm) {
      return fail(400, { error: 'Passwords do not match.' });
    }

    const { data, error } = await locals.supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return fail(400, { error: error.message });
    }

    // If email confirmation is off, Supabase may create a session immediately
    if (data.session) {
      throw redirect(302, '/settings');
    }

    // If confirmation is on, tell them to check their email
    return {
      success: true,
      message: 'Account created! Check your email to confirm your address.'
    };
  },

  // Google signup/login
  google: async ({ locals }) => {
    console.log('🔵 [signup/google] Google action hit');

    const { data, error } = await locals.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://www.boardgamelibrary.com/settings' }
    });

    if (error) {
      console.error('🔴 [signup/google] Supabase OAuth error:', error);
      return fail(400, { error: error.message });
    }

    if (!data?.url) {
      console.error('🔴 [signup/google] No redirect URL from Supabase OAuth');
      return fail(500, { error: 'Could not start Google sign-up.' });
    }

    console.log('🟢 [signup/google] Redirecting to:', data.url);
    throw redirect(302, data.url);
  }
};
