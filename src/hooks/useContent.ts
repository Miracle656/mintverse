// @ts-nocheck
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase, setCurrentWalletAddress } from '../lib/supabase';
import { useCreateCoin } from './useCreateCoin';
import type { Content } from '../types';
import { getCoinCreateFromLogs } from "@zoralabs/coins-sdk";
import { createPublicClient, http } from 'viem';
import { base } from "viem/chains";

export function useContent() {
  const { address } = useAccount();
  const { createMyCoin } = useCreateCoin();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      setCurrentWalletAddress(address);
      loadContents();
    }
  }, [address]);

  const loadContents = async (contentType?: 'blog' | 'article' | 'music') => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('content')
        .select(`
          *,
          creator:profiles!creator_id(*)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContents(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPurchasedContent = async () => {
    if (!address) return [];

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', address)
        .single();

      if (!profile) return [];

      const { data, error } = await supabase
        .from('content_purchases')
        .select(`
          content:content_id (
            *,
            creator:profiles!creator_id(*)
          )
        `)
        .eq('buyer_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((item) => item.content);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  const createContent = async (contentData: {
    title: string;
    description?: string;
    content_type: 'blog' | 'article' | 'music';
    content_text?: string;
    music_url?: string;
    preview_url?: string;
    cover_image_url?: string;
    price_eth: number;
  }) => {
    if (!address) throw new Error('Wallet not connected');

    setLoading(true);
    setError(null);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', address)
        .single();

      if (!profile) throw new Error('Profile not found');

      const coinResult = await createMyCoin({
        name: contentData.title,
        symbol: contentData.title.substring(0, 5).toUpperCase(),
        description: contentData.description || '',
        imageUrl: contentData.cover_image_url,
        initialPrice: contentData.price_eth.toString(),
        maxSupply: '1000000',
        stepSize: '1',
      });

      const publicClient = createPublicClient({
        chain: base,
        transport: http("https://mainnet.base.org")
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: coinResult.hash,
      });

      const deployedCoinAddress = getCoinCreateFromLogs(receipt)?.coin;

      if (!deployedCoinAddress) {
        throw new Error('Failed to create coin');
      }

      const { data, error } = await supabase
        .from('content')
        .insert({
          ...contentData,
          creator_id: profile.id,
          coin_address: deployedCoinAddress,
          is_published: true,
        })
        .select(`
          *,
          creator:profiles!creator_id(*)
        `)
        .single();

      if (error) throw error;

      setContents(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const purchaseContent = async (contentId: string, transactionHash: string, amountPaid: number) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', address)
        .single();

      if (!profile) throw new Error('Profile not found');

      const { error } = await supabase
        .from('content_purchases')
        .insert({
          content_id: contentId,
          buyer_id: profile.id,
          transaction_hash: transactionHash,
          amount_paid: amountPaid,
        });

      if (error && error.code !== '23505') throw error; // ignore duplicate purchases
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const likeContent = async (contentId: string) => {
    if (!address) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', address)
        .single();

      if (!profile) return;

      const { error } = await supabase
        .from('likes')
        .insert({
          content_id: contentId,
          user_id: profile.id,
        });

      if (error && error.code !== '23505') throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const unlikeContent = async (contentId: string) => {
    if (!address) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', address)
        .single();

      if (!profile) return;

      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('content_id', contentId)
        .eq('user_id', profile.id);

      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    contents,
    loading,
    error,
    loadContents,
    loadPurchasedContent,
    createContent,
    purchaseContent,
    likeContent,
    unlikeContent,
  };
}
