"use client";

import { useMemo, useState, type FormEvent } from "react";
import { SaveStatusPill, type SaveState } from "@/components/admin/AdminUI";

type AboutContent = { intro: string; sections: Array<{ heading: string; body: string }> };

export const DEFAULT_ABOUT: { en: AboutContent; fr: AboutContent } = {
  en: { intro: "A Nigerian wholesale plastic supplier helping businesses source products from Nigeria without unnecessary travel.", sections: [
    { heading: "Where We're Based", body: "Sherinab Venture LTD is based in Saki, Oyo State, Nigeria, supplying plastic products to businesses." },
    { heading: "What We Supply", body: "We offer buckets, basins, bowls, containers and other plastic products for wholesale purchasing." },
    { heading: "Who We Serve", body: "We support retailers, market traders, distributors and entrepreneurs who want to source from Nigeria." },
    { heading: "Our Approach", body: "Choose your products, tell us your quantities and destination, then our team helps confirm the order and delivery details." },
  ]},
  fr: { intro: "Un fournisseur nigérian de produits plastiques en gros, au service des entreprises qui souhaitent s'approvisionner depuis le Nigeria.", sections: [
    { heading: "Notre implantation", body: "Sherinab Venture LTD est basée à Saki, dans l'État d'Oyo, au Nigeria, et fournit des produits plastiques aux entreprises." },
    { heading: "Ce que nous fournissons", body: "Nous proposons des seaux, bassines, bols, contenants et autres produits plastiques pour l'approvisionnement en gros." },
    { heading: "À qui nous nous adressons", body: "Nous accompagnons détaillants, commerçants, distributeurs et entrepreneurs qui souhaitent s'approvisionner depuis le Nigeria." },
    { heading: "Notre approche", body: "Choisissez vos produits, indiquez vos quantités et votre destination, puis notre équipe vous aide à confirmer la commande et la livraison." },
  ]},
};

function parse(value: string, fallback: AboutContent): AboutContent {
  try {
    const parsed = JSON.parse(value);
    if (parsed?.intro && Array.isArray(parsed.sections) && parsed.sections.length === 4) return parsed;
  } catch {}
  return fallback;
}

export function AboutContentForm({ bodyEn, bodyFr, onSave }: { bodyEn: string; bodyFr: string; onSave: (input: { body_en: string; body_fr: string }) => Promise<unknown> }) {
  const initial = useMemo(() => ({ en: parse(bodyEn, DEFAULT_ABOUT.en), fr: parse(bodyFr, DEFAULT_ABOUT.fr) }), [bodyEn, bodyFr]);
  const [en, setEn] = useState(initial.en);
  const [fr, setFr] = useState(initial.fr);
  const [state, setState] = useState<SaveState>("idle");

  function update(locale: "en" | "fr", patch: Partial<AboutContent>) {
    if (locale === "en") setEn((v) => ({ ...v, ...patch }));
    else setFr((v) => ({ ...v, ...patch }));
  }
  function updateSection(locale: "en" | "fr", index: number, patch: Partial<AboutContent["sections"][number]>) {
    const setter = locale === "en" ? setEn : setFr;
    setter((v) => ({ ...v, sections: v.sections.map((s, i) => i === index ? { ...s, ...patch } : s) }));
  }
  async function submit(e: FormEvent) {
    e.preventDefault(); setState("saving");
    try { await onSave({ body_en: JSON.stringify(en), body_fr: JSON.stringify(fr) }); setState("saved"); } catch { setState("error"); }
  }

  return <form onSubmit={submit} className="grid gap-6">
    {[{ key: "en" as const, label: "English", value: en }, { key: "fr" as const, label: "French", value: fr }].map(({ key, label, value }) => (
      <section key={key} className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-ink">{label}</h2>
        <label className="mt-4 block"><span className="mb-1 block text-sm font-medium text-ink-soft">Introduction</span><textarea rows={3} value={value.intro} onChange={(e) => update(key, { intro: e.target.value })} className="w-full rounded border border-border px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none" /></label>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {value.sections.map((section, i) => <div key={i} className="rounded border border-border bg-background p-4">
            <p className="font-mono text-[10px] font-bold text-brand">{String(i + 1).padStart(2, "0")}</p>
            <label className="mt-2 block"><span className="mb-1 block text-xs font-medium text-ink-soft">Heading</span><input value={section.heading} onChange={(e) => updateSection(key, i, { heading: e.target.value })} className="w-full rounded border border-border px-3 py-2 text-sm text-ink" /></label>
            <label className="mt-3 block"><span className="mb-1 block text-xs font-medium text-ink-soft">Text</span><textarea rows={4} value={section.body} onChange={(e) => updateSection(key, i, { body: e.target.value })} className="w-full rounded border border-border px-3 py-2 text-sm text-ink" /></label>
          </div>)}
        </div>
      </section>
    ))}
    <div className="flex items-center justify-between gap-3"><SaveStatusPill state={state} /><button type="submit" disabled={state === "saving"} className="ml-auto rounded bg-brand px-6 py-3 text-sm font-medium text-surface hover:bg-brand-dark disabled:opacity-60">Save About page</button></div>
  </form>;
}
