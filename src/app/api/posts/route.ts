import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreatePostSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);
    const category = searchParams.get("category");
    const author = searchParams.get("author");

    const where: any = {};
    if (category && category !== "All") {
      where.category = category;
    }
    if (author) {
      where.authorAddress = author.toLowerCase();
    }

    const posts = await prisma.post.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
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

    let nextCursor: string | null = null;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem ? nextItem.id : null;
    }

    return NextResponse.json({ posts, nextCursor });
  } catch (error: any) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ error: "Failed to load posts feed." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = CreatePostSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid post data.", details: parseResult.error.format() }, { status: 400 });
    }

    const { title, content, squareId, authorAddress, category, linkUrl, mediaUrl, blockchainTxHash } =
      parseResult.data;
    const normalizedAuthor = authorAddress.toLowerCase();

    // Ensure user exists
    await prisma.user.upsert({
      where: { walletAddress: normalizedAuthor },
      update: {},
      create: {
        walletAddress: normalizedAuthor,
        username: `Robin_${normalizedAuthor.slice(2, 6)}`,
      },
    });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        squareId: squareId !== undefined && squareId !== null ? squareId : null,
        authorAddress: normalizedAuthor,
        category: category || "General",
        linkUrl: linkUrl || null,
        mediaUrl: mediaUrl || null,
        blockchainTxHash: blockchainTxHash || null,
        status: blockchainTxHash ? "CONFIRMED" : "CONFIRMED",
      },
      include: {
        author: true,
        square: true,
      },
    });

    // Record activity
    await prisma.activityLog.create({
      data: {
        userAddress: normalizedAuthor,
        squareId: squareId || null,
        action: "POSTED_UPDATE",
        description: `Broadcasted article: "${title.slice(0, 40)}"`,
        txHash: blockchainTxHash || null,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error("Post creation failed:", error);
    return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
  }
}
