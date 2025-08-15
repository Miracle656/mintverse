import React, { useState } from 'react';
// import { useTradeCoin } from '../hooks/useTradeCoin';
// import type { TradeParams } from '../hooks/useTradeCoin';

import type { Address } from "viem";
import { parseEther, createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { useAccount, useWalletClient, useWaitForTransactionReceipt } from "wagmi";
import { tradeCoin } from "@zoralabs/coins-sdk";
import type { TradeParameters } from "@zoralabs/coins-sdk"

export default function TradeCoin() {
  // const { executeTrade, status, isDisabled, hash, receipt, isTrading } = useTradeCoin();
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  // const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  // const [coinAddress, setCoinAddress] = useState('');
  // const [amount, setAmount] = useState('');
  // const [slippage, setSlippage] = useState('0.05');
  // const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isTrading, setIsTrading] = useState(false);
  const [receipt, setReceipt] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)


  // Public client for reads
  const publicClient = createPublicClient({
    chain: base,
    transport: http("https://mainnet.base.org")
  });


  const handleBuy = async () => {
    if (!isConnected || !walletClient) {
      setError("Wallet not connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tradeParameters: TradeParameters = {
        sell: { type: "eth" },
        buy: {
          type: "erc20",
          address: "0xaf7f538992c7f2e81a25556c3e3de7d049593ae7",
        },
        amountIn: parseEther("0.00001"),
        slippage: 0.05,
        sender: address,
      };

      const txReceipt = await tradeCoin({
        tradeParameters,
        walletClient, // Wagmi wallet client signs and sends the tx
        account: walletClient.account,
        publicClient: publicClient,
      });

      setReceipt(txReceipt);
      console.log(walletClient.account)
    } catch (err: any) {
      setError(err.message || "Trade failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async () => {
    if (!isConnected || !walletClient) {
      setError("Wallet not connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tradeParameters: TradeParameters = {
        sell: { 
          type: "erc20", 
          address: "0xaf7f538992c7f2e81a25556c3e3de7d049593ae7"
        },
        buy: {
          type: "eth",
        },
        amountIn: parseEther("30000"),
        slippage: 0.05,
        sender: address,
      };

      const txReceipt = await tradeCoin({
        tradeParameters,
        walletClient, // Wagmi wallet client signs and sends the tx
        account: walletClient.account,
        publicClient: publicClient,
      });

      setReceipt(txReceipt);
      console.log(walletClient.account)
    } catch (err: any) {
      setError(err.message || "Trade failed");
    } finally {
      setLoading(false);
    }
  }

  // const handleTrade = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');

  //   try {
  //     const tradeParams: TradeParams = {
  //       sellType: tradeType === 'buy' ? 'eth' : 'erc20',
  //       sellAddress: tradeType === 'sell' ? coinAddress : undefined,
  //       buyType: tradeType === 'buy' ? 'erc20' : 'eth',
  //       buyAddress: tradeType === 'buy' ? coinAddress : undefined,
  //       amountIn: amount,
  //       slippage: parseFloat(slippage),
  //     };

  //     await executeTrade(tradeParams);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'An error occurred');
  //   }
  // };

  return (
    <div className='text-black'>
      <h3>Trade</h3>
      <button className='text-white' onClick={handleBuy} disabled={loading}>
        {loading ? "Trading..." : "Trade 0.00001 ETH → Creator Coin"}
      </button>
      <div style={
        {
          margin: '1em'
        }
      }></div>
      <button className='text-white' onClick={handleSell} disabled={loading}>
        {loading ? "Trading..." : "Trade 30000 Creator Coin → ETH"}
      </button>

      {receipt && (
        <div>
          <h4>Transaction Successful!</h4>
          <pre>{JSON.stringify(receipt, null, 2)}</pre>
        </div>
      )}

      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>




































    // <div className="max-w-4xl mx-auto">
    //   {/* Header Section */}
    //   <div className="text-center mb-12">
    //     <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-6 shadow-xl">
    //       <span className="text-3xl text-white">💱</span>
    //     </div>
    //     <h2 className="text-4xl font-bold text-gray-800 mb-4">
    //       Trade Creator Coins
    //     </h2>
    //     <p className="text-lg text-gray-600 max-w-2xl mx-auto">
    //       Buy and sell creator coins instantly on Base Network. 
    //       Seamless trading with built-in slippage protection.
    //     </p>
    //   </div>

    //   {/* Status Messages */}
    //   {error && (
    //     <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl shadow-lg">
    //       <div className="flex items-center space-x-3">
    //         <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
    //           <span className="text-white text-sm">!</span>
    //         </div>
    //         <p className="text-red-700 font-medium">{error}</p>
    //       </div>
    //     </div>
    //   )}

    //   {hash && (
    //     <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl shadow-lg">
    //       <div className="flex items-center space-x-3 mb-3">
    //         <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
    //           <span className="text-white text-sm">✓</span>
    //         </div>
    //         <h3 className="text-blue-800 font-semibold">Trade Submitted!</h3>
    //       </div>
    //       <div className="bg-white/50 rounded-xl p-4">
    //         <p className="text-blue-700 text-sm font-mono break-all">Hash: {hash}</p>
    //         <p className="text-blue-600 text-sm mt-2">Status: {status}</p>
    //       </div>
    //     </div>
    //   )}

    //   {receipt && (
    //     <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl shadow-lg">
    //       <div className="flex items-center space-x-3 mb-3">
    //         <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
    //           <span className="text-white text-sm">🎉</span>
    //         </div>
    //         <h3 className="text-green-800 font-semibold">Trade Completed!</h3>
    //       </div>
    //       <div className="bg-white/50 rounded-xl p-4">
    //         <p className="text-green-700 text-sm">Transaction confirmed on Base network</p>
    //       </div>
    //     </div>
    //   )}

    //   {/* Main Trading Form */}
    //   <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
    //     <form onSubmit={handleTrade} className="space-y-8">
    //       {/* Trade Type Section */}
    //       <div className="space-y-6">
    //         <div className="flex items-center space-x-3 mb-6">
    //           <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
    //             <span className="text-white text-sm font-bold">1</span>
    //           </div>
    //           <h3 className="text-xl font-semibold text-gray-800">Trade Type</h3>
    //         </div>

    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //           <label className={`relative cursor-pointer transition-all duration-200 ${
    //             tradeType === 'buy' ? 'scale-105' : 'scale-100'
    //           }`}>
    //             <input
    //               type="radio"
    //               value="buy"
    //               checked={tradeType === 'buy'}
    //               onChange={(e) => setTradeType(e.target.value as 'buy' | 'sell')}
    //               className="sr-only"
    //             />
    //             <div className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
    //               tradeType === 'buy'
    //                 ? 'border-green-500 bg-green-50 shadow-lg'
    //                 : 'border-gray-200 bg-white/50 hover:border-gray-300'
    //             }`}>
    //               <div className="text-center">
    //                 <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
    //                   tradeType === 'buy' ? 'bg-green-500' : 'bg-gray-300'
    //                 }`}>
    //                   <span className="text-white text-xl">📈</span>
    //                 </div>
    //                 <h4 className="font-semibold text-gray-800 mb-2">Buy Coins</h4>
    //                 <p className="text-sm text-gray-600">Purchase creator coins with ETH</p>
    //               </div>
    //             </div>
    //           </label>

    //           <label className={`relative cursor-pointer transition-all duration-200 ${
    //             tradeType === 'sell' ? 'scale-105' : 'scale-100'
    //           }`}>
    //             <input
    //               type="radio"
    //               value="sell"
    //               checked={tradeType === 'sell'}
    //               onChange={(e) => setTradeType(e.target.value as 'buy' | 'sell')}
    //               className="sr-only"
    //             />
    //             <div className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
    //               tradeType === 'sell'
    //                 ? 'border-red-500 bg-red-50 shadow-lg'
    //                 : 'border-gray-200 bg-white/50 hover:border-gray-300'
    //             }`}>
    //               <div className="text-center">
    //                 <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
    //                   tradeType === 'sell' ? 'bg-red-500' : 'bg-gray-300'
    //                 }`}>
    //                   <span className="text-white text-xl">📉</span>
    //                 </div>
    //                 <h4 className="font-semibold text-gray-800 mb-2">Sell Coins</h4>
    //                 <p className="text-sm text-gray-600">Sell creator coins for ETH</p>
    //               </div>
    //             </div>
    //           </label>
    //         </div>
    //       </div>

    //       {/* Trading Details Section */}
    //       <div className="space-y-6">
    //         <div className="flex items-center space-x-3 mb-6">
    //           <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
    //             <span className="text-white text-sm font-bold">2</span>
    //           </div>
    //           <h3 className="text-xl font-semibold text-gray-800">Trading Details</h3>
    //         </div>

    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //           <div className="space-y-2">
    //             <label htmlFor="coinAddress" className="block text-sm font-semibold text-gray-700">
    //               Coin Contract Address *
    //             </label>
    //             <input
    //               type="text"
    //               id="coinAddress"
    //               value={coinAddress}
    //               onChange={(e) => setCoinAddress(e.target.value)}
    //               className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm font-mono text-sm"
    //               placeholder="0x..."
    //               required
    //             />
    //           </div>

    //           <div className="space-y-2">
    //             <label htmlFor="amount" className="block text-sm font-semibold text-gray-700">
    //               Amount {tradeType === 'buy' ? '(ETH)' : '(Tokens)'} *
    //             </label>
    //             <div className="relative">
    //               <input
    //                 type="number"
    //                 id="amount"
    //                 value={amount}
    //                 onChange={(e) => setAmount(e.target.value)}
    //                 step="0.001"
    //                 min="0.001"
    //                 className="w-full px-4 py-3 pr-16 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
    //                 required
    //               />
    //               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
    //                 <span className="text-gray-500 text-sm font-medium">
    //                   {tradeType === 'buy' ? 'ETH' : 'TOKENS'}
    //                 </span>
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="space-y-2">
    //           <label htmlFor="slippage" className="block text-sm font-semibold text-gray-700">
    //             Slippage Tolerance
    //           </label>
    //           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    //             {['0.01', '0.05', '0.10', '0.15'].map((value) => (
    //               <label key={value} className="cursor-pointer">
    //                 <input
    //                   type="radio"
    //                   value={value}
    //                   checked={slippage === value}
    //                   onChange={(e) => setSlippage(e.target.value)}
    //                   className="sr-only"
    //                 />
    //                 <div className={`p-3 rounded-xl text-center transition-all duration-200 ${
    //                   slippage === value
    //                     ? 'bg-blue-500 text-white shadow-lg'
    //                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    //                 }`}>
    //                   <span className="text-sm font-medium">{parseFloat(value) * 100}%</span>
    //                 </div>
    //               </label>
    //             ))}
    //           </div>
    //         </div>
    //       </div>

    //       {/* Submit Button */}
    //       <div className="pt-6">
    //         <button
    //           type="submit"
    //           disabled={isDisabled}
    //           className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
    //             isDisabled
    //               ? 'bg-gray-300 cursor-not-allowed text-gray-500'
    //               : tradeType === 'buy'
    //                 ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
    //                 : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
    //           }`}
    //         >
    //           {isTrading ? (
    //             <div className="flex items-center justify-center space-x-3">
    //               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    //               <span>Processing Trade...</span>
    //             </div>
    //           ) : (
    //             <div className="flex items-center justify-center space-x-3">
    //               <span>{tradeType === 'buy' ? '📈' : '📉'}</span>
    //               <span>{tradeType === 'buy' ? 'Buy' : 'Sell'} Coins</span>
    //             </div>
    //           )}
    //         </button>
    //       </div>
    //     </form>
    //   </div>

    //   {/* Trading Info Section */}
    //   <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 shadow-xl border border-green-100">
    //     <div className="text-center mb-6">
    //       <h3 className="text-2xl font-bold text-gray-800 mb-2">Trading Features</h3>
    //       <p className="text-gray-600">Everything you need to know about trading</p>
    //     </div>
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    //       <div className="text-center p-4">
    //         <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
    //           <span className="text-white text-lg">⚡</span>
    //         </div>
    //         <h4 className="font-semibold text-gray-800 mb-2">Instant Trading</h4>
    //         <p className="text-sm text-gray-600">Buy and sell coins instantly</p>
    //       </div>
    //       <div className="text-center p-4">
    //         <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
    //           <span className="text-white text-lg">🛡️</span>
    //         </div>
    //         <h4 className="font-semibold text-gray-800 mb-2">Slippage Protection</h4>
    //         <p className="text-sm text-gray-600">Customizable protection levels</p>
    //       </div>
    //       <div className="text-center p-4">
    //         <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
    //           <span className="text-white text-lg">🔗</span>
    //         </div>
    //         <h4 className="font-semibold text-gray-800 mb-2">Base Network</h4>
    //         <p className="text-sm text-gray-600">Fast and low-cost transactions</p>
    //       </div>
    //       <div className="text-center p-4">
    //         <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
    //           <span className="text-white text-lg">💎</span>
    //         </div>
    //         <h4 className="font-semibold text-gray-800 mb-2">ETH Pairs</h4>
    //         <p className="text-sm text-gray-600">Trade directly with ETH</p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
