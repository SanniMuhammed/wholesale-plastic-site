import {
  listProducts as listCmsProducts,
  getProduct as getCmsProduct,
} from "@/lib/cms/products";
import { buildProductImageUrl } from "@/lib/cms/productImages";
import type { Product as CmsProduct } from "@/lib/cms/types";
import type {
  Product,
  CategorySlug,
  ColorKey,
} from "@/lib/products";

function toCategorySlug(product: CmsProduct): CategorySlug {
  const slug = product.category?.slug;

  switch (slug) {
    case "buckets":
    case "basins":
    case "bowls":
    case "containers":
    case "household":
    case "other":
      return slug;
    default:
      return "other";
  }
}

function toColorKey(slug: string): ColorKey | null {
  switch (slug) {
    case "red":
    case "blue":
    case "green":
    case "yellow":
    case "white":
    case "black":
    case "orange":
    case "gray":
    case "assorted":
      return slug;
    default:
      return null;
  }
}

function adaptProduct(product: CmsProduct): Product {
  const category = toCategorySlug(product);

  const colors = (product.colors ?? [])
    .map((color) => toColorKey(color.slug))
    .filter((color): color is ColorKey => color !== null);

  const mainImage =
    product.images?.find((image) => image.is_main) ??
    product.images?.[0];

  return {
    slug: product.slug,

    category,

    name: {
      en: product.name_en,
      fr: product.name_fr,
    },

    shortDescription: {
      en: product.short_description_en,
      fr: product.short_description_fr,
    },

    description: {
      en: product.description_en,
      fr: product.description_fr,
    },

    capacity: product.capacity ?? undefined,

    colors,

    material: {
      en: product.material_en,
      fr: product.material_fr,
    },

    packaging: {
      en: product.packaging_en,
      fr: product.packaging_fr,
    },

    useCase: {
      en: product.use_case_en,
      fr: product.use_case_fr,
    },

    wholesaleOnly: product.wholesale_only,

    image: mainImage
      ? buildProductImageUrl(mainImage.storage_path)
      : undefined,

    featured: product.is_featured,
  };
}

/**
 * Public catalog.
 *
 * Only published CMS products are exposed.
 */
export async function getAllProducts(): Promise<Product[]> {
  const products = await listCmsProducts({ status: "published" });
  return products.map(adaptProduct);
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const products = await listCmsProducts({ status: "published" });

  const product = products.find((item) => item.slug === slug);

  return product ? adaptProduct(product) : undefined;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((product) => product.featured);
}

export async function getProductsByCategory(
  category: CategorySlug
): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((product) => product.category === category);
}

export function searchProducts(
  products: Product[],
  query: string
): Product[] {
  const q = query.trim().toLowerCase();

  if (!q) return products;

  return products.filter((product) => {
    const haystack = [
      product.name.en,
      product.name.fr,
      product.shortDescription.en,
      product.shortDescription.fr,
      product.description.en,
      product.description.fr,
      product.category,
      ...product.colors,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}
