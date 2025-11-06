// src/routes/settings/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {


  const { session, supabase } = locals;

  if (!session) {
    throw redirect(302, '/login');
  }

  console.log('Session user:', locals.session?.user?.email);

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) {
    console.error('Error loading profile:', error);
    throw fail(500, { error: 'Failed to load profile.' });
  }

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' }
    // TODO: replace with full static list later
  ];

  const genders = ['Female', 'Male', 'Other', 'Prefer not to say'] as const;

  return {
    profile,
    countries,
    genders,
    email: session.user.email,
    emailVerified: !!session.user.email_confirmed_at
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { session, supabase } = locals;

    if (!session) {
      throw redirect(302, '/login');
    }

    const form = await request.formData();

    const first_name = (form.get('first_name') ?? '').toString().trim() || null;
    const last_name = (form.get('last_name') ?? '').toString().trim() || null;

    const country_code_raw = (form.get('country_code') ?? '').toString().trim();
    const country_code = country_code_raw ? country_code_raw.toUpperCase() : null;

    const gender_raw = (form.get('gender') ?? '').toString().trim();
    const gender = gender_raw || null; // must match enum values exactly or be null

    const birth_year_raw = (form.get('birth_year') ?? '').toString().trim();
    const birth_year = birth_year_raw ? Number(birth_year_raw) : null;

    const is_over_18 =
      form.get('is_over_18') === 'on' || form.get('is_over_18') === 'true';

    const currentYear = new Date().getFullYear();
    if (birth_year !== null) {
      if (
        Number.isNaN(birth_year) ||
        birth_year < 1900 ||
        birth_year > currentYear
      ) {
        return fail(400, {
          error: 'Please enter a valid birth year.',
          values: { first_name, last_name, country_code, gender, birth_year, is_over_18 }
        });
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name,
        last_name,
        country_code,
        gender,
        birth_year,
        is_over_18
      })
      .eq('id', session.user.id);

    if (error) {
      console.error('Error updating profile:', error);
      return fail(500, {
        error: 'Could not save profile. Please try again.',
        values: { first_name, last_name, country_code, gender, birth_year, is_over_18 }
      });
    }

    return { success: true };
  }
};
