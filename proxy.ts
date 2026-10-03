import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "ar"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const accept = (req.headers.get("accept-language") ?? "").toLowerCase();
  const locale = accept.startsWith("ar") ? "ar" : "en";
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };
