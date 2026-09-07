"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/getDictionary";
import { CartDrawer } from "@/components/cart/CartDrawer";

interface CartUIContextValue {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  /** The cart badge registers itself here; flyToCart animates toward it. */
  cartTargetRef: RefObject<HTMLSpanElement>;
  flyToCart: (fromEl: HTMLElement | null) => void;
}

const CartUIContext = createContext<CartUIContextValue | undefined>(undefined);

const FLIGHT_MS = 550;
const FLIGHT_COLOR = "#1C4632"; // brand.DEFAULT -- the one moment that gets a color of its own

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
  const cartTargetRef = useRef<HTMLSpanElement>(null);
  const flightLayerRef = useRef<HTMLDivElement>(null);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const flyToCart = useCallback((fromEl: HTMLElement | null) => {
    const target = cartTargetRef.current;
    const layer = flightLayerRef.current;
    if (!fromEl || !target || !layer) return;

    // Bump the badge regardless of motion preference -- the count itself
    // is the important feedback. The travelling dot is the optional part.
    target.classList.remove("animate-pop");
    void target.offsetWidth; // reflow, so re-adding the class retriggers it
    target.classList.add("animate-pop");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = target.getBoundingClientRect();

    const dot = document.createElement("span");
    dot.style.position = "fixed";
    dot.style.left = `${fromRect.left + fromRect.width / 2 - 6}px`;
    dot.style.top = `${fromRect.top + fromRect.height / 2 - 6}px`;
    dot.style.width = "12px";
    dot.style.height = "12px";
    dot.style.borderRadius = "9999px";
    dot.style.background = FLIGHT_COLOR;
    dot.style.pointerEvents = "none";
    dot.style.transition = `transform ${FLIGHT_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity ${FLIGHT_MS}ms ease`;
    dot.style.willChange = "transform, opacity";
    layer.appendChild(dot);

    const dx = toRect.left + toRect.width / 2 - (fromRect.left + fromRect.width / 2);
    const dy = toRect.top + toRect.height / 2 - (fromRect.top + fromRect.height / 2);

    requestAnimationFrame(() => {
      dot.style.transform = `translate(${dx}px, ${dy}px) scale(0.3)`;
      dot.style.opacity = "0.35";
    });

    window.setTimeout(() => dot.remove(), FLIGHT_MS + 50);
  }, []);

  return (
    <CartUIContext.Provider value={{ isDrawerOpen, openDrawer, closeDrawer, cartTargetRef, flyToCart }}>
      {children}
      <div ref={flightLayerRef} aria-hidden className="pointer-events-none fixed inset-0 z-[70]" />
      <CartDrawer locale={locale} dict={dict} open={isDrawerOpen} onClose={closeDrawer} />
    </CartUIContext.Provider>
  );
}

export function useCartUI(): CartUIContextValue {
  const ctx = useContext(CartUIContext);
  if (!ctx) throw new Error("useCartUI must be used within a CartUIProvider");
  return ctx;
}
