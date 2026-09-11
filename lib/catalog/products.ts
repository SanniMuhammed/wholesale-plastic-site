import { listProducts as listCmsProducts } from "@/lib/cms/products";
import { buildProductImageUrl } from "@/lib/cms/productImages";
import type { Product as CmsProduct } from "@/lib/cms/types";
import { PRODUCTS, type Product, type CategorySlug, type ColorKey } from "@/lib/products";

export type CatalogProduct = Product & {
  cmsId: string;
  pricingMode?: "fixed" | "starting_from" | "quote";
  price?: number;
  priceUnit?: string;
  images: string[];
};

const PUBLIC_PRODUCT_IMAGES: Record<string, string> = {
  "25l-heavy-duty-bucket": "/product-images/25l-heavy-duty-bucket.jpg",
  "15l-bucket-with-lid": "/product-images/15l-bucket-with-lid.jpg",
  "10l-mini-bucket": "/product-images/10l-mini-bucket.jpg",
  "40l-large-basin": "/product-images/40l-large-basin.jpg",
  "20l-round-basin": "/product-images/20l-round-basin.jpg",
  "5l-bowl-set": "https://heroplast.com/cdn/shop/files/1-10.jpg?v=1745269009&width=3840",
  "2l-mixing-bowl": "https://i.ebayimg.com/images/g/alcAAOSwh8xcyVGv/s-l1200.jpg",
  "50l-storage-container": "https://i.ebayimg.com/images/g/P2YAAOSwIMtmIS0-/s-l1200.jpg",
  "20l-container-with-handle": "https://www.isplatech.co.kr/data/goods/1/2022/02/132_temp_16456850624286view.jpg",
  "plastic-laundry-basket": "https://assets.laicms.com/5wbsz6tha7/5ygz23.webp",
  "dish-rack": "/product-images/dish-rack.jpg",
  "plastic-stool": "/product-images/plastic-stool.jpg",
  "stackable-crate": "https://s.alicdn.com/@sc04/kf/H1912f2ed12a94a2995e1d2fdc07a5126H/Heavy-Duty-EuroBox-Mesh-Style-Crate-HDPE-Plastic-Solid-Stackable-Basket-for-Industrial-and-Household-Storage.jpg",
};

function nonEmpty(value: string | null | undefined, fallback: string): string {
  return value?.trim() ? value : fallback;
}

function localized(cmsEn: string | null | undefined, cmsFr: string | null | undefined, fallback: Product["name"]): Product["name"] {
  return {
    en: nonEmpty(cmsEn, fallback.en),
    fr: nonEmpty(cmsFr, fallback.fr),
  };
}

function toCategorySlug(product: CmsProduct, fallback: CategorySlug): CategorySlug {
  switch (product.category?.slug) {
    case "buckets": case "basins": case "bowls": case "containers": case "household": case "other": return product.category.slug;
    default: return fallback;
  }
}
function toColorKey(slug: string): ColorKey | null {
  switch (slug) {
    case "red": case "blue": case "green": case "yellow": case "white": case "black": case "orange": case "gray": case "assorted": return slug;
    default: return null;
  }
}
function adaptProduct(product: CmsProduct): CatalogProduct {
  const legacy = PRODUCTS.find((item) => item.slug === product.slug);
  const legacyProduct: Product = legacy ?? {
    slug: product.slug,
    category: "other",
    name: { en: product.name_en || product.slug, fr: product.name_fr || product.name_en || product.slug },
    shortDescription: { en: product.short_description_en || "", fr: product.short_description_fr || "" },
    description: { en: product.description_en || "", fr: product.description_fr || "" },
    colors: [],
    material: { en: "", fr: "" },
    packaging: { en: "", fr: "" },
    useCase: { en: "", fr: "" },
    wholesaleOnly: true,
  };

  const category = toCategorySlug(product, legacyProduct.category);
  const cmsColors = (product.colors ?? [])
    .map((color) => toColorKey(color.slug))
    .filter((color): color is ColorKey => color !== null);
  const colors = cmsColors.length > 0 ? cmsColors : legacyProduct.colors;

  const cmsImages = (product.images ?? [])
    .map((image) => buildProductImageUrl(image.storage_path))
    .filter(Boolean);
  const fallbackImage = PUBLIC_PRODUCT_IMAGES[product.slug] ?? legacyProduct.image;
  const reliableFallback = fallbackImage ? buildProductImageUrl(fallbackImage) : undefined;

  // Prefer the known local catalogue image when one exists. This prevents a
  // broken CMS/remote image from becoming the first image on the detail page.
  const allImages = reliableFallback
    ? [reliableFallback, ...cmsImages.filter((image) => image !== reliableFallback)]
    : cmsImages;
  const mainImage = allImages[0];

  return {
    cmsId: product.id,
    slug: product.slug,
    category,
    name: localized(product.name_en, product.name_fr, legacyProduct.name),
    shortDescription: localized(product.short_description_en, product.short_description_fr, legacyProduct.shortDescription),
    description: localized(product.description_en, product.description_fr, legacyProduct.description),
    capacity: product.capacity?.trim() || legacyProduct.capacity,
    colors,
    material: localized(product.material_en, product.material_fr, legacyProduct.material),
    packaging: localized(product.packaging_en, product.packaging_fr, legacyProduct.packaging),
    useCase: localized(product.use_case_en, product.use_case_fr, legacyProduct.useCase),
    wholesaleOnly: product.wholesale_only ?? legacyProduct.wholesaleOnly,
    pricingMode: product.pricing_mode,
    price: product.price ?? undefined,
    priceUnit: product.price_unit ?? undefined,
    image: mainImage,
    images: allImages,
    featured: product.is_featured ?? legacyProduct.featured,
  };
}
export async function getAllProducts(): Promise<CatalogProduct[]> { return (await listCmsProducts({ status: "published" })).map(adaptProduct); }
export async function getProductBySlug(slug: string): Promise<CatalogProduct | undefined> {
  const product = (await listCmsProducts({ status: "published" })).find((item) => item.slug === slug);
  return product ? adaptProduct(product) : undefined;
}
export async function getFeaturedProducts(): Promise<CatalogProduct[]> {
  return (await getAllProducts()).filter((product) => product.featured).slice(0, 50);
}
export async function getProductsByCategory(category: CategorySlug): Promise<CatalogProduct[]> { return (await getAllProducts()).filter((product) => product.category === category); }
export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase(); if (!q) return products;
  return products.filter((product) => [product.name.en, product.name.fr, product.shortDescription.en, product.shortDescription.fr, product.description.en, product.description.fr, product.category, ...product.colors].join(" ").toLowerCase().includes(q));
}
