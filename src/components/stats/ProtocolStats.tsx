"use client";

import React from "react";
import { BarChart3, Flame, Coins, ShieldCheck, Activity, Layers, ExternalLink, Cpu } from "lucide-react";
import { getExplorerUrl } from "@/config/chains";

interface ProtocolStatsProps {
  stats: any;
}

export function ProtocolStats({ stats }: ProtocolStatsProps) {
  const tokenContractUrl = getExplorerUrl("token", "0x9AB63f447Ff7e6F68e65016CBcf794326cfB75AF", 4663);
  const treasuryUrl = getExplorerUrl("address", "0x40791fF1784B43d8BB75eA41bdA6006a4736778C", 4663);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#00E599]/10 border border-[#00E599]/20 flex items-center justify-center text-[#00E599]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide">The Floor · Protocol Analytics</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">
            Real-time on-chain telemetry, Harberger tax mechanics, and reserve backing on Robinhood Chain
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-700 dark:text-[#00E599] font-bold">
            <Cpu className="w-4 h-4" />
            <span>Robinhood Chain RPC: 42ms</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E131E]/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-600 dark:text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Floor Price</span>
            <Coins className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {stats?.floorPriceEth || "0.0200"} <span className="text-sm font-sans text-emerald-700 dark:text-[#00E599]">ETH</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-gray-500 mt-1 block font-medium">Lowest active square valuation</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E131E]/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-600 dark:text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Assessed Value</span>
            <Layers className="w-4 h-4 text-cyan-600 dark:text-[#06B6D4]" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {stats?.totalAssessedEth || "18.42"} <span className="text-sm font-sans text-cyan-700 dark:text-cyan-400">ETH</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-gray-500 mt-1 block font-medium">256 slots continuous market</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E131E]/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-600 dark:text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">$RPOSTS Burned</span>
            <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {stats?.burnedRposts || "1,450,200"}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-gray-500 mt-1 block font-medium">Permanently sent to 0x0...dead</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E131E]/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-600 dark:text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Treasury Reserves</span>
            <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {stats?.treasuryEth || "142.85"} <span className="text-sm font-sans text-purple-700 dark:text-purple-400">ETH</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-gray-500 mt-1 block font-medium">Protocol backing fund</span>
        </div>
      </div>

      {/* Protocol Mechanics & Architecture Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Continuous Harberger Taxation System */}
        <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E131E]/90 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />
            <span>Harberger Tax Mechanism</span>
          </h3>
          <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
            Every square on the 16x16 KORO Matrix is priced by its own holder. At any moment, any peer can buy out a square for its stated valuation. To discourage arbitrary monopolization, holders pay a continuous 1% daily carry tax based on their assessed price.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-2 text-xs font-semibold">
            <div className="flex justify-between text-slate-700 dark:text-gray-300">
              <span className="text-slate-500 dark:text-gray-400">Carry Rate:</span>
              <span className="font-mono text-emerald-700 dark:text-[#00E599] font-bold">1.00% / day</span>
            </div>
            <div className="flex justify-between text-slate-700 dark:text-gray-300">
              <span className="text-slate-500 dark:text-gray-400">Burn Allocation:</span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">50% to $RPOSTS Buyback & Burn</span>
            </div>
            <div className="flex justify-between text-slate-700 dark:text-gray-300">
              <span className="text-slate-500 dark:text-gray-400">Pool Allocation:</span>
              <span className="font-mono text-cyan-700 dark:text-cyan-400 font-bold">50% to Floor Reserve Staking</span>
            </div>
          </div>
        </div>

        {/* Verified Contracts & Addresses */}
        <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E131E]/90 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Robinhood Chain Smart Contracts</span>
          </h3>
          <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
            Deployed on Robinhood Chain Mainnet (Chain ID 4663). Fully auditable on Blockscout.
          </p>
          <div className="space-y-2 font-mono text-xs">
            <a
              href={tokenContractUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-between text-slate-800 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-[#00E599] transition font-semibold"
            >
              <div>
                <span className="text-[10px] uppercase text-slate-500 dark:text-gray-500 block font-bold">$RPOSTS Token</span>
                <span>0x9AB6...75AF</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={treasuryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-between text-slate-800 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-[#00E599] transition font-semibold"
            >
              <div>
                <span className="text-[10px] uppercase text-slate-500 dark:text-gray-500 block font-bold">Treasury Vault</span>
                <span>0x4079...778C</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
