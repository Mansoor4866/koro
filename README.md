# KORO · Decentralized Broadsheet & Matrix Board on Robinhood Chain

**KORO** is a production-quality Web3 application built for **Robinhood Chain** (Mainnet Chain ID: `4663`, Testnet: `46630`), inspired by the functionality, information architecture, and Harberger-style continuous market mechanics of on-chain advertising boards.

---

## 🌟 Core Product Features

1. **Interactive 256-Square Matrix Board (`16x16 Grid`)**
   - Live visual grid of all 256 on-chain slots.
   - Interactive zoom controls, slot search, and category filtering (DeFi, NFT, Tooling, Alpha, Protocol, Infrastructure).
   - Real-time Harberger valuation in ETH, holder address indicators, and hover tooltip inspector.
   - Click-to-inspect drawer for acquiring squares, updating creatives, and adjusting self-assessed valuations.

2. **The Live Tape (Broadsheet Feed)**
   - Real-time stream of all published articles, slot acquisitions, and on-chain ledger events.
   - Direct verification links to the **Robinhood Chain Blockscout Explorer**.

3. **The Pit (Marketplace & Classifieds)**
   - Filterable catalog of all squares sorted by Floor Price, Top Valued, Slot ID, or Recent Activity.
   - Direct one-click acquisition triggers.

4. **The Floor (Protocol Analytics & Tokenomics)**
   - Live protocol metrics: Floor price, total assessed ETH volume, $RPOSTS burned token metrics, and Treasury reserves.
   - Visual Harberger carry tax rate breakdown (1% daily carry tax).

5. **Dynamic EIP-6963 Multi-Wallet Discovery Modal**
   - Automatically discovers installed browser extensions (MetaMask, Rabby, Coinbase Wallet, Robinhood Wallet, Brave, OKX, Trust).
   - WalletConnect / Reown AppKit fallback for mobile QR code connections.
   - Zero hard-coded wallet availability; displays only detected wallets.

6. **Strict Robinhood Chain Enforcement**
   - Automatic detection of chain ID `4663` (or testnet `46630`).
   - One-click `wallet_switchEthereumChain` and `wallet_addEthereumChain` flow with official RPCs and block explorers.

7. **Sign-In with Ethereum (SIWE)**
   - Cryptographically verified wallet authentication with single-use expiring nonces.
   - User profile portfolio displaying owned slots and authored broadcasts.

---

## ⚡ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React icons
- **State & Data**: TanStack Query (with 10-15s background polling and optimistic invalidation)
- **Web3**: Wagmi v2, Viem, EIP-6963 multi-injected provider discovery, WalletConnect / Reown AppKit
- **Backend**: Next.js API Routes, Zod schema validation, SIWE (Sign-In with Ethereum)
- **Database**: PostgreSQL / SQLite with Prisma ORM

---

## ⛓️ Robinhood Chain Configuration

| Parameter | Mainnet | Testnet |
| :--- | :--- | :--- |
| **Network Name** | Robinhood Chain | Robinhood Chain Testnet |
| **Chain ID** | `4663` | `46630` |
| **Native Currency** | Ether (`ETH`, 18 decimals) | Ether (`ETH`, 18 decimals) |
| **RPC URL** | `https://rpc.mainnet.chain.robinhood.com` | `https://rpc.testnet.chain.robinhood.com` |
| **Block Explorer** | [robinhoodchain.blockscout.com](https://robinhoodchain.blockscout.com) | [testnet.robinhoodchain.blockscout.com](https://testnet.robinhoodchain.blockscout.com) |

---

## 🚀 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_REOWN_PROJECT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
NEXT_PUBLIC_ROBINHOOD_CHAIN_RPC=https://rpc.mainnet.chain.robinhood.com
NEXT_PUBLIC_ROBINHOOD_CHAIN_ID=4663
DATABASE_URL="file:./dev.db"
```

### 3. Initialize & Seed Database
```bash
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```
