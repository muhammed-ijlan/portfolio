import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const host = request.headers.get("host");

    if (host === "admin.ijlan.dev") {
        const pathname = request.nextUrl.pathname;

        return NextResponse.rewrite(
            new URL(`/admin${pathname}`, request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico).*)"],
};