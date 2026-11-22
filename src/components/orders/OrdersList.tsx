import Link from "next/link";
import { FaShoppingBasket } from "react-icons/fa";
import { getUserOrders } from "@/server-actions/order/getUserOrders";
import OrderCard from "./OrderCard";

export default async function OrdersList() {
  const { success, orders, message } = await getUserOrders();

  if (!success) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm font-medium text-text">
          {message ?? "Something went wrong."}
        </p>
        <p className="mt-1 text-sm text-muted">
          Please refresh the page or try again in a moment.
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FaShoppingBasket size={22} />
        </div>
        <h2 className="mt-4 text-base font-semibold text-text">
          No orders yet
        </h2>
        <p className="mt-1 max-w-sm text-sm text-muted">
          When you place an order it will show up here so you can track it.
        </p>
        <Link
          href="/"
          className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
