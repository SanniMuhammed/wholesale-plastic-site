import { getWholesaleContent } from "@/lib/cms/settings";
import { PageHeader } from "@/components/admin/AdminUI";
import { AboutContentForm } from "@/components/admin/AboutContentForm";
import { updateWholesaleContentAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AboutContentPage() {
  const content = await getWholesaleContent();
  return <div><PageHeader title="About page" description="Edit the introduction and the four information sections customers see on About Us." /><AboutContentForm bodyEn={content.body_en} bodyFr={content.body_fr} onSave={updateWholesaleContentAction} /></div>;
}
