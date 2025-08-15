import React, { useState } from 'react';
import { useCreateCoin } from '../hooks/useCreateCoin';
import type { CoinCreationParams } from '../hooks/useCreateCoin';

export default function CreateCoinForm() {
  const { createMyCoin, status, isDisabled, hash, deployedCoinAddress } = useCreateCoin();
  const [formData, setFormData] = useState<CoinCreationParams>({
    name: '',
    symbol: '',
    description: '',
    initialPrice: '0.001',
    maxSupply: '1000000',
    stepSize: '1',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [useFileUpload, setUseFileUpload] = useState(true);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl('');
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const params: CoinCreationParams = {
        ...formData,
        image: imageFile || undefined,
        imageUrl: imageUrl || undefined,
      };

      await createMyCoin(params);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.symbol.trim() !== '' &&
      formData.description.trim() !== '' &&
      parseFloat(formData.initialPrice) > 0 &&
      parseInt(formData.maxSupply) > 0 &&
      parseInt(formData.stepSize) > 0 &&
      (imageFile || imageUrl.trim() !== '')
    );
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4 shadow-md">
          <span className="text-3xl text-white">🚀</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create Your Coin
        </h2>
        <p className="text-gray-600 text-sm">
          Launch your token and build a community around your brand.
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
          <p className="text-red-700 font-medium text-sm">{error}</p>
        </div>
      )}
      {hash && (
        <div className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-xl shadow-sm">
          <p className="text-gray-800 font-medium text-sm">Transaction Hash: {hash}</p>
          <p className="text-gray-600 text-sm mt-1">Status: {status}</p>
        </div>
      )}
      {deployedCoinAddress && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
          <p className="text-gray-900 font-medium text-sm">Coin Address: {deployedCoinAddress}</p>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">Coin Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
              placeholder="e.g., My Coin"
              required
            />

            <label className="block text-sm font-semibold text-gray-700">Symbol *</label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
              placeholder="e.g., MAC"
              maxLength={10}
              required
            />

            <label className="block text-sm font-semibold text-gray-700">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white resize-none"
              placeholder="Describe your coin..."
              required
            />
          </div>

          {/* Image Section */}
          <div className="space-y-4">
            <div className="flex space-x-4 text-sm font-medium text-gray-700">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={useFileUpload}
                  onChange={() => setUseFileUpload(true)}
                  className="w-4 h-4 text-black border-gray-400"
                />
                <span>Upload File</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!useFileUpload}
                  onChange={() => setUseFileUpload(false)}
                  className="w-4 h-4 text-black border-gray-400"
                />
                <span>Image URL</span>
              </label>
            </div>
            {useFileUpload ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-black transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  required={!imageUrl}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-xl">📁</span>
                    </div>
                    <p className="text-gray-700 text-sm">Click to upload image</p>
                  </div>
                </label>
                {imageFile && (
                  <p className="mt-2 text-green-700 text-sm">✓ {imageFile.name} selected</p>
                )}
              </div>
            ) : (
              <input
                type="url"
                value={imageUrl}
                onChange={handleUrlChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
                placeholder="https://example.com/image.png"
                required={!imageFile}
              />
            )}
          </div>

          {/* Economic Section */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">Initial Price (ETH) *</label>
            <input
              type="number"
              name="initialPrice"
              value={formData.initialPrice}
              onChange={handleInputChange}
              step="0.001"
              min="0.001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
              required
            />

            <label className="block text-sm font-semibold text-gray-700">Max Supply *</label>
            <input
              type="number"
              name="maxSupply"
              value={formData.maxSupply}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
              required
            />

            <label className="block text-sm font-semibold text-gray-700">Step Size *</label>
            <input
              type="number"
              name="stepSize"
              value={formData.stepSize}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isDisabled || !isFormValid()}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${
              isDisabled || !isFormValid()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black hover:bg-gray-900'
            }`}
          >
            {status === 'pending' ? 'Creating Coin...' : 'Launch Your Coin 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}
