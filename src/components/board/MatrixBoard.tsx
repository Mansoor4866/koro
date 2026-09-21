"use client";

import React, { useState, useMemo } from "react";
import { SquareData } from "@/types";
import { formatEth } from "@/lib/utils";
import { Search, ZoomIn, ZoomOut, Tag } from "lucide-react";

interface MatrixBoardProps {
  squares: SquareData[];
  onSelectSquare: (square: SquareData) => void;
  selectedSquareId?: number | null;
  isLoading?: boolean;
}

const CATEGORIES = ["All", "DeFi", "NFT", "Tooling", "Alpha", "Protocol", "Infrastructure"];

export function MatrixBoard({ squares, onSelectSquare, selectedSquareId, isLoading }: MatrixBoardProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [onlyForSale, setOnlyForSale] = useState(false);
  const [hoveredSquare, setHoveredSquare] = useState<SquareData | null>(null);

  // Filter squares
  const filteredSquares = useMemo(() => {
    return squares.filter((sq) => {
      if (onlyForSale && !sq.isForSale) return false;
      if (selectedCategory !== "All" && sq.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = sq.id.toString() === query || `#${sq.id}` === query;
        const matchesHeadline = sq.headline?.toLowerCase().includes(query);
        const matchesOwner = sq.ownerAddress.toLowerCase().includes(query);
        const matchesCat = sq.category.toLowerCase().includes(query);
        return matchesId || matchesHeadline || matchesOwner || matchesCat;
      }
      return true;
    });
  }, [squares, onlyForSale, selectedCategory, searchQuery]);

  const filteredSet = useMemo(() => new Set(filteredSquares.map((s) => s.id)), [filteredSquares]);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(0.7, prev + delta), 1.6));
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Matrix Controls & Search Toolbar */}
      <div className="w-full mb-6 p-4 rounded-2xl glass-panel flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-white/10 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search slot #, keyword, owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#00E599]/80 transition shadow-inner"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                selectedCategory === cat
                  ? "bg-[#00E599]/20 text-[#059669] dark:text-[#00E599] border border-[#00E599]/50 shadow-sm"
                  : "bg-slate-100 dark:bg-white/[0.03] text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Action Toggles & Zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyForSale((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              onlyForSale
                ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/50 shadow-sm"
                : "bg-slate-100 dark:bg-white/[0.03] text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5"
            }`}
          >
            <Tag className="w-3.5 h-3.5" /> For Sale
          </button>

          <div className="flex items-center bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-lg p-0.5">
            <button
              onClick={() => handleZoom(-0.15)}
              className="p-1.5 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="px-2 text-[11px] font-mono font-bold text-slate-700 dark:text-gray-200 hover:text-slate-900 dark:hover:text-white transition"
              title="Reset Zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={() => handleZoom(0.15)}
              className="p-1.5 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Container with scaling */}
      <div className="w-full overflow-x-auto pb-6 flex justify-center">
        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
          className="transition-transform duration-200"
        >
          <div className="p-4 rounded-2xl glass-panel border border-slate-300 dark:border-[#00E599]/20 bg-slate-200/80 dark:bg-[#090D14] shadow-xl relative">
            {/* Grid 16x16 = 256 slots */}
            <div className="grid grid-cols-16 gap-1.5 w-[840px] md:w-[980px] select-none">
              {Array.from({ length: 256 }).map((_, idx) => {
                const sq = squares[idx] || {
                  id: idx,
                  row: Math.floor(idx / 16),
                  col: idx % 16,
                  ownerAddress: "0x0000000000000000000000000000000000000000",
                  currentPriceEth: "0.05",
                  depositEth: "0.01",
                  dailyCarryRate: 0.01,
                  isForSale: true,
                  isLeased: false,
                  leaseExpiry: null,
                  leasedByAddress: null,
                  headline: `Square Slot #${idx}`,
                  bodyText: "Available for broadcast.",
                  linkUrl: null,
                  imageUrl: null,
                  category: "General",
                  accentColor: "#00E599",
                  lastPurchasedAt: null,
                  updatedAt: new Date().toISOString(),
                };

                const isMatch = filteredSet.has(sq.id);
                const isSelected = selectedSquareId === sq.id;

                return (
                  <div
                    key={idx}
                    onClick={() => onSelectSquare(sq)}
                    onMouseEnter={() => setHoveredSquare(sq)}
                    onMouseLeave={() => setHoveredSquare(null)}
                    style={{
                      borderColor: isSelected
                        ? "#00E599"
                        : isMatch
                        ? sq.accentColor || "#94A3B8"
                        : "transparent",
                    }}
                    className={`relative aspect-square rounded-lg cursor-pointer transition-all duration-150 flex flex-col justify-between p-1 overflow-hidden border ${
                      isSelected
                        ? "ring-2 ring-[#00E599] bg-[#00E599]/25 scale-105 z-20 shadow-[0_0_15px_rgba(0,229,153,0.5)]"
                        : isMatch
                        ? "bg-white dark:bg-[#111724]/90 hover:scale-110 hover:z-20 hover:border-[#00E599] hover:shadow-[0_0_12px_rgba(0,229,153,0.3)] shadow-sm"
                        : "bg-slate-300/40 dark:bg-[#0B0F17]/40 opacity-30"
                    }`}
                  >
                    {/* Top Row: Slot ID + Sale Indicator */}
                    <div className="flex items-center justify-between text-[9px] font-mono leading-none">
                      <span className="font-bold text-slate-600 dark:text-gray-400">#{sq.id}</span>
                      {sq.isForSale && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse" />
                      )}
                    </div>

                    {/* Center: Accent dot or mini icon */}
                    <div className="flex-1 flex flex-col items-center justify-center my-0.5">
                      <span className="text-[10px] font-bold text-slate-800 dark:text-gray-200 truncate w-full text-center leading-tight">
                        {sq.headline ? sq.headline.slice(0, 8) : `S#${sq.id}`}
                      </span>
                    </div>

                    {/* Bottom: Price in ETH */}
                    <div className="text-[8.5px] font-mono text-center text-[#059669] dark:text-[#00E599] bg-slate-100 dark:bg-black/40 rounded px-1 py-0.5 truncate leading-none font-bold">
                      {formatEth(sq.currentPriceEth, 2)}Ξ
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Hover Inspector Tooltip */}
      {hoveredSquare && (
        <div className="fixed bottom-6 left-6 z-40 max-w-xs w-full p-3.5 rounded-xl glass-panel-glow border border-[#00E599]/40 bg-white/95 dark:bg-[#0C111C]/95 text-xs shadow-2xl pointer-events-none animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2 mb-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: hoveredSquare.accentColor || "#00E599" }}
              />
              Square #{hoveredSquare.id}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-[10px] font-semibold text-slate-700 dark:text-gray-300">
              {hoveredSquare.category}
            </span>
          </div>
          <p className="font-bold text-slate-900 dark:text-white truncate mb-1">{hoveredSquare.headline || "Unassigned Headline"}</p>
          <p className="text-slate-600 dark:text-gray-300 text-[11px] line-clamp-2 mb-2 leading-relaxed">{hoveredSquare.bodyText || "No description."}</p>
          <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-gray-400 font-bold">Valuation:</span>
            <span className="text-[#059669] dark:text-[#00E599] font-bold">{formatEth(hoveredSquare.currentPriceEth)} ETH</span>
          </div>
        </div>
      )}
    </div>
  );
}
