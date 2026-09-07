import { getCompanySettings } from "@/lib/cms/settings";
import { PageHeader } from "@/components/admin/AdminUI";
import { CompanySettingsForm } from "./CompanySettingsForm";

export const dynamic = "force-dynamic";

export default async function CompanySettingsPage() {
  const settings = await getCompanySettings();

  return (
    <div>
      <PageHeader title="Company settings" description="Shown in the footer, contact, and trust sections." />
      <CompanySettingsForm settings={settings} />
    </div>
  );
}
