/**
 * Custom event tracking via Cloudflare Zaraz — a separate product from
 * Cloudflare Web Analytics (which only does automatic page views/vitals,
 * no custom events). Requires Zaraz to be enabled for the zone in the
 * Cloudflare dashboard; until then `window.zaraz` doesn't exist and every
 * call here is a silent no-op, so it's always safe to call.
 */

declare global {
  interface Window {
    zaraz?: {
      track: (eventName: string, payload?: Record<string, unknown>) => void;
    };
  }
}

export function trackEvent(name: string, payload?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.zaraz?.track) {
    window.zaraz.track(name, payload);
  }
}
