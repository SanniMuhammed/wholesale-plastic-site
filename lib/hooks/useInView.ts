"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions extends IntersectionObserverInit {
  /** Stop observing after the first time it becomes true (default). Pass
   * `false` for elements that need continuous tracking, like a sentinel
   * used to toggle a sticky bar as it scrolls in and out. */
  once?: boolean;
}

export function useInView<T extends HTMLElement>(options?: UseInViewOptions) {
  const { once = true, ...rest } = options ?? {};
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px", ...rest }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once]);

  return { ref, inView } as const;
}
