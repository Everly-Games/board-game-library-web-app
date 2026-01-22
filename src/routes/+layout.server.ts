// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, depends }) => {
  const { supabase, session, user } = locals;

  // Mark this load function as dependent on auth state for invalidation
  depends('app:auth');

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

    // If no avatar in profiles table, check user_metadata (from Google OAuth, etc.)
    if (!profile?.avatar_url && authUser.user_metadata) {
      const metadataAvatar = authUser.user_metadata.avatar_url || authUser.user_metadata.picture;
      if (metadataAvatar) {
        profile = { avatar_url: metadataAvatar };
      }
    }
  }

  return {
    user: authUser,
    profile
  };
};
