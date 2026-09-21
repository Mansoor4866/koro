"use client";

import React from "react";
import { useNetworkEnforcer } from "@/hooks/useNetworkEnforcer";
import { useAccount } from "wagmi";
import { AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

export function NetworkSwitchDialog() {
  const { isConnected } = useAccount();
  const { isCorrectNetwork, targetChain, switchToRobinhoodChain, isSwitching, switchError } = useNetworkEnforcer();

  if (!isConnected || isCorrectNetwork) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-md w-full p-4 rounded-2xl glass-panel border border-amber-500/40 bg-[#0E131E]/95 shadow-2xl animate-bounceSubtle">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-amber-300 mb-1">Network Switch Required</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            KORO requires <span className="font-semibold text-amber-400">{targetChain.name}</span> (Chain ID {targetChain.id}).
            Please switch your wallet to proceed.
          </p>

          {switchError && (
            <p className="text-[11px] text-red-400 mt-1">{switchError}</p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => switchToRobinhoodChain()}
              disabled={isSwitching}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition disabled:opacity-50"
            >
              {isSwitching ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Switching Network...</span>
                </>
              ) : (
                <>
                  <span>Switch to {targetChain.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
