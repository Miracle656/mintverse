export interface Profile {
  id: string;
  wallet_address: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  content_type: 'blog' | 'article' | 'music';
  content_text?: string;
  music_url?: string;
  preview_url?: string;
  cover_image_url?: string;
  coin_address?: string;
  price_eth: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  creator?: Profile;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
  is_purchased?: boolean;
}

export interface ContentPurchase {
  id: string;
  content_id: string;
  buyer_id: string;
  transaction_hash?: string;
  amount_paid?: number;
  purchased_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Like {
  id: string;
  content_id: string;
  user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  content_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
  updated_at: string;
  user?: Profile;
}

export interface Share {
  id: string;
  content_id: string;
  user_id: string;
  shared_at: string;
}