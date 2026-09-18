import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Under Maintenance",
  description:
    "Tropijoy is temporarily offline for maintenance. We'll be back on 1 October 2026.",
};

/**
 * `middleware.ts` rewrites every request here while maintenance mode is on,
 * so this route only exists to carry the metadata above. The visible screen
 * is rendered by the root layout, which is what keeps it guaranteed even if
 * a request somehow bypasses the middleware.
 */
export default function MaintenancePage() {
  return null;
}
