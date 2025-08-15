import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to set the current wallet address for RLS
export const setCurrentWalletAddress = (walletAddress: string) => {
  return supabase.rpc('set_config', {
    setting_name: 'app.current_wallet_address',
    setting_value: walletAddress,
    is_local: true
  });
};