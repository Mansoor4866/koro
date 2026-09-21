import { SiweMessage, generateNonce } from "siwe";
import { prisma } from "./prisma";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "koro_auth_token";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function createAuthNonce(walletAddress: string, userAgent?: string): Promise<string> {
  const nonce = generateNonce();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // Nonce valid for 10 minutes

  // Ensure user exists
  await prisma.user.upsert({
    where: { walletAddress: walletAddress.toLowerCase() },
    update: {},
    create: {
      walletAddress: walletAddress.toLowerCase(),
      username: `Koro_${walletAddress.slice(2, 6)}`,
    },
  });

  await prisma.walletSession.create({
    data: {
      walletAddress: walletAddress.toLowerCase(),
      nonce,
      expiresAt,
      userAgent,
    },
  });

  return nonce;
}

export async function verifySignatureAndCreateSession(
  messageStr: string,
  signature: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const siweMessage = new SiweMessage(messageStr);
    const { data: fields } = await siweMessage.verify({ signature });

    const normalizedAddress = fields.address.toLowerCase();

    // Verify nonce exists and is not expired
    const session = await prisma.walletSession.findFirst({
      where: {
        walletAddress: normalizedAddress,
        nonce: fields.nonce,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      return { success: false, error: "Nonce expired or invalid session request." };
    }

    // Delete used nonce
    await prisma.walletSession.delete({
      where: { id: session.id },
    });

    // Fetch or update user
    const user = await prisma.user.upsert({
      where: { walletAddress: normalizedAddress },
      update: { updatedAt: new Date() },
      create: {
        walletAddress: normalizedAddress,
        username: `Koro_${normalizedAddress.slice(2, 6)}`,
      },
    });

    return { success: true, user };
  } catch (error: any) {
    console.error("SIWE Verification Error:", error);
    return { success: false, error: error.message || "Cryptographic verification failed." };
  }
}
