import { NextResponse, type NextRequest } from "next/server";
import { LAUNCH_AT, MAINTENANCE_MODE } from "@/lib/maintenance";

/**
 * While maintenance mode is on, serve /maintenance for every page with a 503
 * so search engines treat the downtime as temporary instead of indexing the
 * maintenance screen as the site's content.
 */
export function middleware(request: NextRequest) {
  if (!MAINTENANCE_MODE) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/maintenance";

  return NextResponse.rewrite(url, {
    status: 503,
    headers: {
      "Retry-After": new Date(LAUNCH_AT).toUTCString(),
      // Never let a CDN keep serving the 503 after the site reopens.
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  // Skip Next.js internals and anything with a file extension (images, fonts,
  // sitemap.xml, robots.txt…). /opengraph-image has no extension but must stay
  // reachable for link previews.
  matcher: ["/((?!_next/|opengraph-image|.*\\..*).*)"],
};
