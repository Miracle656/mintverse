import { useState } from 'react'
import './App.css'
import WalletConnect from './component/WalletConnect'
import Providers from './providers'
import CreateCoinForm from './component/CreateCoinForm'
import TradeCoin from './component/TradeCoin'

function App() {
  const [activeTab, setActiveTab] = useState<'create' | 'trade'>('create')

  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-xl">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-5xl font-bold text-center text-white mb-4 tracking-tight">
              MintVerse
            </h1>
            <p className="text-center text-blue-100 text-lg font-medium">
              Creator Coins Platform
            </p>
            <p className="text-center text-blue-200 text-sm mt-2">
              Launch your own token economy on Base Network
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-6 py-12">
          {/* Wallet Connection */}
          <div className="mb-12">
            <WalletConnect />
          </div>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 transform ${
                  activeTab === 'create'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                ✨ Create Coin
              </button>
              <button
                onClick={() => setActiveTab('trade')}
                className={`px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 transform ${
                  activeTab === 'trade'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                💱 Trade Coins
              </button>
            </div>
          </div>

          {/* Tab Content with smooth transitions */}
          <div className="mb-12 transition-all duration-500 ease-in-out">
            <div className={`transform transition-all duration-500 ${
              activeTab === 'create' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {activeTab === 'create' && <CreateCoinForm />}
            </div>
            <div className={`transform transition-all duration-500 ${
              activeTab === 'trade' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {activeTab === 'trade' && <TradeCoin />}
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-6 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-xl border border-white/20">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Base Network</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Zora Protocol</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Providers>
  )
}

export default App
