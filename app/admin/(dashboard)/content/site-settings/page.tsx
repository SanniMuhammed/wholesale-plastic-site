import { PageHeader } from "@/components/admin/AdminUI";
import { getSiteSettings } from "@/lib/cms/site-settings";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
export const dynamic="force-dynamic";
export default async function SiteSettingsPage(){const settings=await getSiteSettings();return <><PageHeader title="Website settings" description="Manage navigation, footer wording and search-engine information without editing code."/><SiteSettingsForm initial={settings}/></>}
