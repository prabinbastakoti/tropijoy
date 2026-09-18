/**
 * Site-wide maintenance switch.
 *
 * While `MAINTENANCE_MODE` is true, every route renders only the maintenance
 * screen (see `app/layout.tsx` and `middleware.ts`). Set it to `false` and
 * redeploy to bring the full site back.
 */
export const MAINTENANCE_MODE = true;

/** When the site reopens: midnight, 1 October 2026, Nepal Time (UTC+05:45). */
export const LAUNCH_AT = "2026-10-01T00:00:00+05:45";
