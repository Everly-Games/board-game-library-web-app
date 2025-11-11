import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies }) => {
  // Supabase sign ou
  await locals.supabase.auth.signOut();

  // Clear auth cookies (Supabase should do this, but you can enforce it)
  cookies.delete('sb-access-token', { path: '/' });
  cookies.delete('sb-refresh-token', { path: '/' });

  // Redirect to sign in or home
  throw redirect(303, '/');
};
