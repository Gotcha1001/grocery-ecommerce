// Goes at: app/(protected)/orders/page.tsx
import { Suspense } from "react";
import FrontendLayout from "@/components/layouts/FrontendLayout";
import OrdersList from "@/components/orders/OrdersList";
import OrdersSkeleton from "@/components/orders/OrderSkeleton";

export default function OrdersPage() {
  return (
    <FrontendLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">Your Purchases</p>
          <h1 className="mt-1 text-2xl font-semibold text-text md:text-3xl">
            My Orders
          </h1>
          <p className="mt-2 text-sm text-muted">
            View and track your grocery orders, newest first.
          </p>
        </div>

        <Suspense fallback={<OrdersSkeleton number={3} />}>
          <OrdersList />
        </Suspense>
      </div>
    </FrontendLayout>
  );
}
