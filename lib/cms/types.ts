export interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_fr: string;
  sort_order: number;
  is_active: boolean;
  cover_image_path: string | null;
}

export interface Color {
  id: string;
  slug: string;
  label_en: string;
  label_fr: string;
  hex: string;
  sort_order: number;
  is_active: boolean;
}

export type AvailabilityStatus = "in_stock" | "limited" | "out_of_stock";
export type ProductStatus = "draft" | "published";
export type PricingMode = "fixed" | "starting_from" | "quote";

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  sort_order: number;
  is_main: boolean;
}

export interface ProductReview {
  id: string;
  product_id: string;
  customer_name: string;
  business_name: string | null;
  location: string | null;
  rating: number;
  review_en: string;
  review_fr: string;
  customer_photo_path: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  slug: string;
  category_id: string | null;
  name_en: string;
  name_fr: string;
  short_description_en: string;
  short_description_fr: string;
  description_en: string;
  description_fr: string;
  capacity: string | null;
  material_en: string;
  material_fr: string;
  packaging_en: string;
  packaging_fr: string;
  use_case_en: string;
  use_case_fr: string;
  wholesale_only: boolean;
  availability_status: AvailabilityStatus;
  pricing_mode: PricingMode;
  price: number | null;
  price_unit: string | null;
  is_featured: boolean;
  status: ProductStatus;
  sort_order: number;
  legacy_slug: string | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  images?: ProductImage[];
  colors?: Color[];
  reviews?: ProductReview[];
}

export type ProductInput = Omit<Product, "id" | "created_at" | "updated_at" | "category" | "images" | "colors" | "reviews">;

export interface Faq {
  id: string;
  question_en: string;
  question_fr: string;
  answer_en: string;
  answer_fr: string;
  sort_order: number;
  is_published: boolean;
}

export interface CompanySettings {
  company_name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  address: string;
  countries_served: string[];
  social_links: Record<string, string>;
}

export interface DeliveryContent {
  body_en: string;
  body_fr: string;
}

export interface WholesaleContent {
  body_en: string;
  body_fr: string;
}

export type HomepageSectionKey =
  | "hero"
  | "trust_bar"
  | "how_it_works"
  | "start_business"
  | "travel"
  | "delivery_teaser"
  | "final_cta";

export interface HomepageSection {
  id: string;
  key: HomepageSectionKey;
  title_en: string;
  title_fr: string;
  body_en: string;
  body_fr: string;
  is_visible: boolean;
  sort_order: number;
  hero_image_path: string | null;
  hero_mobile_image_path: string | null;
}

export type OrderChannel = "whatsapp" | "fallback_form";
export type OrderStatus = "new" | "contacted" | "quoted" | "confirmed" | "completed" | "cancelled";

export interface OrderItem {
  id: string;
  order_id: string;
  product_slug: string;
  product_name: string;
  capacity: string | null;
  quantity: number;
}

export interface Order {
  id: string;
  channel: OrderChannel;
  status: OrderStatus;
  customer_name: string | null;
  business_name: string | null;
  contact: string | null;
  country: string | null;
  city: string | null;
  note: string | null;
  locale: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface NewOrderPayload {
  channel: OrderChannel;
  customerName?: string;
  businessName?: string;
  contact?: string;
  country?: string;
  city?: string;
  note?: string;
  locale: string;
  items: Array<{ slug: string; name: string; capacity?: string; quantity: number }>;
}
