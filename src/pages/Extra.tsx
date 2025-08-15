import React from 'react';
import { Star } from 'lucide-react';

export default function Extra() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Star className="w-8 h-8 text-gray-700" />
          <h1 className="text-3xl font-bold text-gray-900">Extra Features</h1>
        </div>
        <p className="text-gray-600">
          Additional features and functionality coming soon
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Coming Soon
          </h2>
          <p className="text-gray-600">
            This section is reserved for future features and enhancements.
          </p>
        </div>
      </div>
    </div>
  );
}