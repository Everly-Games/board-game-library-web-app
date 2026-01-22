import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies, setHeaders, request }) => {
  console.log('🔴 [signout] Starting logout process');
  
  // Get all cookies before signout for debugging
  const cookiesBefore = cookies.getAll().map(c => c.name);
  console.log('🍪 [signout] Cookies before signout:', cookiesBefore);

  // Supabase sign out with global scope to clear all sessions
  // This should trigger setAll callback to clear cookies
  const { error } = await locals.supabase.auth.signOut({ scope: 'global' });
  
  if (error) {
    console.error('🔴 [signout] SignOut error:', error);
  } else {
    console.log('✅ [signout] SignOut successful');
  }

  // Get all cookies after signout to see what Supabase's setAll did
  const cookiesAfterSignOut = cookies.getAll().map(c => c.name);
  console.log('🍪 [signout] Cookies after signOut() call:', cookiesAfterSignOut);

  // Manually clear ALL Supabase-related cookies to be absolutely sure
  // Supabase SSR uses cookies like: sb-<project-ref>-auth-token, sb-<project-ref>-auth-token-code-verifier
  const allCookies = cookies.getAll();
  console.log('🍪 [signout] All cookies to process:', allCookies.map(c => `${c.name}=${c.value.substring(0, 20)}...`));
  
  for (const cookie of allCookies) {
    if (cookie.name.startsWith('sb-')) {
      console.log(`🗑️ [signout] Clearing cookie: ${cookie.name}`);
      // Set to empty with maxAge: 0 to expire immediately (this is the proper way)
      cookies.set(cookie.name, '', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: !dev,
        maxAge: 0,
        expires: new Date(0) // Expire in the past
      });
      // Also delete it (with path specified)
      cookies.delete(cookie.name, { path: '/' });
    }
  }

  // Create a fresh Supabase client to verify session is actually gone
  // This simulates what will happen on the next request
  const testSupabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: !dev,
            ...options
          });
        });
      }
    }
  });

  const { data: { session: sessionAfter } } = await testSupabase.auth.getSession();
  console.log('🔐 [signout] Session after clearing cookies:', sessionAfter ? `STILL EXISTS (${sessionAfter.user.email})` : 'CLEARED ✅');
  
  if (sessionAfter) {
    console.error('⚠️ [signout] WARNING: Session still exists after clearing cookies!');
    console.error('⚠️ [signout] Remaining cookies:', cookies.getAll().map(c => c.name));
  }

  // Prevent caching of the logout response and subsequent pages
  // Note: The redirect will cause a fresh load, and the layout uses depends('app:auth')
  // so it will automatically reload with the cleared session
  setHeaders({
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  // Redirect to sign in or home with cache-busting
  // Using 303 See Other to ensure a fresh GET request
  throw redirect(303, '/signin');
};
