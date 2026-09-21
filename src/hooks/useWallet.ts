"use client";

import { useAccount, useBalance, useDisconnect, useConnect } from "wagmi";
import { formatEth, shortenAddress } from "@/lib/utils";
import { useNetworkEnforcer } from "./useNetworkEnforcer";
import { getExplorerUrl } from "@/config/chains";

export function useWallet() {
  const { address, isConnected, isConnecting, isReconnecting, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectAsync, connectors } = useConnect();
  const { isCorrectNetwork, targetChain, switchToRobinhoodChain, isSwitching, currentChainId } = useNetworkEnforcer();

  const { data: balanceData, isLoading: isLoadingBalance, refetch: refetchBalance } = useBalance({
    address,
    chainId: targetChain.id,
    query: {
      enabled: Boolean(address && isConnected),
      refetchInterval: 12000,
    },
  });

  const formattedBalance = balanceData ? formatEth(balanceData.formatted) : "0.00";
  const rawBalance = balanceData?.formatted || "0";
  const explorerAddressUrl = address ? getExplorerUrl("address", address, currentChainId || targetChain.id) : "#";

  return {
    address,
    shortAddress: shortenAddress(address),
    isConnected,
    isConnecting: isConnecting || isReconnecting,
    connectorName: connector?.name || "Injected",
    balance: formattedBalance,
    rawBalance,
    balanceSymbol: balanceData?.symbol || "ETH",
    isLoadingBalance,
    refetchBalance,
    disconnect,
    connectAsync,
    connectors,
    isCorrectNetwork,
    targetChain,
    currentChainId,
    switchToRobinhoodChain,
    isSwitching,
    explorerAddressUrl,
  };
}
