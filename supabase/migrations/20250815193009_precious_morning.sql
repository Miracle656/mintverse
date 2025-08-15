/*
  # Content Platform Database Schema

  1. New Tables
    - `profiles` - User profiles with wallet addresses
    - `content` - Blog posts, articles, and music content
    - `content_purchases` - Track who has purchased access to content
    - `follows` - User follow relationships
    - `likes` - Content likes
    - `comments` - Content comments
    - `shares` - Content shares tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure users can only modify their own data
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  username text,
  bio text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Content table (blogs, articles, music)
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content_type text NOT NULL CHECK (content_type IN ('blog', 'article', 'music')),
  content_text text, -- For blogs/articles
  music_url text, -- For music files
  preview_url text, -- For music previews (30 seconds)
  cover_image_url text,
  coin_address text, -- The deployed coin address for this content
  price_eth decimal NOT NULL DEFAULT 0.001,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Content purchases table
CREATE TABLE IF NOT EXISTS content_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_hash text,
  amount_paid decimal,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE(content_id, buyer_id)
);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(content_id, user_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  comment_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shares table
CREATE TABLE IF NOT EXISTS shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  shared_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (wallet_address = current_setting('app.current_wallet_address', true));

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (wallet_address = current_setting('app.current_wallet_address', true));

-- Content policies
CREATE POLICY "Users can read published content"
  ON content FOR SELECT
  TO authenticated
  USING (is_published = true OR creator_id IN (
    SELECT id FROM profiles WHERE wallet_address = current_setting('app.current_wallet_address', true)
  ));

CREATE POLICY "Users can create own content"
  ON content FOR INSERT
  TO authenticated
  WITH CHECK (creator_id IN (
    SELECT id FROM profiles WHERE wallet_address = current_setting('app.current_wallet_address', true)
  ));

CREATE POLICY "Users can update own content"
  ON content FOR UPDATE
  TO authenticated
  USING (creator_id IN (
    SELECT id FROM profiles WHERE wallet_address = current_setting('app.current_wallet_address', true)
  ));

-- Content purchases policies
CREATE POLICY "Users can read own purchases"
  ON content_purchases FOR SELECT
  TO authenticated
  USING (buyer_id IN (
    SELECT id FROM profiles WHERE wallet_address = current_setting('app.current_wallet_address', true)
  ) OR content_id IN (
    SELECT id FROM content WHERE creator_id IN (
      SELECT id FROM profiles WHERE wallet_address = current_setting('app.current_wallet_address', true)
    )
  ));

CREATE POLICY "Users can create purchases"
  ON content_purchases FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id IN (
    SELECT id FROM profiles WHERE wallet_address = current_setting('app.current_wallet_address', true)
  ));

-- Follows policies
CREATE POLICY "Users can read all follows"
  ON follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own follows"
  ON follows FOR ALL
  TO authenticated
  USING (follower_id IN (
    SELECT id FROM profiles WHERE wallet_address = current_setting('app.current_wallet_address', true)
  ));

-- Likes policies
CREATE POLICY "Users can read all likes"
  ON likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own likes"
  ON likes FOR ALL
  TO authenticated
  USING (user_id IN (
    SELECT id FROM profiles WHERE wallet_address = current_setting('app.current_wallet_address', true)
  ));

-- Comments policies
CREATE POLICY "Users can read all comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM profiles WHERE wallet_address = current_setting('app.current_wallet_address', true)
  ));

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM profiles WHERE wallet_address = current_setting('app.current_wallet_address', true)
  ));

-- Shares policies
CREATE POLICY "Users can read all shares"
  ON shares FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create shares"
  ON shares FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM profiles WHERE wallet_address = current_setting('app.current_wallet_address', true)
  ));

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address ON profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_content_creator_id ON content(creator_id);
CREATE INDEX IF NOT EXISTS idx_content_type ON content(content_type);
CREATE INDEX IF NOT EXISTS idx_content_published ON content(is_published);
CREATE INDEX IF NOT EXISTS idx_content_purchases_content_id ON content_purchases(content_id);
CREATE INDEX IF NOT EXISTS idx_content_purchases_buyer_id ON content_purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_likes_content_id ON likes(content_id);
CREATE INDEX IF NOT EXISTS idx_comments_content_id ON comments(content_id);