"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { robinhoodChain, robinhoodTestnet } from "@/config/chains";
import { useState, useCallback } from "react";

export function useNetworkEnforcer() {
  const { chainId, isConnected } = useAccount();
  const { switchChainAsync, isPending } = useSwitchChain();
  const [error, setError] = useState<string | null>(null);

  const targetChain = Number(process.env.NEXT_PUBLIC_ROBINHOOD_CHAIN_ID) === 46630 ? robinhoodTestnet : robinhoodChain;
  const isCorrectNetwork = isConnected ? chainId === targetChain.id : true;

  const switchToRobinhoodChain = useCallback(async () => {
    setError(null);
    try {
      if (switchChainAsync) {
        await switchChainAsync({ chainId: targetChain.id });
        return true;
      }

      // Fallback via window.ethereum directly if needed
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const eth = (window as any).ethereum;
        try {
          await eth.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${targetChain.id.toString(16)}` }],
          });
          return true;
        } catch (switchErr: any) {
          // Chain not added error (4902)
          if (switchErr.code === 4902 || switchErr.message?.includes("Unrecognized chain")) {
            await eth.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${targetChain.id.toString(16)}`,
                  chainName: targetChain.name,
                  nativeCurrency: targetChain.nativeCurrency,
                  rpcUrls: targetChain.rpcUrls.default.http,
                  blockExplorerUrls: targetChain.blockExplorers
                    ? [targetChain.blockExplorers.default.url]
                    : [],
                },
              ],
            });
            return true;
          }
          throw switchErr;
        }
      }
    } catch (err: any) {
      console.error("Network switch failed:", err);
      if (err.code === 4001 || err.message?.includes("User rejected")) {
        setError("Network switch was cancelled by user.");
      } else {
        setError(err.message || "Failed to switch to Robinhood Chain.");
      }
      return false;
    }
  }, [switchChainAsync, targetChain]);

  return {
    isCorrectNetwork,
    currentChainId: chainId,
    targetChain,
    switchToRobinhoodChain,
    isSwitching: isPending,
    switchError: error,
  };
}
