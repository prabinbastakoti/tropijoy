"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/** Minimum time the splash stays up, so it reads as a deliberate loading
 *  moment rather than a flicker on fast connections. */
const MIN_VISIBLE_MS = 500;

export default function LoadingScreen() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  // Re-arm on every route change — the App Router unmounts the previous
  // page's tree before the next one paints, so each navigation deserves
  // its own brief loading moment.
  useEffect(() => {
    setReady(false);
    const timer = setTimeout(() => setReady(true), MIN_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = ready ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ready]);

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-cream"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-40 h-16"
          >
            <Image
              src="/brand/logo-green.png"
              alt="Tropijoy"
              fill
              priority
              sizes="160px"
              className="object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
