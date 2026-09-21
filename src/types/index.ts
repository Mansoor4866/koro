export interface UserProfile {
  id: string;
  walletAddress: string;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
  createdAt: string;
}

export interface SquareData {
  id: number;
  row: number;
  col: number;
  ownerAddress: string;
  owner?: UserProfile | null;
  currentPriceEth: string;
  depositEth: string;
  dailyCarryRate: number;
  isForSale: boolean;
  isLeased: boolean;
  leaseExpiry: string | null;
  leasedByAddress: string | null;
  headline: string | null;
  bodyText: string | null;
  linkUrl: string | null;
  imageUrl: string | null;
  category: string;
  accentColor: string;
  lastPurchasedAt: string | null;
  updatedAt: string;
}

export interface PostItem {
  id: string;
  squareId: number | null;
  authorAddress: string;
  author?: UserProfile;
  title: string;
  content: string;
  category: string;
  linkUrl: string | null;
  mediaUrl: string | null;
  blockchainTxHash: string | null;
  chainId: number;
  status: "PENDING" | "CONFIRMING" | "CONFIRMED" | "FAILED";
  likesCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityEvent {
  id: string;
  userAddress: string;
  squareId: number | null;
  action: "BOUGHT_SQUARE" | "POSTED_UPDATE" | "CHANGED_PRICE" | "DEPOSITED_CARRY" | "LEASED_SLOT";
  description: string;
  metadata?: string | null;
  txHash?: string | null;
  createdAt: string;
}

export interface EIP6963ProviderDetail {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns: string;
  };
  provider: any;
}

export type AppTab = "board" | "feed" | "market" | "stats" | "profile";
