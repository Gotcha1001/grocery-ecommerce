import Image from "next/image";
import { FaBox } from "react-icons/fa";
import type { UserOrder } from "@/server-actions/order/getUserOrders";
import {
  PROGRESS_STEPS,
  STATUS_META,
  normaliseStatus,
  progressIndex,
} from "./OrderStatus";

const money = (value: string | number) => `$${Number(value).toFixed(2)}`;

const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const paymentMethodLabel = (method: string) =>
  method === "cod"
    ? "Cash on delivery"
    : method === "stripe"
      ? "Card (Stripe)"
      : method;

export default function OrderCard({ order }: { order: UserOrder }) {
  const status = normaliseStatus(order.orderStatus);
  const meta = STATUS_META[status];
  const StatusIcon = meta.icon;
  const isPaid = order.paymentStatus.toLowerCase() === "paid";
  const step = progressIndex(status);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <header className="flex flex-col gap-3 border-b border-border bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FaBox size={17} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text">
              Order #{order.orderId}
            </p>
            <p className="text-xs text-muted">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${meta.badge}`}
        >
          <StatusIcon size={12} />
          {meta.label}
        </span>
      </header>

      {/* Progress tracker */}
      {status !== "cancelled" && (
        <div className="border-b border-border px-5 py-4">
          <ol className="flex items-center">
            {PROGRESS_STEPS.map((key, index) => {
              const done = index <= step;
              return (
                <li
                  key={key}
                  className={`flex items-center ${index < PROGRESS_STEPS.length - 1 ? "flex-1" : ""}`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={`h-3 w-3 rounded-full ${done ? "bg-primary" : "bg-border"}`}
                    />
                    <span
                      className={`hidden text-[11px] sm:block ${done ? "font-medium text-text" : "text-muted"}`}
                    >
                      {STATUS_META[key].label}
                    </span>
                  </div>
                  {index < PROGRESS_STEPS.length - 1 && (
                    <span
                      className={`mx-2 h-0.5 flex-1 sm:mb-4 ${index < step ? "bg-primary" : "bg-border"}`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* Body */}
      <div className="grid gap-6 p-5 md:grid-cols-[1.6fr_1fr_1fr]">
        {/* Items */}
        <section>
          <h3 className="mb-3 text-sm font-semibold text-text">Items</h3>
          <ul className="space-y-3">
            {order.items.map((item) => {
              const image =
                item.product.images.find((img) => img.isMain)?.imageUrl ??
                item.product.images[0]?.imageUrl;

              return (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
                    {image ? (
                      <Image
                        src={image}
                        alt={item.product.name}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-primary">
                        <FaBox size={14} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted">
                      {item.quantity} × {money(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-text">
                    {money(Number(item.price) * item.quantity)}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Delivery address */}
        <section>
          <h3 className="mb-3 text-sm font-semibold text-text">
            Delivery address
          </h3>
          <address className="text-sm not-italic leading-6 text-muted">
            <p className="font-medium text-text">
              {order.address.firstName} {order.address.lastName}
            </p>
            <p>{order.address.street}</p>
            <p>
              {order.address.city}, {order.address.state}{" "}
              {order.address.postalCode}
            </p>
            <p>{order.address.country}</p>
          </address>
        </section>

        {/* Summary */}
        <section>
          <h3 className="mb-3 text-sm font-semibold text-text">Summary</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Total</dt>
              <dd className="font-semibold text-text">
                {money(order.totalAmount)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Payment</dt>
              <dd className="text-text">
                {paymentMethodLabel(order.paymentMethod)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Payment status</dt>
              <dd
                className={`font-medium ${isPaid ? "text-success" : "text-accent"}`}
              >
                {isPaid ? "Paid" : "Pending"}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-5 py-3">
        <p className="text-xs text-muted">
          {itemCount} {itemCount === 1 ? "item" : "items"} in this order
        </p>
      </footer>
    </article>
  );
}
