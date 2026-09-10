import { listAdminAuditLog, auditLabel, changedFields } from "@/lib/cms/audit";
import { createClient } from "@/lib/supabase/server";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function actionText(action: string) {
  if (action === "INSERT") return "Created";
  if (action === "DELETE") return "Deleted";
  return "Updated";
}

export default async function AuditPage() {
  const [entries, supabase] = await Promise.all([listAdminAuditLog(100), createClient()]);
  const adminIds = [...new Set(entries.map((entry) => entry.admin_user_id))];
  const { data: profiles } = adminIds.length ? await supabase.from("admin_profiles").select("id,full_name").in("id", adminIds) : { data: [] };
  const names = new Map((profiles ?? []).map((profile) => [profile.id, profile.full_name || "Admin"]));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Accountability</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Activity history</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">A record of changes made by administrators. Use this to see what changed, when it changed, and which admin made the change.</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        {entries.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">No admin activity has been recorded yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {entries.map((entry) => {
              const fields = changedFields(entry);
              return (
                <article key={entry.id} className="p-4 sm:p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink"><span className="capitalize">{actionText(entry.action)}</span> {auditLabel(entry.table_name).toLowerCase()}</p>
                      <p className="mt-1 text-xs text-muted">{names.get(entry.admin_user_id) ?? "Admin"} · {formatDate(entry.created_at)}</p>
                    </div>
                    <span className="inline-flex w-fit rounded-full border border-border px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-muted">{entry.action}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {fields.slice(0, 12).map((field) => <span key={field} className="rounded bg-brand-light px-2 py-1 text-[11px] text-brand-dark">{field.replaceAll("_", " ")}</span>)}
                    {fields.length > 12 && <span className="px-1 py-1 text-[11px] text-muted">+{fields.length - 12} more</span>}
                  </div>
                  {entry.record_id && <p className="mt-2 truncate font-mono text-[10px] text-muted">Record: {entry.record_id}</p>}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
