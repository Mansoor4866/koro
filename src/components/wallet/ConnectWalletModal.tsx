"use client";

import React, { useState } from "react";
import { useConnect } from "wagmi";
import { useEIP6963Wallets } from "@/hooks/useEIP6963Wallets";
import { X, Wallet, ShieldCheck, ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useNetworkEnforcer } from "@/hooks/useNetworkEnforcer";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const { connectors, connectAsync } = useConnect();
  const { providers } = useEIP6963Wallets();
  const { targetChain, switchToRobinhoodChain } = useNetworkEnforcer();
  
  const [connectingRdns, setConnectingRdns] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (connector: any, rdnsKey: string) => {
    setConnectingRdns(rdnsKey);
    setErrorMessage(null);

    try {
      await connectAsync({ connector });
      // Verify/switch network after connection
      await switchToRobinhoodChain();
      onClose();
    } catch (err: any) {
      console.error("Wallet connection error:", err);
      if (err.code === 4001 || err.message?.includes("User rejected")) {
        setErrorMessage("Wallet connection was cancelled.");
      } else {
        setErrorMessage(err.message || "Could not connect to wallet. Please try again.");
      }
    } finally {
      setConnectingRdns(null);
    }
  };

  // Find standard injected / WalletConnect connectors
  const walletConnectConnector = connectors.find((c) => c.id === "walletConnect" || c.name === "WalletConnect");
  const standardInjectedConnector = connectors.find((c) => c.type === "injected" || c.id === "injected");

  const hasInjectedWallets = providers.length > 0 || (typeof window !== "undefined" && Boolean((window as any).ethereum));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl glass-panel-glow border border-slate-200 dark:border-[#00E599]/30 bg-white dark:bg-[#0C1017] p-6 shadow-2xl overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00E599]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#06B6D4]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00E599]/15 border border-[#00E599]/30 text-emerald-700 dark:text-[#00E599]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">Connect Wallet</h2>
              <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">Select an installed provider or scan QR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network Notice */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-gray-400 font-medium">Target Ecosystem:</span>
          <span className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-[#00E599]">
            <span className="w-2 h-2 rounded-full bg-[#00E599] animate-ping" />
            {targetChain.name} (Chain ID: {targetChain.id})
          </span>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Wallets List */}
        <div className="mt-5 space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {/* 1. Detected EIP-6963 Wallets */}
          {providers.map((p) => {
            const isConnecting = connectingRdns === p.info.rdns;
            return (
              <button
                key={p.info.uuid || p.info.rdns}
                disabled={Boolean(connectingRdns)}
                onClick={() => handleConnect(standardInjectedConnector, p.info.rdns)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl glass-card hover:border-[#00E599]/40 bg-slate-50 hover:bg-slate-100 dark:bg-[#121824]/60 dark:hover:bg-[#121824] border border-slate-200 dark:border-white/10 text-left transition group disabled:opacity-50 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 p-1.5 flex items-center justify-center border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xs">
                    <img src={p.info.icon} alt={p.info.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-[#00E599] transition flex items-center gap-1.5">
                      {p.info.name}
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Detected & Installed
                    </div>
                  </div>
                </div>
                {isConnecting ? (
                  <Loader2 className="w-5 h-5 text-emerald-600 dark:text-[#00E599] animate-spin" />
                ) : (
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-white/5 text-slate-800 dark:text-gray-300 font-bold group-hover:bg-[#00E599]/20 group-hover:text-emerald-900 dark:group-hover:text-[#00E599] transition">
                    Connect
                  </span>
                )}
              </button>
            );
          })}

          {/* 2. Fallback Standard Injected */}
          {providers.length === 0 && typeof window !== "undefined" && (window as any).ethereum && standardInjectedConnector && (
            <button
              disabled={Boolean(connectingRdns)}
              onClick={() => handleConnect(standardInjectedConnector, "injected-fallback")}
              className="w-full flex items-center justify-between p-3.5 rounded-xl glass-card hover:border-[#00E599]/40 bg-slate-50 hover:bg-slate-100 dark:bg-[#121824]/60 dark:hover:bg-[#121824] border border-slate-200 dark:border-white/10 text-left transition group disabled:opacity-50 shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00E599]/15 p-2 flex items-center justify-center border border-[#00E599]/30">
                  <Wallet className="w-5 h-5 text-emerald-700 dark:text-[#00E599]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-[#00E599] transition">
                    Browser Extension Wallet
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Injected Provider Detected
                  </div>
                </div>
              </div>
              {connectingRdns === "injected-fallback" ? (
                <Loader2 className="w-5 h-5 text-emerald-600 dark:text-[#00E599] animate-spin" />
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-white/5 text-slate-800 dark:text-gray-300 font-bold group-hover:bg-[#00E599]/20 group-hover:text-emerald-900 dark:group-hover:text-[#00E599] transition">
                  Connect
                </span>
              )}
            </button>
          )}

          {/* 3. WalletConnect option */}
          {walletConnectConnector && (
            <button
              disabled={Boolean(connectingRdns)}
              onClick={() => handleConnect(walletConnectConnector, "walletconnect")}
              className="w-full flex items-center justify-between p-3.5 rounded-xl glass-card hover:border-[#06B6D4]/40 bg-slate-50 hover:bg-slate-100 dark:bg-[#121824]/60 dark:hover:bg-[#121824] border border-slate-200 dark:border-white/10 text-left transition group disabled:opacity-50 shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/15 p-2 flex items-center justify-center border border-[#06B6D4]/30 text-cyan-600 dark:text-[#06B6D4]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-[#06B6D4] transition">
                    WalletConnect
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-gray-400 font-medium">
                    Scan with Mobile / Reown AppKit
                  </div>
                </div>
              </div>
              {connectingRdns === "walletconnect" ? (
                <Loader2 className="w-5 h-5 text-cyan-600 dark:text-[#06B6D4] animate-spin" />
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-white/5 text-slate-800 dark:text-gray-300 font-bold group-hover:bg-[#06B6D4]/20 group-hover:text-cyan-900 dark:group-hover:text-[#06B6D4] transition">
                  Scan QR
                </span>
              )}
            </button>
          )}

          {/* 4. No Injected Provider fallback banner */}
          {!hasInjectedWallets && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-xs text-amber-800 dark:text-amber-300 mb-3 font-semibold">No browser wallet extension detected.</p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-black dark:text-white bg-amber-500/20 hover:bg-amber-500/30 px-3 py-1.5 rounded-lg border border-amber-500/30 transition font-bold"
              >
                Install MetaMask <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer Security Notice */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-600 dark:text-gray-400 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E599]" /> Non-custodial & Secure
          </span>
          <span>Zero seed phrase transmission</span>
        </div>
      </div>
    </div>
  );
}
