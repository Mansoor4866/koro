"use client";

import React from "react";
import { Grid, ExternalLink, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-[#06090E] text-slate-600 dark:text-gray-400 py-10 mt-16 transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#00E599]/20 border border-[#00E599]/40 flex items-center justify-center text-emerald-700 dark:text-[#00E599]">
                <Grid className="w-4 h-4" />
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white tracking-wider">KORO</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
              Decentralized 256-slot advertising matrix and Harberger broadsheet running on Robinhood Chain Mainnet.
            </p>
          </div>

          {/* Network Specs */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold text-slate-900 dark:text-gray-200 tracking-wider">Robinhood Chain</h4>
            <ul className="text-xs space-y-1.5 font-mono text-slate-600 dark:text-gray-400 font-medium">
              <li>Chain ID: 4663</li>
              <li>Currency: ETH (18 decimals)</li>
              <li>RPC: rpc.mainnet.chain.robinhood.com</li>
            </ul>
          </div>

          {/* Verified Contracts */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold text-slate-900 dark:text-gray-200 tracking-wider">Explorer & Tools</h4>
            <ul className="text-xs space-y-1.5 font-semibold">
              <li>
                <a
                  href="https://robinhoodchain.blockscout.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-[#00E599] transition flex items-center gap-1"
                >
                  <span>Blockscout Mainnet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://robinhoodchain.blockscout.com/token/0x9AB63f447Ff7e6F68e65016CBcf794326cfB75AF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-[#00E599] transition flex items-center gap-1"
                >
                  <span>$RPOSTS Contract</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://testnet.robinhoodchain.blockscout.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-[#00E599] transition flex items-center gap-1"
                >
                  <span>Testnet Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Security */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold text-slate-900 dark:text-gray-200 tracking-wider">Web3 Security</h4>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
              Non-custodial frontend. All state changes require cryptographic wallet confirmation. No private keys are ever collected or stored.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-[#00E599] font-bold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>EIP-6963 + SIWE Verified</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-gray-400 gap-3 font-medium">
          <span>&copy; {new Date().getFullYear()} KORO. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built for the Robinhood Chain EVM Ecosystem
          </span>
        </div>
      </div>
    </footer>
  );
}
