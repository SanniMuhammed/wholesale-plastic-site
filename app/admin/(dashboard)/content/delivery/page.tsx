import { getDeliveryContent } from "@/lib/cms/settings";
import { PageHeader } from "@/components/admin/AdminUI";
import { BodyContentForm } from "@/components/admin/BodyContentForm";
import { updateDeliveryContentAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function DeliveryContentPage() {
  const content = await getDeliveryContent();

  return (
    <div>
      <PageHeader
        title="Delivery information"
        description="No fixed prices or times -- describe what delivery depends on."
      />
      <BodyContentForm
        initialBodyEn={content.body_en}
        initialBodyFr={content.body_fr}
        onSave={updateDeliveryContentAction}
      />
    </div>
  );
}
