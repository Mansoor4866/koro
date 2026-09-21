const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SAMPLE_OWNERS = [
  "0x83F42A68b44917fDb8812c93Ce18A6Db4A92B194",
  "0x9AB63f447Ff7e6F68e65016CBcf794326cfB75AF",
  "0x5C8bB58f41E66Af86cFAF46406d00fff0dCe1927",
  "0x076E393E86509d9aFA6c695e8ABE512329dC08d1",
  "0x15c46Ab11e395900b034F20533701C3998c4d034",
  "0x40791fF1784B43d8BB75eA41bdA6006a4736778C",
  "0x4E95D1231AAA434C2328026d2be64f40839FFb47",
  "0x7a7DE55FBAfA3FDC272A8Abb4A32F5BdC69e5043",
  "0xF4fe7ced06d9cA2280346F60F73c92Eb9D614569",
  "0x1fD512056DEA1EB1cBE19f3e60a1A09541799D2C",
];

const SAMPLE_HEADLINES = [
  { headline: "Robin DEX v3 Live", body: "Trade any asset natively with ultra low gas on Robinhood Chain.", cat: "DeFi", color: "#00E599", url: "https://robinhoodchain.blockscout.com" },
  { headline: "Harberger Post Guild", body: "Continuous self-assessed billboard auction live for district 0.", cat: "Alpha", color: "#06B6D4", url: "https://robinposts.com" },
  { headline: "Robinhood Chain Staking", body: "Earn validator rewards and secure the network with native ETH.", cat: "DeFi", color: "#8B5CF6", url: "https://robinhoodchain.blockscout.com" },
  { headline: "Cyber Oracle Feed", body: "Sub-second real-time pricing feeds for on-chain derivatives.", cat: "Tooling", color: "#EC4899", url: "https://robinhoodchain.blockscout.com" },
  { headline: "Zero Gas Relayer", body: "Batch transactions and sponsor user onboarding effortlessly.", cat: "Infrastructure", color: "#F59E0B", url: "https://robinhoodchain.blockscout.com" },
  { headline: "Robinhood NFT Studio", body: "Mint digital collectibles and dynamic broadcast squares.", cat: "NFT", color: "#10B981", url: "https://robinhoodchain.blockscout.com" },
  { headline: "Pulse Treasury Pool", body: "Protocol fee sharing mechanism and automated buyback engine.", cat: "DeFi", color: "#3B82F6", url: "https://robinhoodchain.blockscout.com" },
  { headline: "Blockscout Explorer", body: "Inspect blocks, tokens, and verified contracts in real-time.", cat: "Tooling", color: "#6366F1", url: "https://robinhoodchain.blockscout.com" },
];

async function main() {
  console.log("Seeding Robin Grid 256-square ledger...");

  // Seed Users
  for (let i = 0; i < SAMPLE_OWNERS.length; i++) {
    const addr = SAMPLE_OWNERS[i].toLowerCase();
    await prisma.user.upsert({
      where: { walletAddress: addr },
      update: {},
      create: {
        walletAddress: addr,
        username: `RobinAlpha_${i + 1}`,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${addr}`,
        bio: `EVM Builder and node operator on Robinhood Chain (ID: 4663).`,
      },
    });
  }

  // Seed 256 Squares (16 x 16 matrix)
  for (let i = 0; i < 256; i++) {
    const row = Math.floor(i / 16);
    const col = i % 16;
    const ownerIndex = i % SAMPLE_OWNERS.length;
    const ownerAddress = SAMPLE_OWNERS[ownerIndex].toLowerCase();
    const template = SAMPLE_HEADLINES[i % SAMPLE_HEADLINES.length];

    const basePrice = (0.02 + (i % 7) * 0.045 + (i % 3) * 0.08).toFixed(4);
    const depositEth = (parseFloat(basePrice) * 0.25).toFixed(4);

    await prisma.square.upsert({
      where: { id: i },
      update: {},
      create: {
        id: i,
        row,
        col,
        ownerAddress,
        currentPriceEth: basePrice,
        depositEth,
        dailyCarryRate: 0.01,
        isForSale: true,
        headline: i % 2 === 0 ? `${template.headline} #${i + 1}` : `Square Slot #${i}`,
        bodyText: template.body,
        linkUrl: template.url,
        imageUrl: `https://picsum.photos/seed/square${i}/400/200`,
        category: template.cat,
        accentColor: template.color,
        lastPurchasedAt: new Date(Date.now() - (i * 3600000)),
      },
    });
  }

  // Seed Initial Posts for Timeline Feed
  const initialPosts = [
    {
      title: "Robinhood Chain Broadcaster Protocol Goes Live",
      content: "Welcome to Robin Grid, the decentralized 256-slot broadsheet and Harberger post ledger deployed on Robinhood Chain Mainnet (Chain ID 4663). Every slot is owned, dynamically priced, and immediately available for peer-to-peer acquisition.",
      category: "Protocol",
      authorAddress: SAMPLE_OWNERS[0].toLowerCase(),
      squareId: 0,
      blockchainTxHash: "0x8fa9123456789abcdef0123456789abcdef0123456789abcdef0123456789abc1",
    },
    {
      title: "District 0 Billboard Auction Completed",
      content: "Top valuations across the center grid have established a robust 0.18 ETH floor price. Advertisers are streaming live creative banners with instant on-chain verification.",
      category: "Market",
      authorAddress: SAMPLE_OWNERS[1].toLowerCase(),
      squareId: 1,
      blockchainTxHash: "0x8fa9123456789abcdef0123456789abcdef0123456789abcdef0123456789abc2",
    },
    {
      title: "Real-time RPC Latency Benchmark: 45ms",
      content: "Node telemetry indicates excellent sub-second finality on the Robinhood Chain RPC endpoint. Seamless transaction submission enabled for all Web3 connectors.",
      category: "Tech",
      authorAddress: SAMPLE_OWNERS[2].toLowerCase(),
      squareId: 2,
      blockchainTxHash: "0x8fa9123456789abcdef0123456789abcdef0123456789abcdef0123456789abc3",
    },
  ];

  for (const p of initialPosts) {
    await prisma.post.upsert({
      where: { blockchainTxHash: p.blockchainTxHash },
      update: {},
      create: {
        title: p.title,
        content: p.content,
        category: p.category,
        authorAddress: p.authorAddress,
        squareId: p.squareId,
        blockchainTxHash: p.blockchainTxHash,
        chainId: 4663,
        status: "CONFIRMED",
      },
    });

    await prisma.activityLog.create({
      data: {
        userAddress: p.authorAddress,
        squareId: p.squareId,
        action: "POSTED_UPDATE",
        description: `Broadcasted article: "${p.title}"`,
        txHash: p.blockchainTxHash,
      },
    });
  }

  console.log("Seeding complete! 256 squares created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
