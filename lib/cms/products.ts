import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { Product, ProductInput, ProductImage, Color } from "@/lib/cms/types";

const PRODUCT_IMAGES_BUCKET = "product-images";
const PRODUCT_SELECT = `*, category:categories(*), images:product_images(*), colors:product_colors(color:colors(*))`;
const SEARCH_SELECT = `slug,name_en,name_fr,short_description_en,short_description_fr,category:categories(slug,name_en,name_fr),images:product_images(storage_path,is_main,sort_order)`;
function normalizeProduct(row: any): Product { return { ...row, images: (row.images ?? []).sort((a: ProductImage,b: ProductImage)=>a.sort_order-b.sort_order), colors: (row.colors ?? []).map((c:any)=>c.color).filter(Boolean) as Color[] }; }

export async function listProducts(opts?: { status?: "draft"|"published" }): Promise<Product[]> { const supabase=opts?.status==="published"?createPublicClient():await createClient(); let query=supabase.from("products").select(PRODUCT_SELECT).order("sort_order",{ascending:true}).order("created_at",{ascending:false}); if(opts?.status)query=query.eq("status",opts.status); const{data,error}=await query;if(error)throw error;return(data??[]).map(normalizeProduct); }

export async function searchPublishedProducts(query: string): Promise<Array<{slug:string;name_en:string;name_fr:string;category_slug:string;category_name_en:string;category_name_fr:string;image_path:string|null}>> {
  const q = query.trim().replace(/[%,_]/g, " ").replace(/\s+/g, " ").slice(0, 80);
  if (q.length < 2) return [];
  const pattern = `%${q}%`;
  const supabase = createPublicClient();
  const [{ data: products, error: productError }, { data: categories, error: categoryError }] = await Promise.all([
    supabase
      .from("products")
      .select(SEARCH_SELECT)
      .eq("status", "published")
      .or(`name_en.ilike.${pattern},name_fr.ilike.${pattern},short_description_en.ilike.${pattern},short_description_fr.ilike.${pattern}`)
      .order("sort_order", { ascending: true })
      .limit(6),
    supabase
      .from("categories")
      .select("id,slug,name_en,name_fr")
      .eq("is_active", true)
      .or(`slug.ilike.${pattern},name_en.ilike.${pattern},name_fr.ilike.${pattern}`)
      .limit(6),
  ]);
  if (productError) throw productError;
  if (categoryError) throw categoryError;

  const categoryIds = (categories ?? []).map((category) => category.id);
  let categoryProducts: any[] = [];
  if (categoryIds.length > 0) {
    const { data, error } = await supabase
      .from("products")
      .select(SEARCH_SELECT)
      .eq("status", "published")
      .in("category_id", categoryIds)
      .order("sort_order", { ascending: true })
      .limit(6);
    if (error) throw error;
    categoryProducts = data ?? [];
  }

  const merged = [...(products ?? []), ...categoryProducts];
  const seen = new Set<string>();
  return merged.filter((product: any) => {
    if (seen.has(product.slug)) return false;
    seen.add(product.slug);
    return true;
  }).slice(0, 6).map((product: any) => ({
    slug: product.slug,
    name_en: product.name_en,
    name_fr: product.name_fr,
    category_slug: product.category?.slug ?? "other",
    category_name_en: product.category?.name_en ?? product.category?.slug ?? "other",
    category_name_fr: product.category?.name_fr ?? product.category?.slug ?? "other",
    image_path: product.images?.find((image: any) => image.is_main)?.storage_path ?? product.images?.[0]?.storage_path ?? null,
  }));
}

