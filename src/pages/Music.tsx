import React, { useEffect } from 'react';
import { useContent } from '../hooks/useContent';
import ContentCard from '../components/ContentCard';
import { Loader2, Music as MusicIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Music() {
  const { contents, loading, error, loadContents, likeContent, unlikeContent } = useContent();

  useEffect(() => {
    loadContents('music');
  }, []);

  const handleShare = (contentId: string) => {
    const url = `${window.location.origin}/content/${contentId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const musicContents = contents.filter(content => content.content_type === 'music');

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
        <p className="text-red-600">Error loading music: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <MusicIcon className="w-8 h-8 text-gray-700" />
          <h1 className="text-3xl font-bold text-gray-900">Music</h1>
        </div>
        <p className="text-gray-600">
          Listen to amazing music from independent artists
        </p>
      </div>

      {musicContents.length === 0 ? (
        <div className="text-center py-12">
          <MusicIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No music available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {musicContents.map((content) => (
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