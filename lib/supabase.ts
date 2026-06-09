import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jsckwatjcwzvcvxjcfws.supabase.co';
const supabaseAnonKey = 'sb_publishable_eJpSngwHOBE4GHz4c80jdQ_7p_R6_DT';

// Custom storage that works on web (synchronous localStorage)
const webStorage = {
  getItem: (key: string): string | null => {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  setItem: (key: string, value: string): void => {
    try { localStorage.setItem(key, value); } catch {}
  },
  removeItem: (key: string): void => {
    try { localStorage.removeItem(key); } catch {}
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: webStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // false to avoid URL parsing issues on web
  },
});
