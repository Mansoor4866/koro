import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "KORO · Decentralized Broadsheet & Matrix on Robinhood Chain",
  description: "256 on-chain advertising squares on Robinhood Chain (ID: 4663). Continuously priced, self-assessed, and live on KORO.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "KORO · Robinhood Chain",
    description: "256 on-chain squares on Robinhood Chain. Self-assessed Harberger pricing and live broadsheet on KORO.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen selection:bg-[#00E599] selection:text-black">
        <ThemeProvider>
          <Web3Provider>{children}</Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
