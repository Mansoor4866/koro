"use client";

import React, { useState } from "react";
import { SquareData, PostItem } from "@/types";
import { useWallet } from "@/hooks/useWallet";
import { formatEth, shortenAddress, timeAgo } from "@/lib/utils";
import { getExplorerUrl } from "@/config/chains";
import { User, ShieldCheck, Grid, Radio, ExternalLink, CheckCircle2, AlertCircle, Loader2, KeyRound } from "lucide-react";
import { SiweMessage } from "siwe";
import { useSignMessage } from "wagmi";

interface UserProfileViewProps {
  squares: SquareData[];
  posts: PostItem[];
  onSelectSquare: (square: SquareData) => void;
  onOpenConnectModal: () => void;
}

export function UserProfileView({
  squares,
  posts,
  onSelectSquare,
  onOpenConnectModal,
}: UserProfileViewProps) {
  const { address, isConnected, balance, shortAddress, targetChain } = useWallet();
  const { signMessageAsync } = useSignMessage();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Filter owned squares and authored posts
  const mySquares = address
    ? squares.filter((s) => s.ownerAddress.toLowerCase() === address.toLowerCase())
    : [];

  const myPosts = address
    ? posts.filter((p) => p.authorAddress.toLowerCase() === address.toLowerCase())
    : [];

  const handleSIWE = async () => {
    if (!address) return;
    setIsSigning(true);
    setAuthError(null);

    try {
      // 1. Get Nonce from Backend
      const nonceRes = await fetch("/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const { nonce, error: nonceErr } = await nonceRes.json();
      if (!nonceRes.ok || !nonce) throw new Error(nonceErr || "Failed to generate nonce");

      // 2. Prepare SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in to KORO on Robinhood Chain to manage your 256-square portfolio.",
        uri: window.location.origin,
        version: "1",
        chainId: targetChain.id,
        nonce: nonce,
      });

      const messageStr = message.prepareMessage();

      // 3. Request wallet signature
      const signature = await signMessageAsync({ message: messageStr });

      // 4. Verify signature on backend
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageStr, signature }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || "Cryptographic signature verification failed.");
      }

      setIsAuthenticated(true);
    } catch (err: any) {
      console.error("SIWE Failed:", err);
      setAuthError(err.message || "Failed to sign in with Ethereum.");
    } finally {
      setIsSigning(false);
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="w-full max-w-3xl mx-auto p-12 text-center rounded-2xl glass-panel border border-slate-200 dark:border-white/10 my-8 shadow-sm">
        <User className="w-12 h-12 text-slate-400 dark:text-gray-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Connect Your Web3 Wallet</h2>
        <p className="text-xs text-slate-600 dark:text-gray-400 max-w-md mx-auto mb-6 font-medium">
          Connect your wallet to inspect your KORO slots, claim broadcast rewards, and authenticate using Sign-In with Ethereum (SIWE).
        </p>
        <button
          onClick={onOpenConnectModal}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E599] to-emerald-400 hover:opacity-90 text-black font-bold text-xs transition shadow-[0_0_20px_rgba(0,229,153,0.3)]"
        >
          Connect Wallet Now
        </button>
      </div>
    );
  }

  const explorerUrl = getExplorerUrl("address", address, targetChain.id);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Profile Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00E599] via-[#06B6D4] to-emerald-400 p-[2px] shadow-lg">
            <div className="w-full h-full bg-slate-900 dark:bg-[#0E131E] rounded-[14px] flex items-center justify-center font-mono font-bold text-xl text-[#00E599]">
              {address.slice(2, 4).toUpperCase()}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-mono">{shortAddress}</h2>
              {isAuthenticated && (
                <span className="px-2 py-0.5 rounded-md bg-[#00E599]/20 text-emerald-800 dark:text-[#00E599] border border-[#00E599]/40 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> SIWE Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-gray-400 mt-1 font-medium">
              <span className="font-mono text-emerald-700 dark:text-[#00E599] font-bold">{balance} ETH</span>
              <span>•</span>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1 font-semibold"
              >
                <span>View on Blockscout</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* SIWE Authenticate Button */}
        <div>
          {!isAuthenticated ? (
            <button
              onClick={handleSIWE}
              disabled={isSigning}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 text-xs font-bold transition disabled:opacity-50 shadow-xs"
            >
              {isSigning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-[#00E599]" />
                  <span>Requesting Wallet Signature...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />
                  <span>Sign-In With Ethereum (SIWE)</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />
              <span>Session Authenticated</span>
            </div>
          )}
        </div>
      </div>

      {authError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* Portfolio Owned Squares */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Grid className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />
            <span>Owned Square Slots ({mySquares.length})</span>
          </h3>
        </div>

        {mySquares.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mySquares.map((sq) => (
              <div
                key={sq.id}
                onClick={() => onSelectSquare(sq)}
                className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E131E]/90 cursor-pointer hover:border-[#00E599]/50 transition group shadow-sm"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5 mb-2">
                  <span
                    className="w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-slate-950 text-xs shadow-xs"
                    style={{ backgroundColor: sq.accentColor || "#00E599" }}
                  >
                    #{sq.id}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 dark:text-[#00E599] font-bold">
                    {formatEth(sq.currentPriceEth)} ETH
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mb-1">{sq.headline || `Square #${sq.id}`}</h4>
                <p className="text-[11px] text-slate-600 dark:text-gray-400 line-clamp-2 font-medium">{sq.bodyText || "No active message."}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl glass-panel border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-gray-400 font-medium">
            You do not currently hold any square slots on Robinhood Chain.
          </div>
        )}
      </div>

      {/* Authored Dispatches */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Your Broadcast Dispatches ({myPosts.length})</span>
          </h3>
        </div>

        {myPosts.length > 0 ? (
          <div className="space-y-3">
            {myPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-xl glass-card border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0C1018]/60 flex items-center justify-between shadow-2xs"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{post.title}</h4>
                  <span className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">{timeAgo(post.createdAt)}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-white/5 text-[10px] text-slate-700 dark:text-gray-300 font-semibold">
                  {post.category}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl glass-panel border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-gray-400 font-medium">
            No broadcast dispatches authored yet.
          </div>
        )}
      </div>
    </div>
  );
}
