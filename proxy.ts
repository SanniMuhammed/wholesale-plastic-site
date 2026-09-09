import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { updateAdminSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin has its own auth flow and does not use locale prefixes.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return updateAdminSession(request);
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (pathnameHasLocale) return;

  // Use the browser language when the URL has no locale yet.
  const acceptLanguage = request.headers.get("accept-language") || "";
  const preferredLocale = acceptLanguage.toLowerCase().includes("fr") ? "fr" : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
