import { getAllOrders } from "@/server-actions/order/getAllOrders";
import Link from "next/link";
import { FaBoxOpen } from "react-icons/fa";

export const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  confirmed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const { orders } = await getAllOrders();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text">Orders</h1>
        <p className="mt-1 text-sm text-muted">
          Manage and track customer orders.
        </p>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Desktop Header */}
        <div className="hidden lg:grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1.2fr_1fr_1fr] gap-4 border-b border-border bg-background px-5 py-4 text-sm font-medium text-muted">
          <p>Order ID</p>
          <p>Customer</p>
          <p>Items</p>
          <p>Amount</p>
          <p>Payment</p>
          <p>Status</p>
          <p>Action</p>
        </div>

        {/* Orders */}
        <div className="divide-y divide-border">
          {orders.map((order) => (
            <div
              key={order.id}
              className="px-5 py-5 transition hover:bg-background"
            >
              {/* Desktop */}
              <div className="hidden lg:grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1.2fr_1fr_1fr] gap-4 items-center text-sm">
                <p className="font-medium text-text">{order.orderId}</p>

                <div>
                  <p className="font-medium text-text">{order.user.name}</p>
                  <p className="text-xs text-muted">{order.user.email}</p>
                </div>

                <p className="text-muted">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </p>

                <p className="font-medium text-text">
                  ${Number(order.totalAmount).toFixed(2)}
                </p>

                <p className="text-muted">
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Stripe"}
                </p>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                    statusStyles[order.orderStatus]
                  }`}
                >
                  {order.orderStatus}
                </span>

                {/* View Order */}
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="w-fit rounded-lg bg-[#E8F7EF] px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
                >
                  View Order
                </Link>
              </div>

              {/* Mobile / Tablet */}
              <div className="lg:hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F7EF] text-primary">
                      <FaBoxOpen size={18} />
                    </div>

                    <div>
                      <p className="font-medium text-text">{order.orderId}</p>

                      <p className="text-sm text-muted">{order.user.name}</p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[order.orderStatus]
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-y-4 sm:grid-cols-4 text-sm">
                  <div>
                    <p className="text-xs text-muted">Items</p>
                    <p className="mt-1 font-medium text-text">
                      {order.items.length}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted">Amount</p>
                    <p className="mt-1 font-medium text-text">
                      ${Number(order.totalAmount).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted">Payment</p>
                    <p className="mt-1 font-medium text-text">
                      {order.paymentMethod}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted">Date</p>
                    <p className="mt-1 font-medium text-text">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Mobile View Button */}
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="mt-5 block w-full rounded-lg bg-primary py-2.5 text-center text-sm font-medium text-white transition hover:bg-primary-hover"
                >
                  View Order
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FaBoxOpen className="mb-3 text-4xl text-muted" />

            <h3 className="font-medium text-text">No orders found</h3>

            <p className="mt-1 text-sm text-muted">
              Customer orders will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
