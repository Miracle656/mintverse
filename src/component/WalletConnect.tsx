import React from 'react';
import { usePrivy, useLogin } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import '../index.css';

const WalletConnect = () => {
  const { ready, authenticated, logout } = usePrivy();
  const { login } = useLogin();
  const { address } = useAccount();

  // Only disable button if Privy is not ready
  const isLoginDisabled = !ready;

  const handleLogin = () => {
    login({
      loginMethods: ['wallet', 'email'],
      walletChainType: 'ethereum-only',
      disableSignup: false,
    });
  };

  const handleButtonClick = () => {
    if (authenticated) {
      logout(); // Disconnect works now
    } else {
      handleLogin();
    }
  };

  const displayAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  return (
    <div className="flex items-center gap-3">
      {/* Status indicator */}
      {authenticated ? (
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-200">{displayAddress}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-400">Not Connected</span>
        </div>
      )}

      {/* Button */}
      <button
        disabled={isLoginDisabled}
        onClick={handleButtonClick}
        className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {authenticated ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
};

export default WalletConnect;
