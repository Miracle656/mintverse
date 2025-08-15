import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { useTradeCoin } from '../hooks/useTradeCoin';
import { useContent } from '../hooks/useContent';
import type { Content } from '../types';
import toast from 'react-hot-toast';

interface TradeModalProps {
  content: Content;
  onClose: () => void;
}

export default function TradeModal({ content, onClose }: TradeModalProps) {
  const { buyCreatorCoin, sellCreatorCoin, loading, error } = useTradeCoin();
  const { purchaseContent } = useContent();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState(content.price_eth.toString());

  const handleTrade = async () => {
    if (!content.coin_address) {
      toast.error('Coin address not available');
      return;
    }

    try {
      let result;
      if (tradeType === 'buy') {
        result = await buyCreatorCoin(content.coin_address, amount);
        
        // Record the purchase
        if (result?.transactionHash) {
          await purchaseContent(
            content.id,
            result.transactionHash,
            parseFloat(amount)
          );
        }
        
        toast.success('Successfully purchased content access!');
      } else {
        result = await sellCreatorCoin(content.coin_address, amount);
        toast.success('Successfully sold creator coins!');
      }
      
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Trade failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Trade Creator Coin
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-1">{content.title}</h3>
          <p className="text-sm text-gray-600">
            By {content.creator?.username || 'Anonymous'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Price: {content.price_eth} ETH
          </p>
        </div>

        {/* Trade Type Selection */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTradeType('buy')}
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                tradeType === 'buy'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <TrendingUp size={20} />
              <span className="font-medium">Buy Access</span>
            </button>
            
            <button
              onClick={() => setTradeType('sell')}
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                tradeType === 'sell'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <TrendingDown size={20} />
              <span className="font-medium">Sell Coins</span>
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount {tradeType === 'buy' ? '(ETH)' : '(Tokens)'}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.001"
            min="0.001"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder={tradeType === 'buy' ? '0.001' : '1000'}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleTrade}
            disabled={loading || !amount || parseFloat(amount) <= 0}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              tradeType === 'buy'
                ? 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300'
                : 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <span>{tradeType === 'buy' ? 'Buy Access' : 'Sell Coins'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}