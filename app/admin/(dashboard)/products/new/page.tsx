import { listCategories } from "@/lib/cms/categories";
import { listColors } from "@/lib/cms/colors";
import { PageHeader } from "@/components/admin/AdminUI";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, colors] = await Promise.all([listCategories(), listColors()]);

  return (
    <div>
      <PageHeader title="Add product" description="Save the details first, then upload photos." />
      <ProductForm categories={categories} colors={colors} />
    </div>
  );
}
