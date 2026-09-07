"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SaveStatusPill, type SaveState } from "@/components/admin/AdminUI";
import {
  createProductAction,
  updateProductAction,
} from "@/app/admin/(dashboard)/products/actions";
import type { Category, Color, Product, ProductInput } from "@/lib/cms/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const emptyForm = (): ProductInput => ({
  slug: "",
  category_id: null,
  name_en: "",
  name_fr: "",
  short_description_en: "",
  short_description_fr: "",
  description_en: "",
  description_fr: "",
  capacity: "",
  material_en: "",
  material_fr: "",
  packaging_en: "",
  packaging_fr: "",
  use_case_en: "",
  use_case_fr: "",
  wholesale_only: true,
  availability_status: "in_stock",
  is_featured: false,
  status: "draft",
  sort_order: 0,
  legacy_slug: null,
});

export function ProductForm({
  categories,
  colors,
  product,
}: {
  categories: Category[];
  colors: Color[];
  product?: Product;
}) {
  const router = useRouter();
  const isNew = !product;
  const [form, setForm] = useState<ProductInput>(
    product
      ? {
          slug: product.slug,
          category_id: product.category_id,
          name_en: product.name_en,
          name_fr: product.name_fr,
          short_description_en: product.short_description_en,
          short_description_fr: product.short_description_fr,
          description_en: product.description_en,
          description_fr: product.description_fr,
          capacity: product.capacity || "",
          material_en: product.material_en,
          material_fr: product.material_fr,
          packaging_en: product.packaging_en,
          packaging_fr: product.packaging_fr,
          use_case_en: product.use_case_en,
          use_case_fr: product.use_case_fr,
          wholesale_only: product.wholesale_only,
          availability_status: product.availability_status,
          is_featured: product.is_featured,
          status: product.status,
          sort_order: product.sort_order,
          legacy_slug: product.legacy_slug,
        }
      : emptyForm()
  );
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [selectedColorIds, setSelectedColorIds] = useState<string[]>(
    product?.colors?.map((c) => c.id) ?? []
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>();

  function field<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleNameChange(value: string) {
    field("name_en", value);
    if (!slugTouched) field("slug", slugify(value));
  }

  function toggleColor(id: string) {
    setSelectedColorIds((ids) => (ids.includes(id) ? ids.filter((c) => c !== id) : [...ids, id]));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaveState("saving");
    setErrorMessage(undefined);
    try {
      if (isNew) {
        const created = await createProductAction(form, selectedColorIds);
        router.push(`/admin/products/${created.id}`);
      } else {
        await updateProductAction(product.id, form, selectedColorIds);
        setSaveState("saved");
        router.refresh();
      }
    } catch (err) {
      setSaveState("error");
      setErrorMessage(err instanceof Error ? err.message : "Could not save.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 pb-24">
      <Section title="Basics">
        <Field label="Name (English)">
          <input
            required
            value={form.name_en}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Name (French)">
          <input
            required
            value={form.name_fr}
            onChange={(e) => field("name_fr", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Slug" hint="Used in the product's URL. Only edit if you know why.">
          <input
            required
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              field("slug", slugify(e.target.value));
            }}
            className={`${inputClass} font-mono text-sm`}
          />
        </Field>
        <Field label="Category">
          <select
            value={form.category_id ?? ""}
            onChange={(e) => field("category_id", e.target.value || null)}
            className={inputClass}
          >
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_en}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Capacity" hint="e.g. 25 L. Leave blank if not applicable.">
          <input
            value={form.capacity ?? ""}
            onChange={(e) => field("capacity", e.target.value)}
            className={inputClass}
          />
        </Field>
      </Section>

      <Section title="Descriptions">
        <Field label="Short description (English)">
          <textarea
            rows={2}
            value={form.short_description_en}
            onChange={(e) => field("short_description_en", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Short description (French)">
          <textarea
            rows={2}
            value={form.short_description_fr}
            onChange={(e) => field("short_description_fr", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Full description (English)">
          <textarea
            rows={4}
            value={form.description_en}
            onChange={(e) => field("description_en", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Full description (French)">
          <textarea
            rows={4}
            value={form.description_fr}
            onChange={(e) => field("description_fr", e.target.value)}
            className={inputClass}
          />
        </Field>
      </Section>

      <Section title="Specifications">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Material (English)">
            <input
              value={form.material_en}
              onChange={(e) => field("material_en", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Material (French)">
            <input
              value={form.material_fr}
              onChange={(e) => field("material_fr", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Packaging (English)">
            <input
              value={form.packaging_en}
              onChange={(e) => field("packaging_en", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Packaging (French)">
            <input
              value={form.packaging_fr}
              onChange={(e) => field("packaging_fr", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Use case (English)">
            <input
              value={form.use_case_en}
              onChange={(e) => field("use_case_en", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Use case (French)">
            <input
              value={form.use_case_fr}
              onChange={(e) => field("use_case_fr", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="Colours">
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const active = selectedColorIds.includes(color.id);
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => toggleColor(color.id)}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors ${
                  active ? "border-ink bg-ink text-surface" : "border-border text-ink-soft"
                }`}
              >
                <span
                  className="h-3.5 w-3.5 rounded-full border border-black/10"
                  style={{ backgroundColor: color.hex }}
                />
                {color.label_en}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Status">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Availability">
            <select
              value={form.availability_status}
              onChange={(e) => field("availability_status", e.target.value as ProductInput["availability_status"])}
              className={inputClass}
            >
              <option value="in_stock">In stock</option>
              <option value="limited">Limited</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </Field>
          <Field label="Publish state">
            <select
              value={form.status}
              onChange={(e) => field("status", e.target.value as ProductInput["status"])}
              className={inputClass}
            >
              <option value="draft">Draft (hidden from the site)</option>
              <option value="published">Published</option>
            </select>
          </Field>
        </div>
        <label className="mt-1 flex items-center gap-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => field("is_featured", e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          Feature on the homepage
        </label>
        <label className="flex items-center gap-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={form.wholesale_only}
            onChange={(e) => field("wholesale_only", e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          Wholesale only
        </label>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-between gap-3 border-t border-border bg-surface px-4 py-3 sm:sticky sm:rounded-lg sm:border">
        <SaveStatusPill state={saveState} errorMessage={errorMessage} />
        <button
          type="submit"
          disabled={saveState === "saving"}
          className="ml-auto inline-flex items-center justify-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface hover:bg-brand-dark disabled:opacity-60"
        >
          {isNew ? "Create product" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <h2 className="mb-4 text-sm font-semibold text-ink">{title}</h2>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink-soft">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";
