"use client";

import { useEffect, useState } from "react";

/**
 * Persisted Zustand stores read from localStorage, which is unavailable during
 * SSR — rendering their values on the first client pass causes a hydration
 * mismatch. Gate any such render behind this hook.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
