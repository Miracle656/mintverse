import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase, setCurrentWalletAddress } from '../lib/supabase';
import type { Profile } from '../types';

export function useProfile() {
  const { address, isConnected } = C:\Users\dell\Documents\zoradev\mintverse\src\hooksuseAccount();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      loadProfile();
    } else {
      setProfile(null);
    }
  }, [address, isConnected]);

  const loadProfile = async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      // Set current wallet address for RLS
      await setCurrentWalletAddress(address);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', address)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create profile if it doesn't exist
        await createProfile();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!address) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          wallet_address: address,
          username: `User_${address.slice(0, 6)}`,
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!address || !profile) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('wallet_address', address)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: loadProfile,
  };
}