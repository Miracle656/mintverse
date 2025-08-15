import React from 'react';
import { useCreateCoin } from '../hooks/useCreateCoin';

const CreateCoins = () => {
  const { 
    createMyCoin, 
    status, 
    isDisabled, 
    hash, 
    receipt, 
    deployedCoinAddress 
  } = useCreateCoin();

  const getButtonText = () => {
    switch (status) {
      case 'pending':
        return 'Creating...';
      case 'success':
        return 'Coin Created!';
      case 'error':
        return 'Error - Try Again';
      default:
        return 'Create Coin';
    }
  };

  return (
    <div>
      <button 
        onClick={createMyCoin} 
        disabled={isDisabled}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        {getButtonText()}
      </button>

      {/* Show transaction hash when available */}
      {hash && (
        <p>Transaction Hash: {hash}</p>
      )}

      {/* Show status */}
      <p>Status: {status}</p>

      {/* Show deployed coin address when available */}
      {deployedCoinAddress && (
        <p>Deployed Coin Address: {deployedCoinAddress}</p>
      )}

      {/* Show receipt details */}
      {receipt && (
        <div>
          <p>Transaction confirmed!</p>
          <p>Block Number: {receipt.blockNumber}</p>
          <p>Gas Used: {receipt.gasUsed?.toString()}</p>
        </div>
      )}

      {/* Debug info */}
      <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
        <p>Debug Info:</p>
        <p>Status: {status}</p>
        <p>Hash: {hash || 'None'}</p>
        <p>Disabled: {isDisabled ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default CreateCoins;