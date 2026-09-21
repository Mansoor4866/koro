"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppTab, SquareData, PostItem, ActivityEvent } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MatrixBoard } from "@/components/board/MatrixBoard";
import { SquareDetailDrawer } from "@/components/board/SquareDetailDrawer";
import { ActivityFeed } from "@/components/feed/ActivityFeed";
import { MarketplaceView } from "@/components/market/MarketplaceView";
import { ProtocolStats } from "@/components/stats/ProtocolStats";
import { UserProfileView } from "@/components/profile/UserProfileView";
import { ConnectWalletModal } from "@/components/wallet/ConnectWalletModal";
import { WalletDetailsModal } from "@/components/wallet/WalletDetailsModal";
import { CreatePostModal } from "@/components/posts/CreatePostModal";
import { NetworkSwitchDialog } from "@/components/wallet/NetworkSwitchDialog";
import { Sparkles } from "lucide-react";

export default function Home() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<AppTab>("board");
  const [selectedSquare, setSelectedSquare] = useState<SquareData | null>(null);

  // Modals state
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isWalletDetailsOpen, setIsWalletDetailsOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  // 1. Fetch 256 Squares
  const { data: squaresData, isLoading: isLoadingSquares, refetch: refetchSquares } = useQuery<{
    squares: SquareData[];
    total: number;
  }>({
    queryKey: ["squares"],
    queryFn: async () => {
      const res = await fetch("/api/squares");
      if (!res.ok) throw new Error("Failed to fetch squares");
      return res.json();
    },
    refetchInterval: 12000,
  });

  // 2. Fetch Posts Feed
  const { data: postsData, isLoading: isLoadingPosts, refetch: refetchPosts } = useQuery<{
    posts: PostItem[];
  }>({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("/api/posts?limit=30");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
    refetchInterval: 10000,
  });

  // 3. Fetch Activity Tape
  const { data: activityData, refetch: refetchActivity } = useQuery<{
    activities: ActivityEvent[];
  }>({
    queryKey: ["activity"],
    queryFn: async () => {
      const res = await fetch("/api/activity?limit=30");
      if (!res.ok) throw new Error("Failed to fetch activities");
      return res.json();
    },
    refetchInterval: 8000,
  });

  // 4. Fetch Stats
  const { data: statsData } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    refetchInterval: 15000,
  });

  const squares = squaresData?.squares || [];
  const posts = postsData?.posts || [];
  const activities = activityData?.activities || [];

  const handleRefreshAll = () => {
    refetchSquares();
    refetchPosts();
    refetchActivity();
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50 dark:bg-[#080B10] text-slate-900 dark:text-[#F3F4F6]">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-[#00E599]/15 via-[#06B6D4]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#00E599]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenConnectModal={() => setIsConnectOpen(true)}
        onOpenWalletDetails={() => setIsWalletDetailsOpen(true)}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Protocol Ticker */}
        <section className="mb-8 p-6 rounded-3xl glass-panel-glow border border-slate-200 dark:border-[#00E599]/25 relative overflow-hidden shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#00E599]/20 text-[#059669] dark:text-[#00E599] border border-[#00E599]/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Robinhood Chain Mainnet · 4663
                </span>
                <span className="text-[11px] font-mono text-slate-600 dark:text-gray-400">
                  256 / 256 Slots Live
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Decentralized Broadsheet & Matrix Board
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1 max-w-2xl leading-relaxed font-medium">
                Every square is owned, priced by its own holder through Harberger valuation, and continuously available for on-chain acquisition.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-4 bg-slate-100/90 dark:bg-white/[0.03] p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 font-mono text-xs shadow-sm">
              <div>
                <span className="text-[10px] uppercase text-slate-500 dark:text-gray-400 block font-sans font-bold">Floor</span>
                <span className="text-sm font-bold text-[#059669] dark:text-[#00E599]">
                  {statsData?.floorPriceEth || "0.02"} ETH
                </span>
              </div>
              <div className="w-[1px] h-8 bg-slate-300 dark:bg-white/10" />
              <div>
                <span className="text-[10px] uppercase text-slate-500 dark:text-gray-400 block font-sans font-bold">Total Vol</span>
                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                  {statsData?.totalAssessedEth || "18.4"} ETH
                </span>
              </div>
              <div className="w-[1px] h-8 bg-slate-300 dark:bg-white/10" />
              <div>
                <span className="text-[10px] uppercase text-slate-500 dark:text-gray-400 block font-sans font-bold">Carry Tax</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">1.0% / d</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Views */}
        {activeTab === "board" && (
          <MatrixBoard
            squares={squares}
            onSelectSquare={(sq) => setSelectedSquare(sq)}
            selectedSquareId={selectedSquare?.id}
            isLoading={isLoadingSquares}
          />
        )}

        {activeTab === "feed" && (
          <ActivityFeed
            posts={posts}
            activities={activities}
            onRefresh={handleRefreshAll}
            isLoading={isLoadingPosts}
          />
        )}

        {activeTab === "market" && (
          <MarketplaceView
            squares={squares}
            onSelectSquare={(sq) => setSelectedSquare(sq)}
          />
        )}

        {activeTab === "stats" && <ProtocolStats stats={statsData} />}

        {activeTab === "profile" && (
          <UserProfileView
            squares={squares}
            posts={posts}
            onSelectSquare={(sq) => setSelectedSquare(sq)}
            onOpenConnectModal={() => setIsConnectOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <ConnectWalletModal
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
      />

      <WalletDetailsModal
        isOpen={isWalletDetailsOpen}
        onClose={() => setIsWalletDetailsOpen(false)}
      />

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSuccess={handleRefreshAll}
      />

      <SquareDetailDrawer
        square={selectedSquare}
        onClose={() => setSelectedSquare(null)}
        onRefresh={handleRefreshAll}
      />

      <NetworkSwitchDialog />
    </div>
  );
}
