"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AddedToast, type ToastPayload } from "@/components/cart/AddedToast";

interface CartUIContextValue {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  /** Animates a dot from the clicked button to whichever cart badge is
   *  currently visible, and bumps that badge. */
  flyToCart: (fromEl: HTMLElement | null) => void;
  /** Shows a short-lived "added to order" toast, independent of the flight
   *  animation -- the flight is a flourish; this is the confirmation that
   *  must always be visible, even off-screen from the cart icon. */
  notifyAdded: (productName: string) => void;
}

const CartUIContext = createContext<CartUIContextValue | undefined>(undefined);

const FLIGHT_MS = 650;
const TOAST_MS = 2600;
// The one moment that gets a color of its own.
const FLIGHT_COLOR = "#1C4632"; // brand.DEFAULT

export function CartUIProvider({
  children,
  locale,
  dict,
}: {
  children: ReactNode;
  locale: Locale;
  dict: Dictionary;
}) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const flightLayerRef = useRef<HTMLDivElement>(null);
  const toastIdRef = useRef(0);
  const toastTimeoutRef = useRef<number | null>(null);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const notifyAdded = useCallback((productName: string) => {
    toastIdRef.current += 1;
    setToast({ id: toastIdRef.current, productName });
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  const flyToCart = useCallback((fromEl: HTMLElement | null) => {
    const layer = flightLayerRef.current;
    if (!fromEl || !layer) return;

    // There can be more than one cart-badge element mounted at once (a
    // desktop nav badge and a mobile header badge both exist in the DOM;
    // only one is ever visible per viewport, via CSS). A ref pointing at
    // whichever one last mounted goes stale the moment the OTHER one
    // renders instead -- e.g. after the mobile menu opens and closes, the
    // ref pointed at a since-unmounted node and every animation after that
    // silently did nothing. Looking the visible one up live, at the moment
    // of the click, sidesteps that entirely.
    const candidates = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-badge]"));
    const target = candidates.find((el) => el.offsetParent !== null) ?? candidates[0];
    if (!target) return;

    target.classList.remove("animate-pop");
    void target.offsetWidth; // reflow, so re-adding the class retriggers it
    target.classList.add("animate-pop");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = target.getBoundingClientRect();

    const dot = document.createElement("span");
    dot.style.position = "fixed";
    dot.style.left = `${fromRect.left + fromRect.width / 2 - 9}px`;
    dot.style.top = `${fromRect.top + fromRect.height / 2 - 9}px`;
    dot.style.width = "18px";
    dot.style.height = "18px";
    dot.style.borderRadius = "9999px";
    dot.style.background = FLIGHT_COLOR;
    dot.style.boxShadow = "0 2px 10px rgba(27,27,23,0.35)";
    dot.style.pointerEvents = "none";
    dot.style.willChange = "transform, opacity";
    dot.style.zIndex = "70";
    layer.appendChild(dot);

    const dx = toRect.left + toRect.width / 2 - (fromRect.left + fromRect.width / 2);
    const dy = toRect.top + toRect.height / 2 - (fromRect.top + fromRect.height / 2);
    // A slight upward arc reads as "thrown" rather than "slid" -- much
    // easier to catch in peripheral vision than a straight fade-out.
    const arcLift = Math.min(90, Math.abs(dy) * 0.6 + 40);

    const animation = dot.animate(
      [
        { transform: "translate(0px, 0px) scale(0.5)", opacity: 0.9, offset: 0 },
        { transform: "translate(0px, 0px) scale(1)", opacity: 1, offset: 0.14 },
        {
          transform: `translate(${dx * 0.55}px, ${dy * 0.4 - arcLift}px) scale(0.9)`,
          opacity: 1,
          offset: 0.6,
        },
        { transform: `translate(${dx}px, ${dy}px) scale(0.25)`, opacity: 0.2, offset: 1 },
      ],
      { duration: FLIGHT_MS, easing: "cubic-bezier(0.3, 0, 0.2, 1)", fill: "forwards" }
    );

    animation.onfinish = () => dot.remove();
  }, []);

  return (
    <CartUIContext.Provider
      value={{ isDrawerOpen, openDrawer, closeDrawer, flyToCart, notifyAdded }}
    >
      {children}
      <div ref={flightLayerRef} aria-hidden className="pointer-events-none fixed inset-0 z-[70]" />
      <AddedToast toast={toast} label={dict.common.addedToOrder} />
      <CartDrawer locale={locale} dict={dict} open={isDrawerOpen} onClose={closeDrawer} />
    </CartUIContext.Provider>
  );
}

export function useCartUI(): CartUIContextValue {
  const ctx = useContext(CartUIContext);
  if (!ctx) throw new Error("useCartUI must be used within a CartUIProvider");
  return ctx;
}
