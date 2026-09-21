import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
  content: z.string().min(5, "Content must be at least 5 characters").max(5000, "Content cannot exceed 5000 characters"),
  squareId: z.number().int().min(0).max(255).optional().nullable(),
  authorAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum wallet address"),
  category: z.string().default("General"),
  linkUrl: z.string().url("Invalid URL format").optional().nullable().or(z.literal("")),
  mediaUrl: z.string().url("Invalid media URL format").optional().nullable().or(z.literal("")),
  blockchainTxHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid transaction hash format").optional().nullable(),
});

export const UpdateSquareSchema = z.object({
  squareId: z.number().int().min(0).max(255),
  headline: z.string().max(80).optional().nullable(),
  bodyText: z.string().max(500).optional().nullable(),
  linkUrl: z.string().url().optional().nullable().or(z.literal("")),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  category: z.string().optional(),
  accentColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).optional(),
  currentPriceEth: z.string().optional(),
  depositEth: z.string().optional(),
  ownerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum wallet address"),
  blockchainTxHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/).optional().nullable(),
});

export const BuySquareSchema = z.object({
  squareId: z.number().int().min(0).max(255),
  buyerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum wallet address"),
  newPriceEth: z.string(),
  depositEth: z.string(),
  headline: z.string().max(80).optional().nullable(),
  bodyText: z.string().max(500).optional().nullable(),
  linkUrl: z.string().url().optional().nullable().or(z.literal("")),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  category: z.string().optional(),
  blockchainTxHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid transaction hash"),
});

export const AuthVerifySchema = z.object({
  message: z.string(),
  signature: z.string().regex(/^0x[a-fA-F0-9]{130}$|^0x[a-fA-F0-9]{132}$/, "Invalid cryptographic signature"),
});
