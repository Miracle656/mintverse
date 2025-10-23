import { useState } from 'react';
import { Heart, MessageCircle, Share2, Sparkle } from 'lucide-react';
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

  const formatPrice = (price: number) => `${price} ETH`;

  const truncateText = (text: string, maxLength: number) => {
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* Cover Image */}
        {content.cover_image_url && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={content.cover_image_url}
              alt={content.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">{content.title}</h3>
              {content.description && (
                <p className="text-neutral-600 text-sm mb-2">
                  {truncateText(content.description, 150)}
                </p>
              )}
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-neutral-500">
                <span>By {content.creator?.username || 'Anonymous'}</span>
                <span>•</span>
                <span>{new Date(content.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span className="capitalize">{content.content_type}</span>
              </div>
            </div>
            <div className="ml-3">
              <span className="bg-neutral-900 text-white px-3 py-1 rounded-full text-xs font-medium">
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
              <p className="text-xs text-neutral-500 mt-1">30-second preview</p>
            </div>
          )}

          {/* Text Preview for Blogs/Articles */}
          {(content.content_type === 'blog' || content.content_type === 'article') &&
            content.content_text && !content.is_purchased && (
              <div className="mb-4 p-4 bg-neutral-100 rounded-lg">
                <p className="text-neutral-700 text-sm">
                  {truncateText(content.content_text, 200)}
                </p>
                {content.content_text.length > 200 && (
                  <p className="text-xs text-neutral-500 mt-2">
                    Purchase to read the full content
                  </p>
                )}
              </div>
            )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            <div className="flex items-center space-x-5">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 transition-colors ${
                  content.is_liked
                    ? 'text-neutral-900'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Heart
                  size={18}
                  fill={content.is_liked ? 'currentColor' : 'none'}
                />
                <span className="text-xs">{content.likes_count || 0}</span>
              </button>

              <button className="flex items-center space-x-1 text-neutral-500 hover:text-neutral-900 transition-colors">
                <MessageCircle size={18} />
                <span className="text-xs">{content.comments_count || 0}</span>
              </button>

              <button
                onClick={() => onShare(content.id)}
                className="flex items-center space-x-1 text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <Share2 size={18} />
                <span className="text-xs">Share</span>
              </button>
            </div>

            <button
              onClick={() => setShowTradeModal(true)}
              className="flex items-center space-x-1 bg-neutral-900 text-white px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors text-xs"
            >
              <Sparkle size={14} />
              <span>{content.is_purchased ? 'Sell' : 'Buy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      {showTradeModal && (
        <TradeModal content={content} onClose={() => setShowTradeModal(false)} />
      )}
    </>
  );
}
