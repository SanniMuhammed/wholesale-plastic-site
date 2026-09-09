import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/getDictionary";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const dict = getDictionary(rawLocale);
  return { title: dict.meta.about.title, description: dict.meta.about.description, alternates: { canonical: `/${rawLocale}/about` } };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const french = locale === "fr";

  const sections = french
    ? [
        { heading: "Notre implantation", body: "Sherinab Venture LTD est basée à Lagos, au Nigeria, avec une activité tournée vers l'approvisionnement en produits plastiques pour les entreprises." },
        { heading: "Ce que nous fournissons", body: "Nous proposons une gamme de seaux, bassines, bols, contenants et autres produits plastiques destinés à l'approvisionnement en gros." },
        { heading: "À qui nous nous adressons", body: "Nous accompagnons les détaillants, commerçants, distributeurs et entrepreneurs qui souhaitent s'approvisionner depuis le Nigeria." },
        { heading: "Notre approche", body: "Notre objectif est de simplifier l'approvisionnement: choisissez vos produits, indiquez vos quantités et votre destination, puis notre équipe vous aide à confirmer la commande et la livraison." },
      ]
    : [
        { heading: "Where We're Based", body: "Sherinab Venture LTD is based in Lagos, Nigeria, with a focus on supplying plastic products to businesses." },
        { heading: "What We Supply", body: "We offer a range of buckets, basins, bowls, containers and other plastic products for wholesale purchasing." },
        { heading: "Who We Serve", body: "We support retailers, market traders, distributors and entrepreneurs who want to source products from Nigeria." },
        { heading: "Our Approach", body: "We make sourcing simpler: choose your products, tell us your quantities and destination, then our team helps confirm the order and delivery details." },
      ];

  return (
    <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
      <p className="eyebrow">{dict.footer.aboutUs}</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">{french ? "À propos de nous" : "About Us"}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        {french
          ? "Un fournisseur nigérian de produits plastiques en gros, au service des entreprises qui souhaitent s'approvisionner depuis le Nigeria."
          : "A Nigerian wholesale plastic supplier helping businesses source products from Nigeria without unnecessary travel."}
      </p>

      <div className="mt-12 grid gap-x-10 gap-y-10 border-t border-border pt-8 sm:grid-cols-2">
        {sections.map((section, i) => (
          <div key={section.heading}>
            <span className="font-mono text-xs font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="mt-2 font-display text-lg font-semibold text-ink">{section.heading}</h2>
            <p className="mt-2 leading-relaxed text-muted">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
