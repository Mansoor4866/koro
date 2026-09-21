import Link from "next/link";
import { Grid } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#00E599]/20 border border-[#00E599]/40 flex items-center justify-center text-[#00E599] mb-4">
        <Grid className="w-6 h-6" />
      </div>
      <h1 className="text-3xl font-black mb-2">404 - Slot Not Found</h1>
      <p className="text-xs opacity-70 mb-6 max-w-sm">
        The requested square or route does not exist on KORO.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-[#00E599] text-black font-bold text-xs hover:opacity-90 transition"
      >
        Return to Matrix Board
      </Link>
    </div>
  );
}
