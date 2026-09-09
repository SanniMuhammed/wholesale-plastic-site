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
        { heading: "Notre implantation", body: "Sherinab Venture LTD est basée à Saki, dans l'État d'Oyo, au Nigeria, et fournit des produits plastiques aux entreprises." },
        { heading: "Ce que nous fournissons", body: "Nous proposons des seaux, bassines, bols, contenants et autres produits plastiques pour l'approvisionnement en gros." },
        { heading: "À qui nous nous adressons", body: "Nous accompagnons détaillants, commerçants, distributeurs et entrepreneurs qui souhaitent s'approvisionner depuis le Nigeria." },
        { heading: "Notre approche", body: "Choisissez vos produits, indiquez vos quantités et votre destination, puis notre équipe vous aide à confirmer la commande et la livraison." },
      ]
    : [
        { heading: "Where We're Based", body: "Sherinab Venture LTD is based in Saki, Oyo State, Nigeria, supplying plastic products to businesses." },
        { heading: "What We Supply", body: "We offer buckets, basins, bowls, containers and other plastic products for wholesale purchasing." },
        { heading: "Who We Serve", body: "We support retailers, market traders, distributors and entrepreneurs who want to source from Nigeria." },
        { heading: "Our Approach", body: "Choose your products, tell us your quantities and destination, then our team helps confirm the order and delivery details." },
      ];

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">{dict.footer.aboutUs}</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">{french ? "À propos de nous" : "About Us"}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted sm:mt-4">
        {french
          ? "Un fournisseur nigérian de produits plastiques en gros, au service des entreprises qui souhaitent s'approvisionner depuis le Nigeria."
          : "A Nigerian wholesale plastic supplier helping businesses source products from Nigeria without unnecessary travel."}
      </p>

      <div className="mt-9 grid gap-x-10 gap-y-8 border-t border-border pt-7 sm:mt-12 sm:gap-y-10 sm:pt-8 sm:grid-cols-2">
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
