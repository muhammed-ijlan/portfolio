import { NextRequest, NextResponse } from "next/server";

const ADMIN_HOST = "admin.ijlan.dev";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  if (host !== ADMIN_HOST) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // API routes are shared with the main site — never prefix them.
  if (pathname === "/api" || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // The app's internal links and redirects point at /admin/* — on the admin
  // host, strip the prefix from the address bar so the rewrite below doesn't
  // double up to /admin/admin/* and 404.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice("/admin".length) || "/";
    return NextResponse.redirect(url);
  }

  const response = NextResponse.rewrite(new URL(`/admin${pathname}`, request.url));
  // The CMS is private — keep the subdomain out of search results.
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  // Skip Next internals, static files (anything with an extension), and
  // generated metadata routes shared with the main site.
  matcher: ["/((?!_next|icon$|apple-icon$|opengraph-image$|.*\\..*).*)"],
};
