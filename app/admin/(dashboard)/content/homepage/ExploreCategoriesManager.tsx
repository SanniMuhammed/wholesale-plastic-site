"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CategoryManager } from "../../categories/CategoryManager";
import type { Category } from "@/lib/cms/types";

export function ExploreCategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="my-3 overflow-hidden rounded-lg border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span>
          <span className="block text-sm font-medium text-ink">Explore categories</span>
          <span className="mt-1 block text-xs text-muted">
            Upload, replace, or remove the photos used by the homepage Explore grid.
          </span>
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && <CategoryManager initialCategories={initialCategories} />}
    </section>
  );
}
