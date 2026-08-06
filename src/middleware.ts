import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (pathname === "/") {
    if (host.includes("coaching")) {
      const url = request.nextUrl.clone();
      url.pathname = "/coaching";
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }
    if (host.includes("consulting")) {
      const url = request.nextUrl.clone();
      url.pathname = "/consulting";
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }
    // Unbekannter/neutraler Host (lokal, Vorschau-URL): Türwahl-Seite zeigen.
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
