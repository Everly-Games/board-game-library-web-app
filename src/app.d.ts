// src/app.d.ts

import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient;
      session: Session | null;
	    user: User | null; 
    }

	interface PageData {
      user: User | null;
      profile?: { avatar_url?: string | null } | null;
	}
	// interface Error {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
