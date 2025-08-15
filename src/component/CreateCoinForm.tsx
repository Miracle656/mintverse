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
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-xl">
          <span className="text-3xl text-white">🚀</span>
        </div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Create Your Creator Coin
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Launch your own token economy and build a community around your brand. 
          Your coin will be instantly tradeable on Base Network.
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">!</span>
            </div>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {hash && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <h3 className="text-blue-800 font-semibold">Transaction Submitted!</h3>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-blue-700 text-sm font-mono break-all">Hash: {hash}</p>
            <p className="text-blue-600 text-sm mt-2">Status: {status}</p>
          </div>
        </div>
      )}

      {deployedCoinAddress && (
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🎉</span>
            </div>
            <h3 className="text-green-800 font-semibold">Coin Created Successfully!</h3>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-green-700 text-sm font-mono break-all">Address: {deployedCoinAddress}</p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                  Coin Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black bg-white/50 backdrop-blur-sm"
                  placeholder="e.g., My Awesome Coin"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="symbol" className="block text-sm font-semibold text-gray-700">
                  Symbol *
                </label>
                <input
                  type="text"
                  id="symbol"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black bg-white/50 backdrop-blur-sm"
                  placeholder="e.g., MAC"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-black backdrop-blur-sm resize-none"
                placeholder="Describe your coin and what it represents..."
                required
              />
            </div>
          </div>

          {/* Image Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Coin Image</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={useFileUpload}
                    onChange={() => setUseFileUpload(true)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">Upload File</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={!useFileUpload}
                    onChange={() => setUseFileUpload(false)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">Image URL</span>
                </label>
              </div>

              {useFileUpload ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    required={!imageUrl}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-2xl">📁</span>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700">Click to upload image</p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </label>
                  {imageFile && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-green-700 text-sm">✓ {imageFile.name} selected</p>
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="url"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black bg-white/50 backdrop-blur-sm"
                  placeholder="https://example.com/image.png"
                  required={!imageFile}
                />
              )}
            </div>
          </div>

          {/* Economic Parameters Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Economic Parameters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="initialPrice" className="block text-sm font-semibold text-gray-700">
                  Initial Price (ETH) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="initialPrice"
                    name="initialPrice"
                    value={formData.initialPrice}
                    onChange={handleInputChange}
                    step="0.001"
                    min="0.001"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black bg-white/50 backdrop-blur-sm"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">ETH</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="maxSupply" className="block text-sm font-semibold text-gray-700">
                  Max Supply *
                </label>
                <input
                  type="number"
                  id="maxSupply"
                  name="maxSupply"
                  value={formData.maxSupply}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black bg-white/50 backdrop-blur-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="stepSize" className="block text-sm font-semibold text-gray-700">
                  Step Size *
                </label>
                <input
                  type="number"
                  id="stepSize"
                  name="stepSize"
                  value={formData.stepSize}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black bg-white/50 backdrop-blur-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isDisabled || !isFormValid()}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                isDisabled || !isFormValid()
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {status === 'pending' ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Coin...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <span>🚀</span>
                  <span>Launch Your Coin</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-blue-100">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">How it works</h3>
          <p className="text-gray-600">Your journey to launching a creator coin</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-lg">1</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Deploy on Base</h4>
            <p className="text-sm text-gray-600">Your coin will be deployed on Base network</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-lg">2</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Instant Trading</h4>
            <p className="text-sm text-gray-600">Users can buy/sell your coin with ETH</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-lg">3</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Earn Revenue</h4>
            <p className="text-sm text-gray-600">You'll receive ETH from sales</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-lg">4</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Build Community</h4>
            <p className="text-sm text-gray-600">Grow your token economy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
