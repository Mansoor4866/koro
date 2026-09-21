import { NextRequest, NextResponse } from "next/server";
import { createAuthNonce } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address } = body;

    if (!address || typeof address !== "string" || !address.startsWith("0x")) {
      return NextResponse.json({ error: "A valid wallet address is required." }, { status: 400 });
    }

    const userAgent = req.headers.get("user-agent") || undefined;
    const nonce = await createAuthNonce(address, userAgent);

    return NextResponse.json({ nonce });
  } catch (error: any) {
    console.error("Failed to generate SIWE nonce:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
