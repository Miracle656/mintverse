import React, { useState } from 'react';
import { useContent } from '../hooks/useContent';
import { Plus, FileText, Music, Image, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Create() {
  const { createContent, loading } = useContent();
  const [contentType, setContentType] = useState<'blog' | 'article' | 'music'>('blog');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_text: '',
    music_url: '',
    preview_url: '',
    cover_image_url: '',
    price_eth: 0.001,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price_eth' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createContent({ ...formData, content_type: contentType });
      toast.success('Content created successfully!');
      setFormData({ title: '', description: '', content_text: '', music_url: '', preview_url: '', cover_image_url: '', price_eth: 0.001 });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create content');
    }
  };

  const isFormValid = () => {
    if (!formData.title.trim() || !formData.description.trim() || formData.price_eth <= 0) return false;
    return contentType === 'music' ? formData.music_url.trim() !== '' : formData.content_text.trim() !== '';
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Plus className="w-6 h-6 text-gray-900" />
          <h1 className="text-2xl font-bold text-gray-900">Create Content</h1>
        </div>
        <p className="text-gray-600 text-sm">Share your creativity and monetize your content</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Content Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { type: 'blog', icon: FileText, label: 'Blog', desc: 'Share your thoughts' },
                { type: 'article', icon: FileText, label: 'Article', desc: 'In-depth content' },
                { type: 'music', icon: Music, label: 'Music', desc: 'Share your music' },
              ].map(({ type, icon: Icon, label, desc }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setContentType(type)}
                  className={`p-3 border-2 rounded-lg text-left transition-colors ${
                    contentType === type ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1 text-gray-900" />
                  <h3 className="font-medium text-gray-900">{label}</h3>
                  <p className="text-xs text-gray-500">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter title"
                required
              />
            </div>

            <div>
              <label htmlFor="price_eth" className="block text-sm font-medium text-gray-700 mb-1">Price (ETH) *</label>
              <input
                type="number"
                id="price_eth"
                name="price_eth"
                value={formData.price_eth}
                onChange={handleInputChange}
                step="0.001"
                min="0.001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              placeholder="Describe your content"
              required
            />
          </div>

          <div>
            <label htmlFor="cover_image_url" className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
            <div className="flex">
              <input
                type="url"
                id="cover_image_url"
                name="cover_image_url"
                value={formData.cover_image_url}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              <button type="button" className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors">
                <Image className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content-specific fields */}
          {contentType === 'music' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="music_url" className="block text-sm font-medium text-gray-700 mb-1">Music URL *</label>
                <input
                  type="url"
                  id="music_url"
                  name="music_url"
                  value={formData.music_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="https://example.com/music.mp3"
                  required
                />
              </div>
              <div>
                <label htmlFor="preview_url" className="block text-sm font-medium text-gray-700 mb-1">Preview URL</label>
                <input
                  type="url"
                  id="preview_url"
                  name="preview_url"
                  value={formData.preview_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="https://example.com/preview.mp3"
                />
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="content_text" className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea
                id="content_text"
                name="content_text"
                value={formData.content_text}
                onChange={handleInputChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                placeholder={`Write your ${contentType} content here...`}
                required
              />
            </div>
          )}

          {/* Submit */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Content...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Create & Publish</span>
                </div>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
