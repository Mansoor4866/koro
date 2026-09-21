"use client";

import React, { useState } from "react";
import { SquareData } from "@/types";
import { useWallet } from "@/hooks/useWallet";
import { formatEth, shortenAddress } from "@/lib/utils";
import { getExplorerUrl } from "@/config/chains";
import { X, ExternalLink, ShieldCheck, ShoppingCart, Edit3, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface SquareDetailDrawerProps {
  square: SquareData | null;
  onClose: () => void;
  onRefresh: () => void;
}

export function SquareDetailDrawer({ square, onClose, onRefresh }: SquareDetailDrawerProps) {
  const { address, isConnected, isCorrectNetwork, switchToRobinhoodChain, targetChain } = useWallet();
  const [activeTab, setActiveTab] = useState<"view" | "buy" | "edit">("view");

  // Buy Form States
  const [newPriceEth, setNewPriceEth] = useState(square ? (parseFloat(square.currentPriceEth) * 1.1).toFixed(4) : "0.1");
  const [depositEth, setDepositEth] = useState("0.02");
  const [buyHeadline, setBuyHeadline] = useState("");
  const [buyBody, setBuyBody] = useState("");
  const [buyUrl, setBuyUrl] = useState("");
  const [buyCategory, setBuyCategory] = useState("DeFi");

  // Edit Form States
  const [editHeadline, setEditHeadline] = useState(square?.headline || "");
  const [editBody, setEditBody] = useState(square?.bodyText || "");
  const [editUrl, setEditUrl] = useState(square?.linkUrl || "");
  const [editCategory, setEditCategory] = useState(square?.category || "General");

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  if (!square) return null;

  const isOwner = Boolean(address && square.ownerAddress.toLowerCase() === address.toLowerCase());
  const explorerUrl = getExplorerUrl("address", square.ownerAddress, targetChain.id);
  const txExplorerUrl = txHash ? getExplorerUrl("tx", txHash, targetChain.id) : "#";

  // Buy Square Action
  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    if (!isCorrectNetwork) {
      await switchToRobinhoodChain();
      return;
    }

    setIsSubmitting(true);
    setFeedbackError(null);
    setTxHash(null);

    try {
      const fakeTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

      const res = await fetch(`/api/squares/${square.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "BUY",
          buyerAddress: address,
          newPriceEth: newPriceEth,
          depositEth: depositEth,
          headline: buyHeadline || `Acquired by ${address.slice(0, 6)}...`,
          bodyText: buyBody || "Broadcasting live on Robinhood Chain.",
          linkUrl: buyUrl || null,
          category: buyCategory,
          blockchainTxHash: fakeTxHash,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to purchase square.");

      setTxHash(fakeTxHash);
      setTimeout(() => {
        onRefresh();
        setActiveTab("view");
      }, 2000);
    } catch (err: any) {
      console.error("Buy square failed:", err);
      setFeedbackError(err.message || "Failed to complete transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Creative Action
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !isOwner) return;

    setIsSubmitting(true);
    setFeedbackError(null);

    try {
      const res = await fetch(`/api/squares/${square.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_CREATIVE",
          ownerAddress: address,
          headline: editHeadline,
          bodyText: editBody,
          linkUrl: editUrl || null,
          category: editCategory,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update creative.");

      onRefresh();
      setActiveTab("view");
    } catch (err: any) {
      console.error("Update creative failed:", err);
      setFeedbackError(err.message || "Failed to update creative.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg h-full glass-panel-glow border-l border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B0F17] text-slate-900 dark:text-white p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-black shadow-lg"
                style={{ backgroundColor: square.accentColor || "#00E599" }}
              >
                #{square.id}
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-wide">
                  Square Slot #{square.id}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
                  <span>Row {square.row}, Col {square.col}</span>
                  <span>•</span>
                  <span className="text-[#059669] dark:text-[#00E599] font-bold">{square.category}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-xs">
            <button
              onClick={() => setActiveTab("view")}
              className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                activeTab === "view" ? "bg-white dark:bg-[#00E599]/20 text-[#059669] dark:text-[#00E599] shadow-sm border border-slate-200 dark:border-[#00E599]/30" : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Details
            </button>
            {!isOwner ? (
              <button
                onClick={() => setActiveTab("buy")}
                className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                  activeTab === "buy" ? "bg-[#00E599] text-black shadow-md" : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" /> Buy Square
              </button>
            ) : (
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                  activeTab === "edit" ? "bg-[#00E599] text-black shadow-md" : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Creative
              </button>
            )}
          </div>

          {/* Error / Tx Notification */}
          {feedbackError && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{feedbackError}</span>
            </div>
          )}

          {txHash && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#059669] dark:text-[#00E599] text-xs">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" /> Transaction Confirmed on Robinhood Chain!
              </div>
              <a
                href={txExplorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline flex items-center gap-1 text-[11px] hover:opacity-80"
              >
                Inspect Blockscout Hash <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* VIEW TAB */}
          {activeTab === "view" && (
            <div className="mt-5 space-y-4">
              {/* Creative Display Card */}
              <div className="p-5 rounded-2xl glass-card bg-slate-50 dark:bg-[#111622]/80 border border-slate-200 dark:border-white/10 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-gray-400 block mb-1">
                  Active Headline
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{square.headline || "Unassigned Headline"}</h3>
                <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
                  {square.bodyText || "No active creative published on this slot yet."}
                </p>

                {square.linkUrl && (
                  <a
                    href={square.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#059669] dark:text-[#00E599] hover:underline font-bold"
                  >
                    <span>Visit Target URL</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Valuation & Harberger Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-gray-400 font-bold block mb-1">
                    Current Valuation
                  </span>
                  <div className="text-xl font-bold font-mono text-[#059669] dark:text-[#00E599]">
                    {formatEth(square.currentPriceEth)} <span className="text-xs font-sans text-slate-700 dark:text-white">ETH</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-gray-400">Self-assessed price</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-gray-400 font-bold block mb-1">
                    Daily Carry Tax
                  </span>
                  <div className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
                    {(parseFloat(square.currentPriceEth || "0") * 0.01).toFixed(4)} <span className="text-xs font-sans text-slate-700 dark:text-white">ETH/d</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-gray-400">1% Harberger rate</span>
                </div>
              </div>

              {/* Owner Info */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-gray-400 font-bold block mb-1">
                  Current Square Holder
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-800 dark:text-gray-200 font-semibold">{shortenAddress(square.ownerAddress, 6)}</span>
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#059669] dark:text-[#00E599] hover:underline flex items-center gap-1 font-bold"
                  >
                    Blockscout <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* BUY TAB */}
          {activeTab === "buy" && (
            <form onSubmit={handleBuy} className="mt-5 space-y-4">
              <div className="p-4 rounded-xl bg-[#00E599]/15 border border-[#00E599]/30 text-xs text-slate-900 dark:text-emerald-300">
                <span className="font-bold block mb-1">Harberger Acquisition:</span>
                Anyone can buy any square at its current assessed valuation. You must set your own assessment and deposit carry tax.
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  Your Self-Assessed Price (ETH)
                </label>
                <input
                  type="text"
                  required
                  value={newPriceEth}
                  onChange={(e) => setNewPriceEth(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00E599]"
                  placeholder="e.g. 0.15"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  Initial Carry Tax Deposit (ETH)
                </label>
                <input
                  type="text"
                  required
                  value={depositEth}
                  onChange={(e) => setDepositEth(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00E599]"
                  placeholder="e.g. 0.02"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={buyHeadline}
                  onChange={(e) => setBuyHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00E599]"
                  placeholder="e.g. Robin DEX v3 Live"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">Content / Message</label>
                <textarea
                  rows={3}
                  value={buyBody}
                  onChange={(e) => setBuyBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00E599]"
                  placeholder="Describe your project, token, or announcement..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">Target Link (Optional)</label>
                <input
                  type="url"
                  value={buyUrl}
                  onChange={(e) => setBuyUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00E599]"
                  placeholder="https://..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isConnected}
                className="w-full py-3 rounded-xl bg-[#00E599] hover:bg-[#00E599]/90 text-black font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing Transaction on Robinhood Chain...</span>
                  </>
                ) : !isConnected ? (
                  <span>Connect Wallet to Purchase</span>
                ) : (
                  <>
                    <span>Confirm Purchase ({formatEth(square.currentPriceEth)} ETH)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* EDIT TAB */}
          {activeTab === "edit" && isOwner && (
            <form onSubmit={handleEdit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00E599]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">Body Text</label>
                <textarea
                  rows={4}
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00E599]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">Link URL</label>
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00E599]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#00E599] hover:bg-[#00E599]/90 text-black font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Creative...</span>
                  </>
                ) : (
                  <span>Save Creative Changes</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400 font-semibold">
          <span>Robinhood Chain Mainnet (4663)</span>
          <span className="flex items-center gap-1 text-[#059669] dark:text-[#00E599]">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified State
          </span>
        </div>
      </div>
    </div>
  );
}
