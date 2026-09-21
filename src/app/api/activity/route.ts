import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "30", 10), 100);

    const activities = await prisma.activityLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            walletAddress: true,
            username: true,
            avatarUrl: true,
          },
        },
        square: {
          select: {
            id: true,
            headline: true,
            currentPriceEth: true,
          },
        },
      },
    });

    return NextResponse.json({ activities });
  } catch (error: any) {
    console.error("Failed to fetch activities:", error);
    return NextResponse.json({ error: "Failed to load live activity tape." }, { status: 500 });
  }
}
