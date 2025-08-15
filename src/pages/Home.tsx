import React, { useEffect } from 'react';
import { useContent } from '../hooks/useContent';
import ContentCard from '../components/ContentCard';
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
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading content: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Discover Amazing Content
        </h1>
        <p className="text-gray-600">
          Explore blogs, articles, and music from creators around the world
        </p>
      </div>

      {contents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No content available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              onLike={likeContent}
              onUnlike={unlikeContent}
              onShare={handleShare}
            />
          ))}
        </div>
      )}
    </div>
  );
}