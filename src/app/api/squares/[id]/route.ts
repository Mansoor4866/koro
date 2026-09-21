import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BuySquareSchema, UpdateSquareSchema } from "@/lib/validation";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const squareId = parseInt(id, 10);

    if (isNaN(squareId) || squareId < 0 || squareId > 255) {
      return NextResponse.json({ error: "Invalid square ID (must be 0-255)." }, { status: 400 });
    }

    const square = await prisma.square.findUnique({
      where: { id: squareId },
      include: {
        owner: true,
        posts: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        activityLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!square) {
      return NextResponse.json({ error: "Square not found." }, { status: 404 });
    }

    return NextResponse.json({ square });
  } catch (error: any) {
    console.error("Failed to fetch square details:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const squareId = parseInt(id, 10);
    const body = await req.json();

    if (body.action === "BUY") {
      const parseResult = BuySquareSchema.safeParse({ ...body, squareId });
      if (!parseResult.success) {
        return NextResponse.json({ error: "Invalid payload.", details: parseResult.error.format() }, { status: 400 });
      }

      const { buyerAddress, newPriceEth, depositEth, headline, bodyText, linkUrl, imageUrl, category, blockchainTxHash } =
        parseResult.data;
      const normalizedBuyer = buyerAddress.toLowerCase();

      // Ensure buyer user exists
      await prisma.user.upsert({
        where: { walletAddress: normalizedBuyer },
        update: {},
        create: {
          walletAddress: normalizedBuyer,
          username: `Robin_${normalizedBuyer.slice(2, 6)}`,
        },
      });

      const updatedSquare = await prisma.square.update({
        where: { id: squareId },
        data: {
          ownerAddress: normalizedBuyer,
          currentPriceEth: newPriceEth,
          depositEth: depositEth,
          headline: headline || `Acquired on Robinhood Chain`,
          bodyText: bodyText || `Slot #${squareId} belongs to ${normalizedBuyer.slice(0, 6)}...${normalizedBuyer.slice(-4)}`,
          linkUrl: linkUrl || null,
          imageUrl: imageUrl || null,
          category: category || "General",
          lastPurchasedAt: new Date(),
        },
      });

      // Record transaction
      if (blockchainTxHash) {
        await prisma.transaction.create({
          data: {
            txHash: blockchainTxHash,
            userAddress: normalizedBuyer,
            squareId,
            txType: "BUY_SQUARE",
            amountEth: newPriceEth,
            status: "CONFIRMED",
          },
        });
      }

      // Record activity
      await prisma.activityLog.create({
        data: {
          userAddress: normalizedBuyer,
          squareId,
          action: "BOUGHT_SQUARE",
          description: `Acquired Square #${squareId} for ${newPriceEth} ETH`,
          txHash: blockchainTxHash || null,
        },
      });

      return NextResponse.json({ success: true, square: updatedSquare });
    }

    if (body.action === "UPDATE_CREATIVE") {
      const parseResult = UpdateSquareSchema.safeParse({ ...body, squareId });
      if (!parseResult.success) {
        return NextResponse.json({ error: "Invalid payload.", details: parseResult.error.format() }, { status: 400 });
      }

      const { ownerAddress, headline, bodyText, linkUrl, imageUrl, category, accentColor, currentPriceEth, depositEth, blockchainTxHash } =
        parseResult.data;
      const normalizedOwner = ownerAddress.toLowerCase();

      const existing = await prisma.square.findUnique({ where: { id: squareId } });
      if (!existing || existing.ownerAddress.toLowerCase() !== normalizedOwner) {
        return NextResponse.json({ error: "Only the square holder can update this creative." }, { status: 403 });
      }

      const updatedSquare = await prisma.square.update({
        where: { id: squareId },
        data: {
          headline: headline !== undefined ? headline : existing.headline,
          bodyText: bodyText !== undefined ? bodyText : existing.bodyText,
          linkUrl: linkUrl !== undefined ? linkUrl : existing.linkUrl,
          imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
          category: category || existing.category,
          accentColor: accentColor || existing.accentColor,
          currentPriceEth: currentPriceEth || existing.currentPriceEth,
          depositEth: depositEth || existing.depositEth,
        },
      });

      await prisma.activityLog.create({
        data: {
          userAddress: normalizedOwner,
          squareId,
          action: "POSTED_UPDATE",
          description: `Updated creative on Square #${squareId}`,
          txHash: blockchainTxHash || null,
        },
      });

      return NextResponse.json({ success: true, square: updatedSquare });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error: any) {
    console.error("Square mutation failed:", error);
    return NextResponse.json({ error: "Failed to update square." }, { status: 500 });
  }
}
