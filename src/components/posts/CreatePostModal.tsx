"use client";

import React, { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { X, Send, Sparkles, AlertCircle, Loader2 } from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultSquareId?: number | null;
}

const CATEGORIES = ["General", "DeFi", "NFT", "Tooling", "Alpha", "Protocol", "Infrastructure"];

export function CreatePostModal({ isOpen, onClose, onSuccess, defaultSquareId }: CreatePostModalProps) {
  const { address, isConnected, isCorrectNetwork, switchToRobinhoodChain } = useWallet();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [squareId, setSquareId] = useState<string>(defaultSquareId !== undefined && defaultSquareId !== null ? defaultSquareId.toString() : "");
  const [linkUrl, setLinkUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    if (!isCorrectNetwork) {
      await switchToRobinhoodChain();
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          category,
          authorAddress: address,
          squareId: squareId ? parseInt(squareId, 10) : null,
          linkUrl: linkUrl || null,
          blockchainTxHash: txHash,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish post.");

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Publish post failed:", err);
      setErrorMsg(err.message || "Failed to publish post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel-glow border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0C1017] p-6 shadow-2xl overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00E599]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00E599]/15 border border-[#00E599]/30 text-emerald-700 dark:text-[#00E599]">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">Broadcast to The Tape</h2>
              <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">Publish a verified dispatch to Robinhood Chain</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">Article Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00E599] shadow-xs"
              placeholder="e.g. New Liquidity Pool Launch on Robinhood Chain"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#111622] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00E599] shadow-xs"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                Attach Square ID (Optional)
              </label>
              <input
                type="number"
                min="0"
                max="255"
                value={squareId}
                onChange={(e) => setSquareId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00E599] shadow-xs"
                placeholder="0 - 255"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">Broadcast Content</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00E599] shadow-xs"
              placeholder="Write your announcement, analysis, or update..."
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">External Link (Optional)</label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00E599] shadow-xs"
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isConnected}
            className="w-full py-3 rounded-xl bg-[#00E599] hover:bg-[#00E599]/90 text-slate-950 font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Broadcasting to Robinhood Chain...</span>
              </>
            ) : !isConnected ? (
              <span>Connect Wallet to Broadcast</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Publish Dispatch</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
