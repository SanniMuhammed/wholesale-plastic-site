import type { Locale } from "@/lib/i18n/config";
import en from "@/lib/i18n/en.json";
import fr from "@/lib/i18n/fr.json";

const dictionaries = { en, fr };

export type Dictionary = typeof en;

// Dictionaries are bundled JSON, so this can stay synchronous.
// Geography-specific copy is centralized here so the site's messaging stays
// consistent across the homepage, metadata and delivery pages without
// duplicating translations in individual components.
export function getDictionary(locale: Locale): Dictionary {
  const base = (dictionaries[locale] ?? dictionaries.en) as Dictionary;
  const isFrench = locale === "fr";

  return {
    ...base,
    meta: {
      ...base.meta,
      home: {
        ...base.meta.home,
        title: isFrench ? "Produits Plastiques en Gros au Nigeria et au-delà" : "Wholesale Plastic Products in Nigeria & Beyond",
        description: isFrench
          ? "Seaux, bassines, bols et récipients plastiques en gros pour les entreprises au Nigeria et à l'étranger. Parcourez le catalogue, composez votre commande et organisez la livraison."
          : "Wholesale plastic buckets, basins, bowls and containers for businesses in Nigeria and abroad. Browse the catalog, build your order, and arrange delivery to your destination.",
      },
      wholesale: { ...base.meta.wholesale, description: isFrench ? "Produits plastiques en gros pour détaillants, distributeurs et nouvelles entreprises au Nigeria et au-delà." : "Wholesale plastic products for retailers, distributors and new businesses in Nigeria and beyond." },
      delivery: { ...base.meta.delivery, description: isFrench ? "Comment nous organisons la livraison de produits plastiques en gros partout au Nigeria et pour les clients à l'étranger." : "How we coordinate wholesale plastic delivery anywhere in Nigeria and for customers outside Nigeria." },
      about: { ...base.meta.about, description: isFrench ? "Un fournisseur nigérian de produits plastiques en gros au service des entreprises au Nigeria et au-delà." : "A Nigerian wholesale plastic supplier serving businesses across Nigeria and beyond." },
    },
    hero: {
      ...base.hero,
      supporting: isFrench ? "Vente en gros • Nigeria & international • Livraison nationale" : "Wholesale • Nigeria & International • Nationwide Delivery",
      title: isFrench ? "Achetez des produits plastiques en gros directement chez nous" : "Buy Wholesale Plastic Products Directly From Us",
      subtitle: isFrench ? "Pour les entreprises au Nigeria et au-delà. Choisissez vos produits, indiquez les quantités et la destination, et nous nous occupons du reste." : "For businesses in Nigeria and beyond. Choose what you need, tell us your quantities and destination, and we'll handle the rest.",
    },
    trustBar: { ...base.trustBar, items: isFrench ? ["Basé au Nigeria", "Livraison partout au Nigeria", "Commandes internationales", "Assistance WhatsApp"] : ["Based in Nigeria", "Delivery Anywhere in Nigeria", "International Orders", "WhatsApp Support"] },
    travel: {
      ...base.travel,
      title: isFrench ? "Un seul fournisseur, au Nigeria et au-delà" : "One supplier for Nigeria and beyond",
      problem: isFrench ? "Que votre entreprise soit au Nigeria ou à l'étranger, trouver les bons produits en gros et organiser la livraison doit rester simple." : "Whether your business is in Nigeria or abroad, getting the right wholesale products and arranging delivery should be straightforward.",
      solution: isFrench ? "Indiquez-nous vos besoins, confirmez votre commande et nous coordonnons l'approvisionnement et la livraison vers votre destination." : "Tell us what you need, confirm your order, and we coordinate supply and delivery to your destination.",
    },
    howItWorksSection: { ...base.howItWorksSection, subtitle: isFrench ? "Cinq étapes, de la consultation du catalogue à la livraison, au Nigeria comme à l'étranger." : "Five steps from browsing to delivery, whether you're in Nigeria or abroad." },
    startBusiness: { ...base.startBusiness, body: isFrench ? "Que vous démarriez, réapprovisionniez ou développiez votre distribution, nous fournissons des produits plastiques en gros aux entreprises au Nigeria et aux clients à l'étranger." : "Whether you're starting, restocking or distributing, we supply wholesale plastic products to businesses in Nigeria and customers abroad." },
    deliveryTeaser: {
      ...base.deliveryTeaser,
      title: isFrench ? "Livraison partout au Nigeria et au-delà" : "Delivery Across Nigeria & Beyond",
      subtitle: isFrench ? "Nous livrons partout au Nigeria et coordonnons la livraison pour les clients à l'étranger. Votre destination détermine la meilleure option logistique." : "We deliver across Nigeria and coordinate delivery for customers outside Nigeria. Your destination determines the best logistics option.",
      originLabel: "Nigeria",
      destinationLabel: isFrench ? "Votre destination" : "Your destination",
    },
    finalCta: {
      ...base.finalCta,
      title: isFrench ? "Prêt à passer une commande en gros ?" : "Ready to place a wholesale order?",
      subtitle: isFrench ? "Nous servons les entreprises partout au Nigeria et les clients à l'étranger. Indiquez-nous vos besoins — nous nous occupons du reste." : "We serve businesses anywhere in Nigeria and customers outside Nigeria. Tell us what you need — we'll take it from there.",
    },
    footer: { ...base.footer, tagline: isFrench ? "Produits plastiques en gros pour les entreprises au Nigeria et au-delà." : "Wholesale plastic products for businesses in Nigeria and beyond." },
    wholesalePage: {
      ...base.wholesalePage,
      heroSubtitle: isFrench ? "Quel que soit le stade de votre commerce, nous fournissons les quantités dont vous avez besoin — sourcées et coordonnées depuis le Nigeria pour une livraison au Nigeria et au-delà." : "Whatever stage your business is at, we supply plastic products in the quantities you need — sourced and coordinated from Nigeria for delivery in Nigeria and beyond.",
      whySection: { ...base.wholesalePage.whySection, points: base.wholesalePage.whySection.points.map((point, index) => index === 2 ? (isFrench ? "Accompagnement des entreprises au Nigeria et des nouveaux clients qui souhaitent s'approvisionner au Nigeria." : "Guidance for businesses in Nigeria and first-time customers sourcing from Nigeria.") : point) },
      faq: base.wholesalePage.faq.map((faq, index) => index === 1 ? { ...faq, q: isFrench ? "Où livrez-vous ?" : "Where do you deliver?", a: isFrench ? "Nous livrons partout au Nigeria. Pour les clients à l'étranger, indiquez votre destination et nous confirmerons les options de livraison et d'expédition disponibles." : "We deliver anywhere in Nigeria. For customers outside Nigeria, tell us your destination and we'll confirm the available delivery and shipping options." } : faq),
    },
    deliveryPage: {
      ...base.deliveryPage,
      title: isFrench ? "Livraison partout au Nigeria et au-delà" : "Delivery Across Nigeria & Beyond",
      intro: isFrench ? "Nous livrons les commandes en gros partout au Nigeria et coordonnons l'expédition pour les clients à l'étranger. Voici comment fonctionne le processus." : "We deliver wholesale orders anywhere in Nigeria and coordinate shipping for customers outside Nigeria. Here's how the process works.",
      steps: isFrench ? ["Vous envoyez votre liste de produits", "Nous confirmons la disponibilité", "Nous préparons votre devis", "Nous confirmons votre destination et l'option de livraison", "Vous confirmez la commande", "Nous préparons les marchandises", "La livraison ou l'expédition est organisée", "Vous recevez votre marchandise"] : ["You send your product list", "We confirm availability", "We prepare your quotation", "We confirm your destination and delivery option", "You confirm the order", "We prepare the goods", "Delivery or shipment is arranged", "You receive your goods"],
      note: isFrench ? "Les livraisons au Nigeria peuvent être organisées partout dans le pays. Pour les destinations à l'étranger, notre équipe confirmera l'option d'expédition, le coût et le délai pour votre commande." : "Nigeria deliveries can be arranged nationwide. For destinations outside Nigeria, our team will confirm the available shipping option, cost and timeline for your order.",
    },
    aboutPage: { ...base.aboutPage, sections: base.aboutPage.sections.map((section, index) => index === 2 ? { ...section, body: isFrench ? "Décrivez les détaillants, commerçants et entreprises avec lesquels vous travaillez au Nigeria et au-delà." : "Describe the retailers, traders and businesses you work with across Nigeria and beyond." } : section) },
  } as Dictionary;
}
