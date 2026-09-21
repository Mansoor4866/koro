"use client";

import { useEffect, useState } from "react";
import { EIP6963ProviderDetail } from "@/types";

declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent<EIP6963ProviderDetail>;
  }
}

export function useEIP6963Wallets() {
  const [providers, setProviders] = useState<EIP6963ProviderDetail[]>([]);

  useEffect(() => {
    function handleAnnouncement(event: CustomEvent<EIP6963ProviderDetail>) {
      if (!event.detail || !event.detail.info) return;
      setProviders((prev) => {
        if (prev.some((p) => p.info.uuid === event.detail.info.uuid || p.info.rdns === event.detail.info.rdns)) {
          return prev;
        }
        return [...prev, event.detail];
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener("eip6963:announceProvider", handleAnnouncement as EventListener);
      window.dispatchEvent(new Event("eip6963:requestProvider"));
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("eip6963:announceProvider", handleAnnouncement as EventListener);
      }
    };
  }, []);

  return { providers };
}
