import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";

const content = {
  en: {
    eyebrow: "DELIVERY",
    title: "How Delivery Works",
    intro: "We help you move your order from our suppliers in Nigeria to your chosen destination. Delivery is arranged after we confirm your products, quantity and location.",
    steps: [
      ["01", "Tell us your destination", "When you build your order, provide the country and city where you want the goods delivered."],
      ["02", "We confirm your order", "We review the products, quantities and destination with you before anything is finalized."],
      ["03", "We arrange the logistics", "For deliveries within Nigeria, we coordinate the appropriate transport option. For international orders, we help coordinate the logistics based on your destination and shipment requirements."],
      ["04", "You receive the delivery details", "We confirm the available delivery option, estimated logistics cost and other relevant details with you before proceeding."],
      ["05", "Your order is delivered", "Once the order and delivery arrangements are confirmed, the goods are dispatched to the agreed destination."],
    ],
    factorsTitle: "What affects delivery?",
    factorsIntro: "Delivery is not one fixed price or one fixed timeline. The final arrangement depends on the details of your order.",
    factors: [
      ["Destination", "Country, state and city affect the available transport options and logistics cost."],
      ["Order size", "The quantity and volume of your order can affect how it is packaged and transported."],
      ["Product type", "Different products and quantities may require different handling or transport arrangements."],
      ["Delivery method", "We confirm the practical delivery option for your destination before you commit to the order."],
    ],
    nigeriaTitle: "Deliveries within Nigeria",
    nigeriaBody: "For customers in Nigeria, we coordinate delivery from our supply point to your chosen location. Share your state and city with your order so we can confirm the most suitable option.",
    internationalTitle: "Orders outside Nigeria",
    internationalBody: "If you are sourcing from another country, you do not need to travel to Nigeria just to arrange the order. Tell us your destination and we will discuss the available logistics and delivery requirements with you.",
    note: "Important: delivery cost and timing are confirmed for each order. We do not promise a universal delivery price or delivery time because these depend on destination, order size and logistics conditions.",
    cta: "Build Your Order",
    contact: "Have a destination in mind? Contact us",
  },
  fr: {
    eyebrow: "LIVRAISON",
    title: "Comment fonctionne la livraison",
    intro: "Nous vous aidons à faire acheminer votre commande depuis nos fournisseurs au Nigeria jusqu'à la destination de votre choix. La livraison est organisée après confirmation des produits, des quantités et de votre destination.",
    steps: [
      ["01", "Indiquez votre destination", "Lors de la préparation de votre commande, indiquez le pays et la ville où vous souhaitez recevoir les produits."],
      ["02", "Nous confirmons votre commande", "Nous vérifions avec vous les produits, les quantités et la destination avant toute confirmation."],
      ["03", "Nous organisons la logistique", "Pour les livraisons au Nigeria, nous coordonnons le transport adapté. Pour les commandes internationales, nous vous aidons à organiser la logistique selon votre destination et les exigences de l'expédition."],
      ["04", "Vous recevez les détails de livraison", "Nous confirmons avec vous l'option disponible, le coût logistique estimé et les autres détails importants avant de poursuivre."],
      ["05", "Votre commande est livrée", "Une fois la commande et la livraison confirmées, les produits sont expédiés vers la destination convenue."],
    ],
    factorsTitle: "Qu'est-ce qui influence la livraison ?",
    factorsIntro: "Il n'existe pas un prix ou un délai unique pour toutes les livraisons. L'organisation finale dépend des détails de votre commande.",
    factors: [
      ["Destination", "Le pays, l'État et la ville influencent les options de transport disponibles et le coût logistique."],
      ["Taille de la commande", "La quantité et le volume peuvent influencer l'emballage et le transport."],
      ["Type de produit", "Certains produits et certaines quantités peuvent nécessiter une manutention ou un transport particulier."],
      ["Mode de livraison", "Nous confirmons l'option pratique pour votre destination avant que vous ne vous engagiez dans la commande."],
    ],
    nigeriaTitle: "Livraisons au Nigeria",
    nigeriaBody: "Pour les clients au Nigeria, nous coordonnons la livraison depuis notre point d'approvisionnement jusqu'à votre destination. Indiquez votre État et votre ville afin que nous puissions confirmer l'option la plus adaptée.",
    internationalTitle: "Commandes hors du Nigeria",
    internationalBody: "Si vous êtes dans un autre pays, vous n'avez pas besoin de voyager au Nigeria uniquement pour organiser votre commande. Indiquez votre destination et nous discuterons avec vous des options logistiques disponibles.",
    note: "Important : le coût et le délai de livraison sont confirmés pour chaque commande. Nous ne promettons pas un prix ou un délai universel, car ils dépendent de la destination, de la taille de la commande et des conditions logistiques.",
    cta: "Préparer ma commande",
    contact: "Vous avez déjà une destination ? Contactez-nous",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const c = content[rawLocale as Locale];
  return {
    title: c.title,
    description: c.intro,
    alternates: { canonical: `/${rawLocale}/delivery` },
  };
}

export default async function DeliveryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const c = content[locale];

  return (
    <main>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-20">
          <p className="eyebrow text-brand">{c.eyebrow}</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold leading-tight text-ink sm:text-6xl">{c.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">{c.intro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow text-brand">{locale === "fr" ? "LE PROCESSUS" : "THE PROCESS"}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">{locale === "fr" ? "De la commande à votre destination" : "From order to destination"}</h2>
        </div>
        <ol className="mt-10 divide-y divide-border border-y border-border">
          {c.steps.map(([number, title, body]) => (
            <li key={number} className="grid gap-4 py-7 sm:grid-cols-[72px_1fr_1.5fr] sm:gap-8 sm:py-9">
              <span className="font-mono text-xs font-bold tracking-[0.12em] text-brand">{number}</span>
              <h3 className="font-display text-2xl font-semibold leading-tight text-ink">{title}</h3>
              <p className="max-w-xl text-sm leading-6 text-muted sm:text-base">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow text-brand">{locale === "fr" ? "À SAVOIR" : "WHAT TO EXPECT"}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">{c.factorsTitle}</h2>
            <p className="mt-3 text-muted">{c.factorsIntro}</p>
          </div>
          <div className="mt-10 grid gap-x-10 sm:grid-cols-2">
            {c.factors.map(([title, body], i) => (
              <div key={title} className="border-t border-border py-6">
                <p className="font-mono text-xs font-bold text-brand">0{i + 1}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2">
          <article className="border-t border-border pt-6">
            <p className="eyebrow text-brand">01</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">{c.nigeriaTitle}</h2>
            <p className="mt-3 leading-7 text-muted">{c.nigeriaBody}</p>
          </article>
          <article className="border-t border-border pt-6">
            <p className="eyebrow text-brand">02</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">{c.internationalTitle}</h2>
            <p className="mt-3 leading-7 text-muted">{c.internationalBody}</p>
          </article>
        </div>
        <div className="mt-10 border border-border bg-surface p-6 sm:p-8">
          <p className="text-sm leading-6 text-muted">{c.note}</p>
        </div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href={`/${locale}/products`} className="inline-flex w-fit items-center rounded bg-brand px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-brand-dark">{c.cta} →</Link>
          <Link href={`/${locale}/contact`} className="text-sm font-medium text-ink underline decoration-border underline-offset-4 hover:decoration-ink">{c.contact} →</Link>
        </div>
      </section>
    </main>
  );
}
