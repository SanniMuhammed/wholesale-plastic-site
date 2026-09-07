import { listHomepageSections } from "@/lib/cms/settings";
import { PageHeader } from "@/components/admin/AdminUI";
import { HomepageSectionManager } from "./HomepageSectionManager";

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
  const sections = await listHomepageSections();

  return (
    <div>
      <PageHeader
        title="Homepage sections"
        description="Edit homepage text, manage the hero photo, and manage the Explore category photos from their category settings."
      />
      <HomepageSectionManager sections={sections} labels={SECTION_LABELS} />
    </div>
  );
}
