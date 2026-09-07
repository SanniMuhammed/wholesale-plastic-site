import { listHomepageSections } from "@/lib/cms/settings";
import { listCategories } from "@/lib/cms/categories";
import { PageHeader } from "@/components/admin/AdminUI";
import { HomepageSectionManager } from "./HomepageSectionManager";
import { CategoryManager } from "../../categories/CategoryManager";

export const dynamic = "force-dynamic";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  trust_bar: "Trust bar",
  how_it_works: "How it works",
  start_business: "Start a business",
  travel: "You don't need to travel",
  delivery_teaser: "Delivery teaser",
  final_cta: "Final call to action",
};

export default async function HomepageContentPage() {
  const [sections, categories] = await Promise.all([
    listHomepageSections(),
    listCategories(),
  ]);

  return (
    <div>
      <PageHeader
        title="Homepage sections"
        description="Edit homepage text, manage the hero photo, and manage the Explore category photos here."
      />
      <HomepageSectionManager sections={sections} labels={SECTION_LABELS} />

      <section className="mt-6">
        <div className="mb-3">
          <h2 className="text-base font-semibold text-ink">Explore categories</h2>
          <p className="mt-1 text-sm text-muted">
            Upload, replace, or remove the photos used by the homepage Explore grid.
          </p>
        </div>
        <CategoryManager initialCategories={categories} />
      </section>
    </div>
  );
}
