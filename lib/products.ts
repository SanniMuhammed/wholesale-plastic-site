export interface LocalizedText {
  en: string;
  fr: string;
}

export type CategorySlug =
  | "buckets"
  | "basins"
  | "bowls"
  | "containers"
  | "household"
  | "other";

export type ColorKey =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "white"
  | "black"
  | "orange"
  | "gray"
  | "assorted";

export interface Category {
  slug: CategorySlug;
  name: LocalizedText;
}

export const CATEGORIES: Category[] = [
  { slug: "buckets", name: { en: "Buckets", fr: "Seaux" } },
  { slug: "basins", name: { en: "Basins", fr: "Bassines" } },
  { slug: "bowls", name: { en: "Bowls", fr: "Bols" } },
  { slug: "containers", name: { en: "Containers", fr: "Récipients" } },
  { slug: "household", name: { en: "Household Products", fr: "Articles ménagers" } },
  { slug: "other", name: { en: "Other Products", fr: "Autres produits" } },
];

export function getCategory(slug: CategorySlug): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export interface Product {
  slug: string;
  category: CategorySlug;
  name: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  capacity?: string;
  colors: ColorKey[];
  material: LocalizedText;
  packaging: LocalizedText;
  useCase: LocalizedText;
  wholesaleOnly: boolean;
  image?: string;
  featured?: boolean;
}

/**
 * PLACEHOLDER CATALOG DATA.
 * Replace every entry below with the real product catalog before launch --
 * names, specs, colors and especially photography (see `image`).
 */
