// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { User, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const {
    profile,
    createdContent = [],
    boughtContent = [],
    loading,
    error,
    updateProfile,
    refreshProfile,
  } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'created' | 'bought'>('created');

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
      refreshProfile?.();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error ? `Error: ${error}` : 'Profile not found'}</p>
      </div>
    );
  }

  // guards to avoid runtime errors
  const created = Array.isArray(createdContent) ? createdContent : [];
  const bought = Array.isArray(boughtContent) ? boughtContent : [];

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <User className="w-6 h-6 text-gray-900" />
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>
        <p className="text-gray-600 text-sm">Manage your profile information and settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-500" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.username || 'Anonymous'}</h2>
              <p className="text-gray-600 text-xs font-mono">{profile.wallet_address}</p>
              <p className="text-gray-500 text-xs mt-1">
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <div className="space-y-4">
            {['username', 'bio', 'avatar_url'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                {field === 'bio' ? (
                  <textarea
                    name={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  />
                ) : (
                  <input
                    type={field === 'avatar_url' ? 'url' : 'text'}
                    name={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                )}
              </div>
            ))}

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {profile.bio && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Bio</h3>
                <p className="text-gray-900 text-sm">{profile.bio || 'No bio provided yet.'}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-bold text-gray-900">{profile.content_count || created.length}</h4>
                <p className="text-gray-600 text-xs">Content Created</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-bold text-gray-900">{profile.followers_count || 0}</h4>
                <p className="text-gray-600 text-xs">Followers</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs for Created / Bought */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center space-x-4 border-b pb-2">
          <button
            onClick={() => setActiveTab('created')}
            className={`py-2 px-3 text-sm font-medium ${activeTab === 'created' ? 'border-b-2 border-black' : 'text-gray-500'}`}
          >
            Created ({created.length})
          </button>
          <button
            onClick={() => setActiveTab('bought')}
            className={`py-2 px-3 text-sm font-medium ${activeTab === 'bought' ? 'border-b-2 border-black' : 'text-gray-500'}`}
          >
            Bought ({bought.length})
          </button>
        </div>

        <div className="mt-4">
          {activeTab === 'created' ? (
            created.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {created.map((item: any) => (
                  <div key={item.id} className="border rounded-lg p-3">
                    {item.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.cover_image_url} alt={item.title} className="w-full h-40 object-cover rounded-md" />
                    ) : (
                      <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center">No image</div>
                    )}
                    <h3 className="font-bold mt-2 text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No created content yet.</p>
            )
          ) : (
            bought.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bought.map((item: any) => (
                  <div key={item.id} className="border rounded-lg p-3">
                    {item.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.cover_image_url} alt={item.title} className="w-full h-40 object-cover rounded-md" />
                    ) : (
                      <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center">No image</div>
                    )}
                    <h3 className="font-bold mt-2 text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No purchases yet.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
