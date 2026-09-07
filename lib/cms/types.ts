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

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  sort_order: number;
  is_main: boolean;
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
  is_featured: boolean;
  status: ProductStatus;
  sort_order: number;
  legacy_slug: string | null;

  created_at: string;
  updated_at: string;

  // Populated by joined queries, not present on a raw row insert/update.
  category?: Category | null;
  images?: ProductImage[];
  colors?: Color[];
}

/** Shape accepted by createProduct/updateProduct -- everything but the
 *  generated id/timestamps, with images and colours handled separately. */
export type ProductInput = Omit<
  Product,
  "id" | "created_at" | "updated_at" | "category" | "images" | "colors"
>;

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
}

export type OrderChannel = "whatsapp" | "fallback_form";
export type OrderStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "confirmed"
  | "completed"
  | "cancelled";

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

/** Payload the public site posts to /api/orders when a customer completes
 *  the WhatsApp or fallback-form hand-off. */
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
