import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, ShoppingCart } from 'lucide-react';
import type { Content } from '../types';
import TradeModal from './TradeModal';

interface ContentCardProps {
  content: Content;
  onLike: (contentId: string) => void;
  onUnlike: (contentId: string) => void;
  onShare: (contentId: string) => void;
}

export default function ContentCard({ content, onLike, onUnlike, onShare }: ContentCardProps) {
  const [showTradeModal, setShowTradeModal] = useState(false);

  const handleLike = () => {
    if (content.is_liked) {
      onUnlike(content.id);
    } else {
      onLike(content.id);
    }
  };

  const formatPrice = (price: number) => {
    return `${price} ETH`;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        {/* Cover Image */}
        {content.cover_image_url && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img
              src={content.cover_image_url}
              alt={content.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{content.title}</h3>
              {content.description && (
                <p className="text-gray-600 text-sm mb-3">
                  {truncateText(content.description, 150)}
                </p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>By {content.creator?.username || 'Anonymous'}</span>
                <span>•</span>
                <span>{new Date(content.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span className="capitalize">{content.content_type}</span>
              </div>
            </div>
            <div className="ml-4">
              <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                {formatPrice(content.price_eth)}
              </span>
            </div>
          </div>

          {/* Preview for Music */}
          {content.content_type === 'music' && content.preview_url && (
            <div className="mb-4">
              <audio controls className="w-full">
                <source src={content.preview_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <p className="text-xs text-gray-500 mt-1">30-second preview</p>
            </div>
          )}

          {/* Text Preview for Blogs/Articles */}
          {(content.content_type === 'blog' || content.content_type === 'article') && 
           content.content_text && !content.is_purchased && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-sm">
                {truncateText(content.content_text, 200)}
              </p>
              {content.content_text.length > 200 && (
                <p className="text-xs text-gray-500 mt-2">
                  Purchase to read the full content
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  content.is_liked
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart size={20} fill={content.is_liked ? 'currentColor' : 'none'} />
                <span className="text-sm">{content.likes_count || 0}</span>
              </button>

              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                <MessageCircle size={20} />
                <span className="text-sm">{content.comments_count || 0}</span>
              </button>

              <button
                onClick={() => onShare(content.id)}
                className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
              >
                <Share2 size={20} />
                <span className="text-sm">Share</span>
              </button>
            </div>

            <button
              onClick={() => setShowTradeModal(true)}
              className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart size={16} />
              <span className="text-sm">
                {content.is_purchased ? 'Sell' : 'Buy'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      {showTradeModal && (
        <TradeModal
          content={content}
          onClose={() => setShowTradeModal(false)}
        />
      )}
    </>
  );
}