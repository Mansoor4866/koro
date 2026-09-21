import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const forSale = searchParams.get("forSale");
    const owner = searchParams.get("owner");

    const where: any = {};
    if (category && category !== "All") {
      where.category = category;
    }
    if (forSale === "true") {
      where.isForSale = true;
    }
    if (owner) {
      where.ownerAddress = owner.toLowerCase();
    }

    const squares = await prisma.square.findMany({
      where,
      orderBy: { id: "asc" },
      include: {
        owner: {
          select: {
            walletAddress: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ squares, total: squares.length });
  } catch (error: any) {
    console.error("Failed to fetch squares:", error);
    return NextResponse.json({ error: "Failed to fetch square ledger." }, { status: 500 });
  }
}
