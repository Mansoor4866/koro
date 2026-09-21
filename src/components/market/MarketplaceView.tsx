"use client";

import React, { useState, useMemo } from "react";
import { SquareData } from "@/types";
import { formatEth, shortenAddress } from "@/lib/utils";
import { getExplorerUrl } from "@/config/chains";
import { Store, ShoppingCart, ExternalLink, Search } from "lucide-react";

interface MarketplaceViewProps {
  squares: SquareData[];
  onSelectSquare: (square: SquareData) => void;
}

export function MarketplaceView({ squares, onSelectSquare }: MarketplaceViewProps) {
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "id_asc" | "recent">("price_asc");
  const [search, setSearch] = useState("");
  const [categoryFilter] = useState("All");

  const sortedSquares = useMemo(() => {
    let list = [...squares];

    if (categoryFilter !== "All") {
      list = list.filter((s) => s.category === categoryFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.id.toString() === q ||
          s.headline?.toLowerCase().includes(q) ||
          s.ownerAddress.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const priceA = parseFloat(a.currentPriceEth || "0");
      const priceB = parseFloat(b.currentPriceEth || "0");

      if (sortBy === "price_asc") return priceA - priceB;
      if (sortBy === "price_desc") return priceB - priceA;
      if (sortBy === "id_asc") return a.id - b.id;
      if (sortBy === "recent") {
        const timeA = a.lastPurchasedAt ? new Date(a.lastPurchasedAt).getTime() : 0;
        const timeB = b.lastPurchasedAt ? new Date(b.lastPurchasedAt).getTime() : 0;
        return timeB - timeA;
      }
      return 0;
    });

    return list;
  }, [squares, sortBy, search, categoryFilter]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#00E599]/10 border border-[#00E599]/20 flex items-center justify-center text-[#00E599]">
              <Store className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide">The Pit · Market Classifieds</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">
            Search, sort, and acquire broadsheet slots across Robinhood Chain's 256-square ledger
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search square, keyword, owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#00E599] shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-xs font-semibold">
            <button
              onClick={() => setSortBy("price_asc")}
              className={`px-3 py-1.5 rounded-lg transition ${
                sortBy === "price_asc" ? "bg-[#00E599]/20 text-emerald-800 dark:text-[#00E599] border border-[#00E599]/30" : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Floor First
            </button>
            <button
              onClick={() => setSortBy("price_desc")}
              className={`px-3 py-1.5 rounded-lg transition ${
                sortBy === "price_desc" ? "bg-[#00E599]/20 text-emerald-800 dark:text-[#00E599] border border-[#00E599]/30" : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Top Valued
            </button>
            <button
              onClick={() => setSortBy("id_asc")}
              className={`px-3 py-1.5 rounded-lg transition ${
                sortBy === "id_asc" ? "bg-[#00E599]/20 text-emerald-800 dark:text-[#00E599] border border-[#00E599]/30" : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Slot #
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSquares.map((sq) => {
          const explorerUrl = getExplorerUrl("address", sq.ownerAddress, 4663);

          return (
            <div
              key={sq.id}
              className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E131E]/90 flex flex-col justify-between hover:border-[#00E599]/50 transition group shadow-sm"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-slate-950 text-xs shadow-xs"
                      style={{ backgroundColor: sq.accentColor || "#00E599" }}
                    >
                      #{sq.id}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-gray-300">
                      Row {sq.row}, Col {sq.col}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-[10px] text-slate-600 dark:text-gray-400 font-semibold border border-slate-200 dark:border-transparent">
                    {sq.category}
                  </span>
                </div>

                {/* Headline & content */}
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-[#00E599] transition">
                  {sq.headline || `Square Slot #${sq.id}`}
                </h3>
                <p className="text-xs text-slate-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4 font-medium">
                  {sq.bodyText || "Available for Harberger broadcast."}
                </p>
              </div>

              <div>
                {/* Price and Action */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-between mb-3 shadow-2xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-gray-500 font-bold block">
                      Valuation
                    </span>
                    <span className="text-sm font-bold font-mono text-emerald-700 dark:text-[#00E599]">
                      {formatEth(sq.currentPriceEth)} ETH
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-gray-500 font-bold block">
                      Carry / Day
                    </span>
                    <span className="text-xs font-mono font-semibold text-cyan-700 dark:text-cyan-400">
                      {(parseFloat(sq.currentPriceEth || "0") * 0.01).toFixed(4)} ETH
                    </span>
                  </div>
                </div>

                {/* Owner & Buy Button */}
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 truncate font-medium"
                  >
                    <span>{shortenAddress(sq.ownerAddress, 4)}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 dark:text-gray-500" />
                  </a>

                  <button
                    onClick={() => onSelectSquare(sq)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#00E599]/15 hover:bg-[#00E599] text-emerald-900 dark:text-[#00E599] hover:text-black font-bold text-xs transition border border-[#00E599]/40 flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Acquire</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
