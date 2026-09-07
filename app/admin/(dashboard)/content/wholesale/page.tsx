import { getWholesaleContent } from "@/lib/cms/settings";
import { PageHeader } from "@/components/admin/AdminUI";
import { BodyContentForm } from "@/components/admin/BodyContentForm";
import { updateWholesaleContentAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function WholesaleContentPage() {
  const content = await getWholesaleContent();

  return (
    <div>
      <PageHeader title="Wholesale information" description="Shown on the Wholesale page." />
      <BodyContentForm
        initialBodyEn={content.body_en}
        initialBodyFr={content.body_fr}
        onSave={updateWholesaleContentAction}
      />
    </div>
  );
}
