import { useState } from "react";
import { createCoin, getCoinCreateFromLogs, setApiKey } from "@zoralabs/coins-sdk";
import type { ValidMetadataURI } from "@zoralabs/coins-sdk";
import type { Address } from "viem";
import { parseEther, createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { useAccount, useWalletClient, useWaitForTransactionReceipt } from "wagmi";

setApiKey(import.meta.env.VITE_ZORA_API_KEY);

// Validate environment variables
if (!import.meta.env.VITE_ZORA_API_KEY) {
  console.warn("VITE_ZORA_API_KEY is not set. Coin creation may fail.");
}

export interface CoinCreationParams {
  name: string;
  symbol: string;
  description: string;
  image?: File;
  imageUrl?: string;
  initialPrice: string;
  maxSupply: string;
  stepSize: string;
}

export function useCreateCoin() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [isCreating, setIsCreating] = useState(false);

  // Public client for reads
  const publicClient = createPublicClient({
    chain: base,
    transport: http("https://mainnet.base.org")
  });

  const createMyCoin = async (params: CoinCreationParams) => {
    if (!address || !walletClient) {
      console.error("No wallet connected");
      return;
    }

    setIsCreating(true);
    try {
      console.log("Starting coin creation with params:", params);
      console.log("Wallet client:", walletClient);
      console.log("Network ID:", base.id);
      console.log("Public client chain:", publicClient.chain);
      console.log("Zora API Key set:", !!import.meta.env.VITE_ZORA_API_KEY);
      
      // Check if we're on the correct network
      const network = await publicClient.getChainId();
      console.log("Current network ID:", network);
      
      if (network !== base.id) {
        throw new Error(`Wrong network. Expected ${base.id}, got ${network}`);
      }
      
      // Test basic connectivity
      try {
        const blockNumber = await publicClient.getBlockNumber();
        console.log("Current block number:", blockNumber);
      } catch (connError) {
        console.error("Connection test failed:", connError);
        throw new Error("Failed to connect to Base network");
      }

      // Create basic coin parameters
      const coinParams = {
        name: params.name,
        symbol: params.symbol,
        creator: address as Address,
        metadata: {
          name: params.name,
          symbol: params.symbol,
          uri: (params.imageUrl || "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy") as ValidMetadataURI,
          type: "RAW_URI" as const,
        },
        payoutRecipient: address as Address,
        chainId: base.id,
        currency: "ZORA" as const,
        initialPurchase: {
          currency: "ETH" as const,
          amount: parseEther(params.initialPrice),
        },
        maxSupply: BigInt(params.maxSupply),
        initialPrice: parseEther(params.initialPrice),
        stepSize: BigInt(params.stepSize),
      };

      console.log("Final coin params:", coinParams);
      
      // Create the coin using the Zora SDK
      const result = await createCoin({
        call: coinParams,
        walletClient,
        publicClient,
      });
      
      console.log("Coin creation result:", result);
      
      if (result.hash) {
        console.log("Transaction hash:", result.hash);
        setHash(result.hash);
        return result;
      } else {
        throw new Error("No transaction hash returned from coin creation");
      }
    } catch (error) {
      console.error("Error creating coin:", error);
      
      // Log additional error details
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      
      // Check if it's a contract error
      if (error && typeof error === 'object' && 'cause' in error) {
        console.error("Error cause:", error.cause);
      }
      
      setIsCreating(false);
      throw error;
    }
  };

  // Only wait for transaction receipt when we have a hash
  const { data: receipt, status } = useWaitForTransactionReceipt({
    hash,
    chainId: base.id,
  });

  const deployedCoinAddress = receipt ? getCoinCreateFromLogs(receipt)?.coin : undefined;

  // Determine the actual status
  const actualStatus = hash ? status : isCreating ? 'pending' : 'idle';

  return {
    createMyCoin,
    status: actualStatus,
    isDisabled: !address || !walletClient || isCreating,
    hash,
    receipt,
    deployedCoinAddress,
  };
}
