"use client";

import React from "react";
import { AppTab } from "@/types";
import { useWallet } from "@/hooks/useWallet";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Grid, Radio, Store, BarChart3, User, PlusCircle, Sparkles, Sun, Moon } from "lucide-react";

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onOpenConnectModal: () => void;
  onOpenWalletDetails: () => void;
  onOpenCreatePost: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenConnectModal,
  onOpenWalletDetails,
  onOpenCreatePost,
}: NavbarProps) {
  const { isConnected, shortAddress, balance, isCorrectNetwork, targetChain, isConnecting } = useWallet();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("board")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00E599] via-[#06B6D4] to-emerald-400 p-[1px] shadow-[0_0_20px_rgba(0,229,153,0.3)]">
            <div className="w-full h-full bg-[#080B10] dark:bg-[#080B10] rounded-[11px] flex items-center justify-center">
              <Grid className="w-5 h-5 text-[#00E599]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wider text-slate-900 dark:text-white">KORO</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest bg-[#00E599]/20 text-[#059669] dark:text-[#00E599] border border-[#00E599]/40">
                v2.0
              </span>
            </div>
            <p className="text-[10px] opacity-60 font-mono tracking-tight text-slate-600 dark:text-gray-400">Robinhood Chain Matrix</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-2xs">
          <button
            onClick={() => setActiveTab("board")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === "board"
                ? "bg-[#00E599]/20 text-emerald-800 dark:text-[#00E599] border border-[#00E599]/40 shadow-xs"
                : "text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>The Board</span>
          </button>

          <button
            onClick={() => setActiveTab("feed")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === "feed"
                ? "bg-[#00E599]/20 text-emerald-800 dark:text-[#00E599] border border-[#00E599]/40 shadow-xs"
                : "text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>The Tape</span>
          </button>

          <button
            onClick={() => setActiveTab("market")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === "market"
                ? "bg-[#00E599]/20 text-emerald-800 dark:text-[#00E599] border border-[#00E599]/40 shadow-xs"
                : "text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>The Pit</span>
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === "stats"
                ? "bg-[#00E599]/20 text-emerald-800 dark:text-[#00E599] border border-[#00E599]/40 shadow-xs"
                : "text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>The Floor</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === "profile"
                ? "bg-[#00E599]/20 text-emerald-800 dark:text-[#00E599] border border-[#00E599]/40 shadow-xs"
                : "text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Portfolio</span>
          </button>
        </nav>

        {/* Right Actions: Theme toggle + Network badge + Post + Wallet Button */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Robinhood Network Badge */}
          <div
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium font-mono ${
              isCorrectNetwork
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300"
                : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-300"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${isCorrectNetwork ? "bg-[#00E599]" : "bg-amber-400 animate-ping"}`}
            />
            <span>{targetChain.name}</span>
          </div>

          {/* Create Post Button */}
          <button
            onClick={onOpenCreatePost}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-xs font-semibold transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#00E599]" />
            <span>Broadcast</span>
          </button>

          {/* Wallet Button */}
          {!isConnected ? (
            <button
              onClick={onOpenConnectModal}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E599] to-emerald-400 hover:opacity-90 text-black text-xs font-bold transition shadow-[0_0_15px_rgba(0,229,153,0.3)] disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          ) : (
            <button
              onClick={onOpenWalletDetails}
              className="flex items-center gap-2.5 p-1.5 pl-3 rounded-xl glass-card hover:border-[#00E599]/40 text-xs transition border border-black/10 dark:border-white/10"
            >
              <span className="font-mono opacity-80 text-[11px] hidden sm:inline">
                {balance} ETH
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00E599]/20 text-[#00E599] font-mono font-bold border border-[#00E599]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E599]" />
                <span>{shortAddress}</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden items-center justify-around p-2 border-t border-black/5 dark:border-white/5 bg-white dark:bg-[#0A0E16]">
        <button
          onClick={() => setActiveTab("board")}
          className={`p-2 rounded-lg text-xs flex flex-col items-center gap-1 ${
            activeTab === "board" ? "text-[#00E599]" : "opacity-60"
          }`}
        >
          <Grid className="w-4 h-4" />
          <span className="text-[10px]">Board</span>
        </button>
        <button
          onClick={() => setActiveTab("feed")}
          className={`p-2 rounded-lg text-xs flex flex-col items-center gap-1 ${
            activeTab === "feed" ? "text-[#00E599]" : "opacity-60"
          }`}
        >
          <Radio className="w-4 h-4" />
          <span className="text-[10px]">Tape</span>
        </button>
        <button
          onClick={() => setActiveTab("market")}
          className={`p-2 rounded-lg text-xs flex flex-col items-center gap-1 ${
            activeTab === "market" ? "text-[#00E599]" : "opacity-60"
          }`}
        >
          <Store className="w-4 h-4" />
          <span className="text-[10px]">Market</span>
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`p-2 rounded-lg text-xs flex flex-col items-center gap-1 ${
            activeTab === "stats" ? "text-[#00E599]" : "opacity-60"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px]">Floor</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`p-2 rounded-lg text-xs flex flex-col items-center gap-1 ${
            activeTab === "profile" ? "text-[#00E599]" : "opacity-60"
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[10px]">Portfolio</span>
        </button>
      </div>
    </header>
  );
}
