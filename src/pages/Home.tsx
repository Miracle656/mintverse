// @ts-nocheck
import React, { useEffect } from 'react';
import { useContent } from '../hooks/useContent';
import ContentCard from '../component/ContentCard';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const { contents, loading, error, loadContents, likeContent, unlikeContent } = useContent();

  useEffect(() => {
    loadContents();
  }, []);

  const handleShare = (contentId: string) => {
    const url = `${window.location.origin}/content/${contentId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-medium">Error loading content: {error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8 border-b border-neutral-200 pb-4">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
          Discover Amazing Content
        </h1>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Explore blogs, articles, and music from creators around the world.
        </p>
      </div>

      {/* No Content */}
      {contents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-400 text-sm">No content available yet.</p>
        </div>
      ) : (
        // Cards
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {contents.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              onLike={likeContent}
              onUnlike={unlikeContent}
              onShare={handleShare}
              className="bg-neutral-50 border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            />
          ))}
        </div>
      )}
    </div>
  );
}
