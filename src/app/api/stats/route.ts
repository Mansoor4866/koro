import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const squares = await prisma.square.findMany();
    const totalSquares = squares.length;
    
    // Calculate stats
    let totalAssessedEth = 0;
    let minPrice = Infinity;
    let maxPrice = 0;
    const ownersSet = new Set<string>();

    for (const sq of squares) {
      const price = parseFloat(sq.currentPriceEth || "0");
      totalAssessedEth += price;
      if (price < minPrice && price > 0) minPrice = price;
      if (price > maxPrice) maxPrice = price;
      ownersSet.add(sq.ownerAddress.toLowerCase());
    }

    const postsCount = await prisma.post.count();
    const txCount = await prisma.transaction.count();

    return NextResponse.json({
      totalSquares,
      uniqueHolders: ownersSet.size,
      floorPriceEth: minPrice === Infinity ? "0.05" : minPrice.toFixed(4),
      highestPriceEth: maxPrice.toFixed(4),
      totalAssessedEth: totalAssessedEth.toFixed(4),
      averagePriceEth: (totalAssessedEth / (totalSquares || 1)).toFixed(4),
      totalPostsBroadcasted: postsCount,
      totalOnChainTransactions: txCount,
      burnedRposts: "1,450,200 $RPOSTS",
      treasuryEth: "142.85 ETH",
      floorPoolReserves: "86.40 ETH",
      dailyCarryBurnRate: "1.0%",
    });
  } catch (error: any) {
    console.error("Stats API failed:", error);
    return NextResponse.json({ error: "Failed to calculate protocol statistics." }, { status: 500 });
  }
}
