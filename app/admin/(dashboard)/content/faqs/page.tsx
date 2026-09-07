import { listFaqs } from "@/lib/cms/faqs";
import { PageHeader } from "@/components/admin/AdminUI";
import { FaqManager } from "./FaqManager";

export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  const faqs = await listFaqs();

  return (
    <div>
      <PageHeader title="FAQs" description="Shown on the public FAQ / about section." />
      <FaqManager initialFaqs={faqs} />
    </div>
  );
}
