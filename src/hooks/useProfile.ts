import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase, setCurrentWalletAddress } from '../lib/supabase';
import type { Profile, Content } from '../types';

export function useProfile() {
  const { address, isConnected } = useAccount();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [createdContent, setCreatedContent] = useState<Content[]>([]);
  const [boughtContent, setBoughtContent] = useState<Content[]>([]);
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
      await setCurrentWalletAddress(address);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', address)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile(data);
        await Promise.all([
          loadCreatedContent(data.id),
          loadBoughtContent(data.id),
        ]);
      } else {
        const newProfile = await createProfile();
        if (newProfile) {
          await Promise.all([
            loadCreatedContent(newProfile.id),
            loadBoughtContent(newProfile.id),
          ]);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!address) return;

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
    return data;
  };

  const loadCreatedContent = async (profileId: string) => {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('creator_id', profileId)
      .order('created_at', { ascending: false });

    if (!error) setCreatedContent(data || []);
  };

  const loadBoughtContent = async (profileId: string) => {
    const { data, error } = await supabase
      .from('content_purchases')
      .select('content(*, creator:profiles(*))')
      .eq('buyer_id', profileId)
      .order('created_at', { ascending: false });

    if (!error) {
      setBoughtContent((data || []).map((d: any) => d.content));
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
    createdContent,
    boughtContent,
    loading,
    error,
    updateProfile,
    refreshProfile: loadProfile,
  };
}
