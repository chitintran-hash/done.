import { createClient } from '@supabase/supabase-js';

function normalizeSupabaseUrl(raw: string): string {
  const trimmed = (raw || '').trim().replace(/\/+$/, '').replace(/\/rest\/v1$/i, '');
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed) && /^[a-z0-9]{15,30}$/i.test(trimmed)) {
    return `https://${trimmed}.supabase.co`;
  }
  return trimmed;
}

export const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL || '');
export const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project')
);

// ---------------------------------------------------------------------
// Fallback (dummy) client used when Supabase is not configured.
// It provides the minimal API surface used throughout the codebase so
// that importing modules does not throw at runtime.
// ---------------------------------------------------------------------
const dummyClient = {
  auth: {
    async getSession() {
      return { data: { session: null }, error: null };
    },
    async signInWithPassword(_params: any) {
      return { data: { user: null }, error: null };
    },
    async signUp(_params: any) {
      return { data: { user: null }, error: null };
    },
    async signOut() {
      return { error: null };
    },
    onAuthStateChange(_callback: any) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
  },
  from(_table: string) {
    const emptyResult = async () => ({ data: [], error: null });
    return {
      select: () => ({ data: [], error: null, async single() { return { data: null, error: null }; } }),
      insert: () => emptyResult(),
      update: () => emptyResult(),
      delete: () => emptyResult(),
      eq: function() { return this; },
    } as any;
  },
  channel(_name: string) {
    return {
      on: function() { return this; },
      subscribe: function() { return this; },
    };
  },
  removeChannel(_channel: any) {},
} as any;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : (dummyClient as ReturnType<typeof createClient>);
