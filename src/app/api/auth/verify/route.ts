import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAndCreateSession } from "@/lib/auth";
import { AuthVerifySchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = AuthVerifySchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid verification payload.", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { message, signature } = parseResult.data;
    const result = await verifySignatureAndCreateSession(message, signature);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Signature verification failed." }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      message: "Wallet verified and session established.",
    });
  } catch (error: any) {
    console.error("Auth verification failed:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
