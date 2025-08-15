import React from 'react';
import { Star } from 'lucide-react';

export default function Extra() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Star className="w-6 h-6 text-gray-900" />
          <h1 className="text-2xl font-bold text-gray-900">Extra Features</h1>
        </div>
        <p className="text-gray-600 text-sm">Additional features and functionality coming soon</p>
      </div>

      {/* Content Box */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Coming Soon</h2>
          <p className="text-gray-600 text-sm">
            This section is reserved for future features and enhancements.
          </p>
        </div>
      </div>
    </div>
  );
}
