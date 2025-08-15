import { useState } from "react";
import type { Address } from "viem";
import { parseEther, createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";
import { tradeCoin } from "@zoralabs/coins-sdk";
import type { TradeParameters } from "@zoralabs/coins-sdk";

export function useTradeCoin() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const publicClient = createPublicClient({
    chain: base,
    transport: http("https://mainnet.base.org"),
  });

  async function buyCreatorCoin(coinAddress: string, ethAmount: string) {
    if (!isConnected || !walletClient || !address) {
      throw new Error("Wallet not connected");
    }
    try {
      setLoading(true);
      setError(null);
      setReceipt(null);

      const tradeParameters: TradeParameters = {
        sell: { type: "eth" },
        buy: {
          type: "erc20",
          address: coinAddress as Address,
        },
        amountIn: parseEther(ethAmount),
        slippage: 0.05,
        sender: address,
      };

      const txReceipt = await tradeCoin({
        tradeParameters,
        walletClient,
        account: walletClient.account,
        publicClient,
      });

      setReceipt(txReceipt);
      return txReceipt;
    } catch (err: any) {
      const errorMessage = err.message || "Trade failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function sellCreatorCoin(coinAddress: string, tokenAmount: string) {
    if (!isConnected || !walletClient || !address) {
      throw new Error("Wallet not connected");
    }
    try {
      setLoading(true);
      setError(null);
      setReceipt(null);

      const tradeParameters: TradeParameters = {
        sell: {
          type: "erc20",
          address: coinAddress as Address,
        },
        buy: { type: "eth" },
        amountIn: parseEther(tokenAmount),
        slippage: 0.05,
        sender: address,
      };

      const txReceipt = await tradeCoin({
        tradeParameters,
        walletClient,
        account: walletClient.account,
        publicClient,
      });

      setReceipt(txReceipt);
      return txReceipt;
    } catch (err: any) {
      const errorMessage = err.message || "Trade failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    buyCreatorCoin,
    sellCreatorCoin,
    loading,
    receipt,
    error,
    isDisabled: !address || !walletClient || loading,
  };
}
