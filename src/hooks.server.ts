// src/hooks.server.ts
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';
import { dev } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        // SvelteKit's cookies.getAll()
        getAll: () => event.cookies.getAll(),

        // Supabase will call this with the full list of cookies it wants set
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, {
              path: '/',
              httpOnly: true,
              sameSite: 'lax',
              secure: !dev,
              ...options
            });
          });
        }
      }
    }
  );

  // Fetch the current session (if any)
  const {
    data: { session }
  } = await supabase.auth.getSession();

  // Expose Supabase client + session on locals
  event.locals.supabase = supabase;
  event.locals.session = session;

  // Continue the normal SvelteKit request flow
  return resolve(event);
};
