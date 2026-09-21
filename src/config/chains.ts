import { defineChain } from "viem";

export const robinhoodChain = defineChain({
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_ROBINHOOD_CHAIN_RPC || "https://rpc.mainnet.chain.robinhood.com",
      ],
    },
    public: {
      http: [
        process.env.NEXT_PUBLIC_ROBINHOOD_CHAIN_RPC || "https://rpc.mainnet.chain.robinhood.com",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Robinhood Chain Explorer",
      url: "https://robinhoodchain.blockscout.com",
      apiUrl: "https://robinhoodchain.blockscout.com/api",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 1,
    },
  },
  testnet: false,
});

export const robinhoodTestnet = defineChain({
  id: 46630,
  name: "Robinhood Chain Testnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_ROBINHOOD_TESTNET_RPC || "https://rpc.testnet.chain.robinhood.com",
      ],
    },
    public: {
      http: [
        process.env.NEXT_PUBLIC_ROBINHOOD_TESTNET_RPC || "https://rpc.testnet.chain.robinhood.com",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Robinhood Testnet Explorer",
      url: "https://testnet.robinhoodchain.blockscout.com",
    },
  },
  testnet: true,
});

export const supportedChains = [robinhoodChain, robinhoodTestnet] as const;

export const DEFAULT_CHAIN_ID = Number(process.env.NEXT_PUBLIC_ROBINHOOD_CHAIN_ID) || 4663;

export function getChainById(chainId?: number) {
  return supportedChains.find((c) => c.id === chainId) || robinhoodChain;
}

export function getExplorerUrl(
  type: "address" | "tx" | "token" | "block",
  value: string,
  chainId: number = 4663
) {
  const chain = getChainById(chainId);
  const baseUrl = chain.blockExplorers?.default.url || "https://robinhoodchain.blockscout.com";
  
  switch (type) {
    case "address":
      return `${baseUrl}/address/${value}`;
    case "tx":
      return `${baseUrl}/tx/${value}`;
    case "token":
      return `${baseUrl}/token/${value}`;
    case "block":
      return `${baseUrl}/block/${value}`;
    default:
      return baseUrl;
  }
}