export async function getProduct(id:string):Promise<Product|null>{const s=await createClient();const{data,error}=await s.from("products").select(PRODUCT_SELECT).eq("id",id).maybeSingle();if(error)throw error;return data?normalizeProduct(data):null;}
export async function createProduct(input:ProductInput):Promise<Product>{const s=await createClient();const{data,error}=await s.from("products").insert(input).select(PRODUCT_SELECT).single();if(error)throw error;return normalizeProduct(data);}
export async function updateProduct(id:string,input:Partial<ProductInput>):Promise<Product>{const s=await createClient();const{data,error}=await s.from("products").update(input).eq("id",id).select(PRODUCT_SELECT).single();if(error)throw error;return normalizeProduct(data);}
export async function deleteProduct(id:string):Promise<void>{const s=await createClient();const{data:images,error:fetchError}=await s.from("product_images").select("storage_path").eq("product_id",id);if(fetchError)throw fetchError;const{error}=await s.from("products").delete().eq("id",id);if(error)throw error;if(images?.length){const{error:storageError}=await s.storage.from(PRODUCT_IMAGES_BUCKET).remove(images.map(i=>i.storage_path));if(storageError)console.error("Product image cleanup failed",storageError);}}
export async function setProductColors(productId:string,colorIds:string[]):Promise<void>{const s=await createClient();const{error}=await s.rpc("replace_product_colors",{p_product_id:productId,p_color_ids:colorIds});if(error)throw error;}

export async function addProductImage(productId:string,file:File):Promise<ProductImage>{const s=await createClient();const{count}=await s.from("product_images").select("id",{count:"exact",head:true}).eq("product_id",productId);const isFirstImage=(count??0)===0;const extension=(file.name.split(".").pop()||"jpg").toLowerCase();const storagePath=`${productId}/${crypto.randomUUID()}.${extension}`;const{error:uploadError}=await s.storage.from(PRODUCT_IMAGES_BUCKET).upload(storagePath,file,{contentType:file.type,upsert:false});if(uploadError)throw uploadError;const{data,error}=await s.from("product_images").insert({product_id:productId,storage_path:storagePath,sort_order:count??0,is_main:isFirstImage}).select().single();if(error){await s.storage.from(PRODUCT_IMAGES_BUCKET).remove([storagePath]);throw error;}return data;}

export async function setMainProductImage(productId:string,imageId:string):Promise<void>{const s=await createClient();const{data:target,error:targetError}=await s.from("product_images").select("id").eq("id",imageId).eq("product_id",productId).maybeSingle();if(targetError)throw targetError;if(!target)throw new Error("Image does not belong to this product.");const{error:clearError}=await s.from("product_images").update({is_main:false}).eq("product_id",productId);if(clearError)throw clearError;const{error}=await s.from("product_images").update({is_main:true}).eq("id",imageId).eq("product_id",productId);if(error)throw error;}

export async function reorderProductImages(productId:string,orderedImageIds:string[]):Promise<void>{const s=await createClient();const{data:images,error}=await s.from("product_images").select("id").eq("product_id",productId);if(error)throw error;const actual=new Set((images??[]).map(i=>i.id));const unique=new Set(orderedImageIds);if(unique.size!==orderedImageIds.length||orderedImageIds.length!==(images??[]).length||orderedImageIds.some(id=>!actual.has(id)))throw new Error("Image order does not match this product's images.");for(const[id,index]of orderedImageIds.entries()){const{error:e}=await s.from("product_images").update({sort_order:index}).eq("id",id).eq("product_id",productId);if(e)throw e;}}

export async function deleteProductImage(productId:string,imageId:string):Promise<void>{const s=await createClient();const{data:image,error:fetchError}=await s.from("product_images").select("storage_path, product_id, is_main").eq("id",imageId).eq("product_id",productId).single();if(fetchError)throw fetchError;const{error}=await s.from("product_images").delete().eq("id",imageId).eq("product_id",productId);if(error)throw error;const{error:storageError}=await s.storage.from(PRODUCT_IMAGES_BUCKET).remove([image.storage_path]);if(storageError)console.error("Product image cleanup failed",storageError);if(image.is_main){const{data:remaining}=await s.from("product_images").select("id").eq("product_id",productId).order("sort_order",{ascending:true}).limit(1).maybeSingle();if(remaining)await s.from("product_images").update({is_main:true}).eq("id",remaining.id).eq("product_id",productId);}}
