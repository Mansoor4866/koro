"use client";

import React, { useState } from "react";
import { PostItem, ActivityEvent } from "@/types";
import { shortenAddress, timeAgo } from "@/lib/utils";
import { getExplorerUrl } from "@/config/chains";
import { Radio, ExternalLink, MessageSquare, Sparkles, RefreshCw, ShoppingCart, Tag } from "lucide-react";

interface ActivityFeedProps {
  posts: PostItem[];
  activities: ActivityEvent[];
  onRefresh: () => void;
  isLoading?: boolean;
}

export function ActivityFeed({ posts, activities, onRefresh, isLoading }: ActivityFeedProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "posts" | "activity">("all");

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Feed Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#00E599]/10 border border-[#00E599]/20 flex items-center justify-center text-[#00E599]">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide">The Live Tape</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">
            Real-time broadsheet articles, slot acquisitions, and events on Robinhood Chain
          </p>
        </div>

        {/* Filters & Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-xs font-semibold">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeFilter === "all" ? "bg-[#00E599]/20 text-emerald-700 dark:text-[#00E599] border border-[#00E599]/30" : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setActiveFilter("posts")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeFilter === "posts" ? "bg-[#00E599]/20 text-emerald-700 dark:text-[#00E599] border border-[#00E599]/30" : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Broadcasts
            </button>
            <button
              onClick={() => setActiveFilter("activity")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeFilter === "activity" ? "bg-[#00E599]/20 text-emerald-700 dark:text-[#00E599] border border-[#00E599]/30" : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              On-Chain Ledger
            </button>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2.5 rounded-xl glass-card hover:border-[#00E599]/40 bg-white dark:bg-[#121824] text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#00E599]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-4">
        {/* Posts stream */}
        {(activeFilter === "all" || activeFilter === "posts") &&
          posts.map((post) => {
            const txUrl = post.blockchainTxHash ? getExplorerUrl("tx", post.blockchainTxHash, post.chainId) : null;
            const authorUrl = getExplorerUrl("address", post.authorAddress, post.chainId);

            return (
              <article
                key={post.id}
                className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E131E]/90 transition hover:border-[#00E599]/40 shadow-sm"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00E599] to-[#06B6D4] p-[1px]">
                      <div className="w-full h-full rounded-full bg-slate-900 dark:bg-[#0E131E] flex items-center justify-center text-[10px] font-mono font-bold text-[#00E599]">
                        {post.authorAddress.slice(2, 4)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <a
                          href={authorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-slate-900 dark:text-white hover:text-[#00E599] transition font-mono"
                        >
                          {shortenAddress(post.authorAddress, 4)}
                        </a>
                        {post.squareId !== null && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00E599]/15 text-emerald-800 dark:text-[#00E599] border border-[#00E599]/30">
                            Square #{post.squareId}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">{timeAgo(post.createdAt)}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-[11px] font-semibold text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-transparent">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">{post.title}</h3>
                <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-normal">{post.content}</p>

                {post.linkUrl && (
                  <div className="mt-3">
                    <a
                      href={post.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-[#00E599] hover:underline font-bold"
                    >
                      <span>{post.linkUrl}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Footer Badges */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 font-medium">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
                      <Sparkles className="w-3.5 h-3.5" /> Confirmed on Robinhood Chain
                    </span>
                  </div>

                  {txUrl && (
                    <a
                      href={txUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-slate-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-[#00E599] flex items-center gap-1 transition font-medium"
                    >
                      <span>Blockscout</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}

        {/* Activity logs stream */}
        {(activeFilter === "all" || activeFilter === "activity") &&
          activities.map((act) => {
            const txUrl = act.txHash ? getExplorerUrl("tx", act.txHash, 4663) : null;
            const userUrl = getExplorerUrl("address", act.userAddress, 4663);

            return (
              <div
                key={act.id}
                className="p-4 rounded-xl glass-card border border-slate-200 dark:border-white/5 bg-slate-50/90 dark:bg-[#0C1018]/60 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-gray-300 shadow-xs">
                    {act.action === "BOUGHT_SQUARE" ? (
                      <ShoppingCart className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />
                    ) : act.action === "POSTED_UPDATE" ? (
                      <MessageSquare className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    ) : (
                      <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      <a href={userUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-emerald-700 dark:text-emerald-300 hover:underline">
                        {shortenAddress(act.userAddress, 4)}
                      </a>{" "}
                      <span className="text-slate-800 dark:text-gray-200">{act.description}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">{timeAgo(act.createdAt)}</span>
                  </div>
                </div>

                {txUrl && (
                  <a
                    href={txUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 shrink-0 font-medium"
                  >
                    <span>Tx</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            );
          })}

        {posts.length === 0 && activities.length === 0 && (
          <div className="p-12 text-center rounded-2xl glass-panel border border-slate-200 dark:border-white/5">
            <Radio className="w-8 h-8 text-slate-400 dark:text-gray-500 mx-auto mb-3 animate-pulse" />
            <p className="text-sm font-bold text-slate-800 dark:text-gray-300">No broadcasts recorded yet</p>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-medium">Be the first to publish a broadsheet post to Robinhood Chain.</p>
          </div>
        )}
      </div>
    </div>
  );
}
