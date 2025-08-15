import type {PrivyClientConfig} from '@privy-io/react-auth';
import { base } from 'viem/chains';

// Privy configuration to avoid WalletConnect conflicts
export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: true,
    showWalletUIs: true
  },
  loginMethods: ['wallet', 'email'],
  appearance: {
    showWalletLoginFirst: true
  },
  // Add specific wallet configurations to avoid conflicts
  defaultChain: base,
  supportedChains: [base], // Only support Base
};