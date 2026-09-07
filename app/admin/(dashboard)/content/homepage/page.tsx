import { listHomepageSections } from "@/lib/cms/settings";
import { listCategories } from "@/lib/cms/categories";
import { PageHeader } from "@/components/admin/AdminUI";
import { HomepageSectionManager } from "./HomepageSectionManager";
import { ExploreCategoriesManager } from "./ExploreCategoriesManager";

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

  const finalCta = sections.filter((section) => section.key === "final_cta");
  const otherSections = sections.filter((section) => section.key !== "final_cta");

  return (
    <div>
      <PageHeader
        title="Homepage sections"
        description="Edit homepage text, manage the hero photo, and manage the Explore category photos here."
      />

      <HomepageSectionManager sections={otherSections} labels={SECTION_LABELS} />

      <ExploreCategoriesManager initialCategories={categories} />

      <HomepageSectionManager sections={finalCta} labels={SECTION_LABELS} />
    </div>
  );
}
