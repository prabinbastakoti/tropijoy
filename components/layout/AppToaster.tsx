"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

/**
 * Bottom-right toasts work fine on desktop, but on mobile that corner is
 * already contested — the cart drawer's checkout button, the mobile nav
 * drawer, the ScrollToTop FAB, and (on short pages) the footer all live
 * there, so any fixed bottom offset we pick collides with one of them
 * somewhere on the site. Top-center sidesteps the whole class of overlap
 * instead of chasing a magic offset. Desktop keeps its original position.
 */
export default function AppToaster() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    setIsMobile(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <Toaster
      position={isMobile ? "top-center" : "bottom-right"}
      offset={isMobile ? { top: "108px" } : { bottom: "96px", right: "24px" }}
      mobileOffset={{ top: "108px" }}
      toastOptions={{
        style: {
          background: "#116530",
          color: "#FAF8F5",
          border: "1px solid rgba(232,141,53,0.3)",
        },
      }}
    />
  );
}
