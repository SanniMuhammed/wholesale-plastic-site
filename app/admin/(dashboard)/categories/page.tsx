import { listCategories } from "@/lib/cms/categories";
import { PageHeader } from "@/components/admin/AdminUI";
import { CategoryManager } from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await listCategories();

  return (
    <div>
      <PageHeader title="Categories" description="Shown as filters on the public catalogue." />
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
