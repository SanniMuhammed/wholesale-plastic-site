import { MessageCircle } from "lucide-react";
import { cx } from "@/lib/utils";

interface WhatsAppLinkProps {
  href: string;
  label: string;
  variant?: "button" | "icon" | "text";
  className?: string;
}

export function WhatsAppLink({ href, label, variant = "button", className }: WhatsAppLinkProps) {
  if (variant === "icon") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={cx(
          "inline-flex h-9 w-9 items-center justify-center rounded border border-surface/35 text-surface hover:border-surface hover:bg-surface/10 transition-colors",
          className
        )}
      >
        <MessageCircle size={18} strokeWidth={1.75} />
      </a>
    );
  }

  if (variant === "text") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cx("inline-flex items-center gap-1.5 text-sm font-medium text-surface hover:text-surface/80 transition-colors", className)}
      >
        <MessageCircle size={16} strokeWidth={1.75} />
        {label}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded border border-ink px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink hover:text-surface transition-colors",
        className
      )}
    >
      <MessageCircle size={16} strokeWidth={1.75} />
      {label}
    </a>
  );
}
