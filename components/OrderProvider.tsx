"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface OrderItem {
  slug: string;
  quantity: number;
}

interface OrderContextValue {
  items: OrderItem[];
  addItem: (slug: string, quantity?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);
const STORAGE_KEY = "wholesale-order";

export function OrderProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // localStorage is browser-only, so the initial server render must remain empty.
  // Hydrating the persisted order once is intentional; the lint rule otherwise
  // treats this external-store synchronization as a cascading render.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(raw));
      }
    } catch {
      // Malformed or unavailable storage -- start with an empty order.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (e.g. private browsing) -- order won't persist.
    }
  }, [items, hydrated]);

  function addItem(slug: string, quantity: number = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === slug ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { slug, quantity }];
    });
  }

  function removeItem(slug: string) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  function updateQuantity(slug: string, quantity: number) {
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  }

  function clear() {
    setItems([]);
  }

  return (
    <OrderContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within an OrderProvider");
  return ctx;
}
