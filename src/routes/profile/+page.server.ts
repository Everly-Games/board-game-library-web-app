// src/routes/profile/+page.server.ts
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user; // adjust this depending on your auth setup

  if (!user) {
    throw redirect(302, '/signin');
  }

  return { user };
};
