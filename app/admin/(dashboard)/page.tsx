import Link from "next/link";
import { Plus, FileText, ShoppingBag, Building2 } from "lucide-react";
import { listProducts } from "@/lib/cms/products";
import { listOrders } from "@/lib/cms/orders";
import { PageHeader, OrderStatusBadge } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [products, orders, newOrders] = await Promise.all([
    listProducts(),
    listOrders(),
    listOrders({ status: "new" }),
  ]);

  const publishedCount = products.filter((p) => p.status === "published").length;
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <PageHeader title="Dashboard" description="An overview of the catalogue and incoming orders." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Products" value={products.length} sub={`${publishedCount} published`} />
        <StatCard label="Orders" value={orders.length} sub={`${newOrders.length} new`} />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-medium text-ink-soft">Quick actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickAction href="/admin/products/new" icon={Plus} label="Add product" />
          <QuickAction href="/admin/content/homepage" icon={FileText} label="Edit homepage" />
          <QuickAction href="/admin/orders" icon={ShoppingBag} label="View orders" />
          <QuickAction href="/admin/content/company" icon={Building2} label="Company settings" />
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-ink-soft">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-brand-dark hover:underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
            No orders yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <ul className="divide-y divide-border">
              {recentOrders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-background"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {order.customer_name || order.business_name || "Unnamed contact"}
                      </p>
                      <p className="font-mono text-xs text-muted">
                        {new Date(order.created_at).toLocaleDateString()} &middot;{" "}
                        {order.items?.length ?? 0} item{order.items?.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-0.5 text-xs text-muted">{sub}</p>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Plus;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-surface p-4 text-center text-sm font-medium text-ink-soft transition-colors hover:border-brand hover:text-brand-dark"
    >
      <Icon size={20} strokeWidth={1.75} />
      {label}
    </Link>
  );
}
