import type { Dictionary } from "@/lib/getDictionary";
import type { HomepageSection } from "@/lib/cms/types";

type TrustBarProps = {
  dict: Dictionary;
  section?: HomepageSection;
  imageUrl?: string | null;
  mobileImageUrl?: string | null;
};

const icons = [
  <svg key="location" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s7-6.1 7-12A7 7 0 0 0 5 9c0 5.9 7 12 7 12Z" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.8" />
  </svg>,
  <svg key="delivery" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 6.5h11v10H3zM14 10h3.8l3.2 3.2v3.3H14z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="7" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="18" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.8" />
  </svg>,
  <svg key="international" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3.8 12h16.4M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5S14.2 18.2 12 20.5M12 3.5C9.8 5.8 8.7 8.6 8.7 12s1.1 6.2 3.3 8.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  <svg key="whatsapp" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M19.1 4.9A9.9 9.9 0 0 0 12 2a10 10 0 0 0-8.6 15.1L2.5 22l5-1.7A10 10 0 0 0 12 22h.1A10 10 0 0 0 19.1 4.9Z" stroke="currentColor" strokeWidth="1.7" />
    <path d="M8.2 7.6c.2-.4.4-.4.7-.4h.6c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5-.1.7l-.6.7c.7 1.2 1.6 2.1 2.9 2.8l.7-.7c.2-.2.4-.2.7-.1l1.8.8c.3.1.4.3.4.6 0 .8-.3 1.4-.8 1.7-.5.3-1.3.5-2.1.3-1.6-.3-3.3-1.2-4.7-2.6-1.4-1.4-2.3-3.1-2.6-4.7-.1-.7 0-1.4.3-1.9Z" fill="currentColor" />
  </svg>,
];

export function TrustBar({ dict, section, imageUrl, mobileImageUrl }: TrustBarProps) {
  if (section?.is_visible === false) return null;

  return (
    <section className="bg-background px-4 py-3 sm:px-6 sm:py-4">
      {imageUrl && (
        <picture className="mx-auto mb-3 block max-w-content overflow-hidden rounded-xl sm:mb-4">
          {mobileImageUrl && <source media="(max-width: 640px)" srcSet={mobileImageUrl} />}
          <img src={imageUrl} alt="" className="h-auto max-h-40 w-full object-cover" loading="lazy" />
        </picture>
      )}

      <div className="mx-auto grid max-w-content grid-cols-2 gap-px overflow-hidden rounded-2xl border border-brand/10 bg-brand/10 sm:grid-cols-4">
        {dict.trustBar.items.map((item, index) => (
          <div key={item} className="flex min-h-[76px] items-center gap-3 bg-brand-light/55 px-3 py-3 sm:min-h-[82px] sm:px-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand/20 bg-background text-brand">
              <span className="h-4.5 w-4.5">{icons[index]}</span>
            </span>
            <div className="min-w-0">
              <span className="block font-mono text-[10px] font-bold tracking-wider text-brand/75">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-0.5 block text-xs font-semibold leading-snug text-ink sm:text-sm">
                {item}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
