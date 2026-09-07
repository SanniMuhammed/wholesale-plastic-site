import Link from "next/link";
import { listOrders } from "@/lib/cms/orders";
import { PageHeader, OrderStatusBadge } from "@/components/admin/AdminUI";
import type { OrderStatus } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

const STATUS_FILTERS: Array<{ value: OrderStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = (status as OrderStatus) || undefined;
  const orders = await listOrders(activeStatus ? { status: activeStatus } : undefined);

  return (
    <div>
      <PageHeader
        title="Orders"
        description="What customers sent through before continuing on WhatsApp."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => {
          const isActive = (filter.value === "all" && !activeStatus) || filter.value === activeStatus;
          return (
            <Link
              key={filter.value}
              href={filter.value === "all" ? "/admin/orders" : `/admin/orders?status=${filter.value}`}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                isActive ? "bg-ink text-surface" : "bg-surface text-ink-soft border border-border"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
          No orders in this view yet.
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between gap-3 p-4 hover:bg-background"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {order.customer_name || order.business_name || "Unnamed contact"}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted">
                    {new Date(order.created_at).toLocaleString()} &middot; {order.channel} &middot;{" "}
                    {order.items?.length ?? 0} item{order.items?.length === 1 ? "" : "s"}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
