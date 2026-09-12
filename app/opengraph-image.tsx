import { ImageResponse } from "next/og";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { SITE_URL } from "@/lib/utils";

export const alt = "Tropijoy — Pure Joy In Every Bite";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LOGO_W = 2336;
const LOGO_H = 824;
const LOGO_DISPLAY_W = 760;
const LOGO_DISPLAY_H = Math.round((LOGO_DISPLAY_W / LOGO_W) * LOGO_H);

/**
 * Loads a public asset via the Worker's `ASSETS` binding instead of a
 * public `fetch()`. Cloudflare Workers has no filesystem at request time
 * (only the build container does), so `fs.readFile` 500s in production —
 * and a plain `fetch(SITE_URL + path)` from inside the Worker loops back
 * through Cloudflare's edge and 522s instead of resolving directly. The
 * `ASSETS` binding reads the static asset straight out of the deployed
 * bundle with no network round-trip, so it hits neither failure mode.
 * Falls back to a public fetch when no Cloudflare context exists (e.g.
 * mid `next build`, or local `next dev` without the binding wired up).
 */
async function fetchAsset(path: string): Promise<ArrayBuffer> {
  try {
    const { env } = getCloudflareContext();
    if (env.ASSETS) {
      const res = await env.ASSETS.fetch(new URL(path, SITE_URL));
      if (!res.ok) {
        throw new Error(`Failed to fetch OG asset ${path} via ASSETS binding: ${res.status}`);
      }
      return (await res.arrayBuffer()) as ArrayBuffer;
    }
  } catch {
    // No Cloudflare context available (build time / plain `next dev`) — fall through to fetch.
  }

  const res = await fetch(`${SITE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch OG asset ${path}: ${res.status}`);
  }
  return res.arrayBuffer();
}

async function toDataUri(path: string) {
  const buf = await fetchAsset(path);
  return `data:image/png;base64,${Buffer.from(buf).toString("base64")}`;
}

export default async function Image() {
  const [logoSrc, boldFont] = await Promise.all([
    toDataUri("/brand/logo-white.png"),
    fetchAsset("/fonts/Baloo2-Bold.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1A7D3E 0%, #116530 55%, #09381A 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori (the OG image renderer) requires plain <img> with data URIs; next/image isn't usable here. */}
        <img
          src={logoSrc}
          alt=""
          width={LOGO_DISPLAY_W}
          height={LOGO_DISPLAY_H}
          style={{ objectFit: "contain" }}
        />
        <div
          style={{
            marginTop: 32,
            fontFamily: "Baloo 2",
            fontWeight: 700,
            fontSize: 32,
            color: "rgba(255,255,255,0.85)",
            display: "flex",
          }}
        >
          Pure joy in every bite.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Baloo 2", data: boldFont, weight: 700, style: "normal" }],
    }
  );
}
