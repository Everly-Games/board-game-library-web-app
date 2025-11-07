// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const { supabase, session, user } = locals;

  console.log('🔐 Logged-in user:', user ? user.email : 'No user (logged out)');

  // From Supabase auth (Google, email, etc.)
  const authUser = user ?? session?.user ?? null;

  let profile: { avatar_url?: string } | null = null;

  if (authUser && supabase) {
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', authUser.id)
      .maybeSingle();

    profile = data ?? null;
  }

  return {
    user: authUser,
    profile
  };
};
