import { NextRequest, NextResponse } from "next/server";

const ADMIN_HOST = "admin.ijlan.dev";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  if (host !== ADMIN_HOST) return NextResponse.next();

  const { pathname } = request.nextUrl;

  if (pathname === "/api" || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice("/admin".length) || "/";
    return NextResponse.redirect(url);
  }

  const response = NextResponse.rewrite(new URL(`/admin${pathname}`, request.url));
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/((?!_next|icon$|apple-icon$|opengraph-image$|.*\\..*).*)"],
};
