import React, { useEffect } from 'react';
import { useContent } from '../hooks/useContent';
import ContentCard from '../components/ContentCard';
import { Loader2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Blogs() {
  const { contents, loading, error, loadContents, likeContent, unlikeContent } = useContent();

  useEffect(() => {
    loadContents('blog');
  }, []);

  const handleShare = (contentId: string) => {
    const url = `${window.location.origin}/content/${contentId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const blogContents = contents.filter(content => 
    content.content_type === 'blog' || content.content_type === 'article'
  );

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
        <p className="text-red-600">Error loading blogs: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-8 h-8 text-gray-700" />
          <h1 className="text-3xl font-bold text-gray-900">Blogs & Articles</h1>
        </div>
        <p className="text-gray-600">
          Discover insightful blogs and articles from talented writers
        </p>
      </div>

      {blogContents.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No blogs or articles available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogContents.map((content) => (
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