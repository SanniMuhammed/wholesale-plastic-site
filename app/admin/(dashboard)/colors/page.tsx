import { listColors } from "@/lib/cms/colors";
import { PageHeader } from "@/components/admin/AdminUI";
import { ColorManager } from "./ColorManager";

export const dynamic = "force-dynamic";

export default async function ColorsPage() {
  const colors = await listColors();

  return (
    <div>
      <PageHeader title="Colours" description="The palette products can be tagged with." />
      <ColorManager initialColors={colors} />
    </div>
  );
}
