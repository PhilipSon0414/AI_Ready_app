import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = 'https://jsckwatjcwzvcvxjcfws.supabase.co';
const supabaseAnonKey = 'sb_publishable_eJpSngwHOBE4GHz4c80jdQ_7p_R6_DT';

// Web uses localStorage, native uses in-memory
const storage = Platform.OS === 'web' ? {
  getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
} : undefined;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
