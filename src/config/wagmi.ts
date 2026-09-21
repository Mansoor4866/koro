import { http, createConfig, cookieStorage, createStorage } from "wagmi";
import { robinhoodChain, robinhoodTestnet } from "./chains";
import { injected, walletConnect } from "wagmi/connectors";

export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6";

export const wagmiConfig = createConfig({
  chains: [robinhoodChain, robinhoodTestnet],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    walletConnect({
      projectId,
      showQrModal: true,
      metadata: {
        name: "KORO",
        description: "Decentralized 256-Square Broadsheet & Matrix on Robinhood Chain",
        url: "https://koro.xyz",
        icons: ["https://koro.xyz/favicon.ico"],
      },
    }),
  ],
  transports: {
    [robinhoodChain.id]: http(
      process.env.NEXT_PUBLIC_ROBINHOOD_CHAIN_RPC || "https://rpc.mainnet.chain.robinhood.com",
      { retryCount: 2 }
    ),
    [robinhoodTestnet.id]: http(
      process.env.NEXT_PUBLIC_ROBINHOOD_TESTNET_RPC || "https://rpc.testnet.chain.robinhood.com",
      { retryCount: 2 }
    ),
  },
});
