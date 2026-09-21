"use client";

import React, { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { X, Copy, Check, ExternalLink, LogOut, RefreshCw, Layers } from "lucide-react";

interface WalletDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletDetailsModal({ isOpen, onClose }: WalletDetailsModalProps) {
  const {
    address,
    balance,
    balanceSymbol,
    isLoadingBalance,
    refetchBalance,
    disconnect,
    targetChain,
    isCorrectNetwork,
    switchToRobinhoodChain,
    explorerAddressUrl,
    connectorName,
  } = useWallet();

  const [copied, setCopied] = useState(false);

  if (!isOpen || !address) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl glass-panel-glow border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0C1017] p-6 shadow-2xl overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00E599]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-[#00E599]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">Account Portfolio</h2>
              <p className="text-[11px] text-slate-600 dark:text-gray-400 font-medium">Connected via {connectorName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Address Card */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-2xs">
          <div className="min-w-0 pr-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-gray-400 font-bold block mb-1">
              Wallet Address
            </span>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-gray-200 block truncate">{address}</span>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5 transition flex items-center gap-1.5 text-xs shrink-0 font-semibold shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />
                <span className="text-emerald-700 dark:text-[#00E599]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Balance & Network stats */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-gray-400 font-bold">Balance</span>
              <button
                onClick={() => refetchBalance()}
                disabled={isLoadingBalance}
                className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBalance ? "animate-spin text-[#00E599]" : ""}`} />
              </button>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono flex items-baseline gap-1">
              {balance} <span className="text-xs text-emerald-700 dark:text-[#00E599] font-sans font-bold">{balanceSymbol}</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">Live on Robinhood Chain</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-2xs">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-gray-400 font-bold block mb-1">Network</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isCorrectNetwork ? "bg-[#00E599]" : "bg-amber-400 animate-pulse"}`} />
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{targetChain.name}</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono font-medium">Chain ID: {targetChain.id}</span>
          </div>
        </div>

        {/* Wrong Network Notice if applicable */}
        {!isCorrectNetwork && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <span className="text-xs text-amber-900 dark:text-amber-300 font-semibold">Mismatch: Switch to {targetChain.name}</span>
            <button
              onClick={() => switchToRobinhoodChain()}
              className="text-xs px-3 py-1 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400 transition"
            >
              Switch Now
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 space-y-2">
          <a
            href={explorerAddressUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl glass-card hover:border-[#00E599]/30 bg-slate-50 hover:bg-slate-100 dark:bg-[#121824]/60 text-sm font-bold text-slate-800 dark:text-gray-200 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-white/10 transition shadow-2xs"
          >
            <span>View on Blockscout Explorer</span>
            <ExternalLink className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />
          </a>

          <button
            onClick={handleDisconnect}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect Wallet</span>
          </button>
        </div>
      </div>
    </div>
  );
}
