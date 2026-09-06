"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { cx } from "@/lib/utils";

function pathWithLocale(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  // segments[0] is "" (leading slash), segments[1] is the current locale.
  segments[1] = target;
  return segments.join("/") || `/${target}`;
}

export function LanguageSwitcher({ locale, className }: { locale: Locale; className?: string }) {
  const pathname = usePathname() || `/${locale}`;

  return (
    <div className={cx("flex items-center gap-1 text-sm font-medium", className)}>
      {locales.map((code, i) => (
        <span key={code} className="flex items-center gap-1">
          <Link
            href={pathWithLocale(pathname, code)}
            aria-current={code === locale ? "true" : undefined}
            className={cx(
              "uppercase tracking-normal transition-colors",
              code === locale ? "text-ink" : "text-muted hover:text-ink"
            )}
          >
            {code}
          </Link>
          {i < locales.length - 1 && <span className="text-border">|</span>}
        </span>
      ))}
    </div>
  );
}
