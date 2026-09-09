import { getDeliveryContent } from "@/lib/cms/settings";
import { PageHeader } from "@/components/admin/AdminUI";
import { BodyContentForm } from "@/components/admin/BodyContentForm";
import { DeliveryImageManager } from "@/components/admin/DeliveryImageManager";
import { updateDeliveryContentAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function DeliveryContentPage() {
  const content = await getDeliveryContent();

  return (
    <div>
      <PageHeader
        title="Delivery page"
        description="Edit delivery copy and manage every photo used by the approved delivery-page layout."
      />
      <div className="grid gap-8">
        <DeliveryImageManager initialContent={content} />
        <BodyContentForm
          initialBodyEn={content.body_en}
          initialBodyFr={content.body_fr}
          onSave={updateDeliveryContentAction}
        />
      </div>
    </div>
  );
}
