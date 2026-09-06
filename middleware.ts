import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (pathnameHasLocale) return;

  // No locale in the URL yet -- infer one from Accept-Language and redirect.
  // Francophone visitors land on /fr by default; everyone else gets /en.
  const acceptLanguage = request.headers.get("accept-language") || "";
  const preferredLocale = acceptLanguage.toLowerCase().includes("fr") ? "fr" : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
