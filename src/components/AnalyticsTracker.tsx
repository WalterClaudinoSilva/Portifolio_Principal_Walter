"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Não registrar acessos ao painel admin
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const trackView = async () => {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: pathname }),
        });
      } catch (error) {
        // Silencioso em caso de erro
      }
    };

    trackView();
  }, [pathname]);

  return null;
}