export const PRODUCTS: Product[] = [
  {
    slug: "25l-heavy-duty-bucket",
    category: "buckets",
    name: { en: "25L Heavy-Duty Bucket", fr: "Seau robuste de 25 L" },
    shortDescription: {
      en: "Wide-mouth bucket built for daily commercial use.",
      fr: "Seau à large ouverture conçu pour un usage commercial quotidien.",
    },
    description: {
      en: "A durable, wide-mouth bucket suited to households, shops and light commercial work. Stacks efficiently for storage and transport.",
      fr: "Un seau durable à large ouverture, adapté aux foyers, aux boutiques et aux usages commerciaux légers. S'empile efficacement pour le stockage et le transport.",
    },
    capacity: "25 L",
    colors: ["red", "blue", "green", "yellow"],
    material: { en: "Heavy-duty plastic (HDPE)", fr: "Plastique robuste (PEHD)" },
    packaging: { en: "Bulk, carton of 20", fr: "Vrac, carton de 20" },
    useCase: { en: "Household and commercial use", fr: "Usage domestique et commercial" },
    wholesaleOnly: true,
    featured: true,
  },
  {
    slug: "15l-bucket-with-lid",
    category: "buckets",
    name: { en: "15L Bucket with Lid", fr: "Seau de 15 L avec couvercle" },
    shortDescription: {
      en: "Lidded bucket for storage and transport.",
      fr: "Seau avec couvercle pour le stockage et le transport.",
    },
    description: {
      en: "A mid-size bucket with a snap-fit lid, useful for storage, transport and market use.",
      fr: "Un seau de taille moyenne avec couvercle à clipser, utile pour le stockage, le transport et la vente au marché.",
    },
    capacity: "15 L",
    colors: ["blue", "white", "black"],
    material: { en: "Heavy-duty plastic (HDPE)", fr: "Plastique robuste (PEHD)" },
    packaging: { en: "Bulk, carton of 24", fr: "Vrac, carton de 24" },
    useCase: { en: "Storage and transport", fr: "Stockage et transport" },
    wholesaleOnly: true,
    image: "/product-images/15l-bucket-with-lid.jpg",
  },
  {
    slug: "10l-mini-bucket",
    category: "buckets",
    name: { en: "10L Mini Bucket", fr: "Petit seau de 10 L" },
    shortDescription: {
      en: "Compact bucket for lighter tasks.",
      fr: "Petit seau pour les usages légers.",
    },
    description: {
      en: "A compact bucket suited to smaller household tasks and retail display.",
      fr: "Un petit seau adapté aux tâches domestiques légères et à la présentation en boutique.",
    },
    capacity: "10 L",
    colors: ["red", "yellow", "assorted"],
    material: { en: "Plastic", fr: "Plastique" },
    packaging: { en: "Bulk, carton of 30", fr: "Vrac, carton de 30" },
    useCase: { en: "Household use", fr: "Usage domestique" },
    wholesaleOnly: true,
    image: "/product-images/10l-mini-bucket.jpg",
  },
  {
    slug: "40l-large-basin",
    category: "basins",
    name: { en: "40L Large Basin", fr: "Grande bassine de 40 L" },
    shortDescription: {
      en: "Large basin for washing and bulk tasks.",
      fr: "Grande bassine pour la lessive et les tâches en grande quantité.",
    },
    description: {
      en: "A large-capacity basin for laundry, food preparation and other bulk household tasks.",
      fr: "Une bassine de grande capacité pour la lessive, la préparation alimentaire et d'autres tâches domestiques en grande quantité.",
    },
    capacity: "40 L",
    colors: ["red", "blue", "green"],
    material: { en: "Heavy-duty plastic (HDPE)", fr: "Plastique robuste (PEHD)" },
    packaging: { en: "Bulk, carton of 10", fr: "Vrac, carton de 10" },
    useCase: { en: "Laundry and household use", fr: "Lessive et usage domestique" },
    wholesaleOnly: true,
    featured: true,
    image: "/product-images/40l-large-basin.jpg",
  },
  {
    slug: "20l-round-basin",
    category: "basins",
    name: { en: "20L Round Basin", fr: "Bassine ronde de 20 L" },
    shortDescription: {
      en: "Everyday round basin.",
      fr: "Bassine ronde pour un usage quotidien.",
    },
    description: {
      en: "A versatile round basin for everyday household and small business use.",
      fr: "Une bassine ronde polyvalente pour un usage domestique et pour les petits commerces.",
    },
    capacity: "20 L",
    colors: ["assorted"],
    material: { en: "Plastic", fr: "Plastique" },
    packaging: { en: "Bulk, carton of 15", fr: "Vrac, carton de 15" },
    useCase: { en: "Household use", fr: "Usage domestique" },
    wholesaleOnly: true,
    image: "/product-images/20l-round-basin.jpg",
  },
  {
    slug: "5l-bowl-set",
    category: "bowls",
    name: { en: "5L Plastic Bowl Set (Pack of 3)", fr: "Lot de 3 bols en plastique de 5 L" },
    shortDescription: {
      en: "Nesting bowl set for kitchen and market use.",
      fr: "Jeu de bols empilables pour la cuisine et le marché.",
    },
    description: {
      en: "A nesting set of three bowls, useful for food preparation, serving and market display.",
      fr: "Un jeu de trois bols empilables, utiles pour la préparation des aliments, le service et la présentation au marché.",
    },
    capacity: "5 L (x3)",
    colors: ["assorted"],
    material: { en: "Food-grade plastic", fr: "Plastique de qualité alimentaire" },
    packaging: { en: "Bulk, carton of 20 sets", fr: "Vrac, carton de 20 lots" },
    useCase: { en: "Kitchen and market use", fr: "Cuisine et marché" },
    wholesaleOnly: true,
    featured: true,
  },
  {
    slug: "2l-mixing-bowl",
    category: "bowls",
    name: { en: "2L Mixing Bowl", fr: "Bol mélangeur de 2 L" },
    shortDescription: {
      en: "Single mixing bowl for kitchen use.",
      fr: "Bol mélangeur pour la cuisine.",
    },
    description: {
      en: "A sturdy mixing bowl for everyday kitchen preparation.",
      fr: "Un bol mélangeur robuste pour la préparation quotidienne en cuisine.",
    },
    capacity: "2 L",
    colors: ["white", "gray"],
    material: { en: "Food-grade plastic", fr: "Plastique de qualité alimentaire" },
    packaging: { en: "Bulk, carton of 40", fr: "Vrac, carton de 40" },
    useCase: { en: "Kitchen use", fr: "Cuisine" },
    wholesaleOnly: true,
  },
  {
    slug: "50l-storage-container",
    category: "containers",
    name: { en: "50L Storage Container with Lid", fr: "Récipient de stockage de 50 L avec couvercle" },
    shortDescription: {
      en: "Large lidded container for bulk storage.",
      fr: "Grand récipient avec couvercle pour le stockage en grande quantité.",
    },
    description: {
      en: "A large storage container with a secure lid, suited to bulk goods, grain and general storage.",
      fr: "Un grand récipient de stockage avec un couvercle sécurisé, adapté aux marchandises en vrac, aux céréales et au stockage général.",
    },
    capacity: "50 L",
    colors: ["black", "gray", "blue"],
    material: { en: "Heavy-duty plastic (HDPE)", fr: "Plastique robuste (PEHD)" },
    packaging: { en: "Bulk, carton of 8", fr: "Vrac, carton de 8" },
    useCase: { en: "Bulk storage", fr: "Stockage en grande quantité" },
    wholesaleOnly: true,
    featured: true,
  },
  {
    slug: "20l-container-with-handle",
    category: "containers",
    name: { en: "20L Container with Handle", fr: "Récipient de 20 L avec poignée" },
    shortDescription: {
      en: "Portable container for liquids and storage.",
      fr: "Récipient portable pour liquides et stockage.",
    },
    description: {
      en: "A container with a carry handle, suited to water, liquids and general storage and transport.",
      fr: "Un récipient avec poignée de transport, adapté à l'eau, aux liquides et au stockage et transport en général.",
    },
    capacity: "20 L",
    colors: ["white", "blue"],
    material: { en: "Plastic", fr: "Plastique" },
    packaging: { en: "Bulk, carton of 15", fr: "Vrac, carton de 15" },
    useCase: { en: "Storage and transport", fr: "Stockage et transport" },
    wholesaleOnly: true,
  },
  {
    slug: "plastic-laundry-basket",
    category: "household",
    name: { en: "Plastic Laundry Basket", fr: "Panier à linge en plastique" },
    shortDescription: {
      en: "Ventilated basket for laundry.",
      fr: "Panier ventilé pour le linge.",
    },
    description: {
      en: "A ventilated laundry basket for everyday household use.",
      fr: "Un panier à linge ventilé pour un usage domestique quotidien.",
    },
    colors: ["assorted"],
    material: { en: "Plastic", fr: "Plastique" },
    packaging: { en: "Bulk, carton of 12", fr: "Vrac, carton de 12" },
    useCase: { en: "Household use", fr: "Usage domestique" },
    wholesaleOnly: true,
  },
  {
    slug: "dish-rack",
    category: "household",
    name: { en: "Plastic Dish Rack", fr: "Égouttoir à vaisselle en plastique" },
    shortDescription: {
      en: "Draining rack for kitchenware.",
      fr: "Égouttoir pour la vaisselle.",
    },
    description: {
      en: "A draining rack for plates, cups and utensils, suited to home and small food-service use.",
      fr: "Un égouttoir pour assiettes, tasses et ustensiles, adapté à un usage domestique et à la petite restauration.",
    },
    colors: ["white", "gray"],
    material: { en: "Plastic", fr: "Plastique" },
    packaging: { en: "Bulk, carton of 20", fr: "Vrac, carton de 20" },
    useCase: { en: "Kitchen use", fr: "Cuisine" },
    wholesaleOnly: true,
    image: "/product-images/dish-rack.jpg",
  },
  {
    slug: "plastic-stool",
    category: "other",
    name: { en: "Plastic Stool", fr: "Tabouret en plastique" },
    shortDescription: {
      en: "Stackable stool for home and shop.",
      fr: "Tabouret empilable pour la maison et la boutique.",
    },
    description: {
      en: "A lightweight, stackable stool suited to homes, shops and market stalls.",
      fr: "Un tabouret léger et empilable, adapté aux maisons, boutiques et étals de marché.",
    },
    colors: ["red", "blue", "green", "white"],
    material: { en: "Plastic", fr: "Plastique" },
    packaging: { en: "Bulk, carton of 10", fr: "Vrac, carton de 10" },
    useCase: { en: "Household and commercial use", fr: "Usage domestique et commercial" },
    wholesaleOnly: true,
    image: "/product-images/plastic-stool.jpg",
  },
  {
    slug: "stackable-crate",
    category: "other",
    name: { en: "Stackable Plastic Crate", fr: "Casier en plastique empilable" },
    shortDescription: {
      en: "Ventilated crate for produce and storage.",
      fr: "Casier ventilé pour les denrées et le stockage.",
    },
    description: {
      en: "A ventilated, stackable crate suited to produce, bottles and general storage in shops and markets.",
      fr: "Un casier ventilé et empilable, adapté aux denrées, aux bouteilles et au stockage général en boutique et au marché.",
    },
    colors: ["assorted"],
    material: { en: "Heavy-duty plastic (HDPE)", fr: "Plastique robuste (PEHD)" },
    packaging: { en: "Bulk, per unit or pallet", fr: "Vrac, à l'unité ou par palette" },
    useCase: { en: "Storage and market use", fr: "Stockage et usage au marché" },
    wholesaleOnly: true,
  },
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: CategorySlug): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

/**
 * Searches across both English and French name/description/category text,
 * so a French speaker typing "seau" finds the same results as "bucket".
 */
export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return PRODUCTS;

  return PRODUCTS.filter((p) => {
    const category = getCategory(p.category);
    const haystack = [
      p.name.en,
      p.name.fr,
      p.shortDescription.en,
      p.shortDescription.fr,
      p.description.en,
      p.description.fr,
      category?.name.en ?? "",
      category?.name.fr ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
