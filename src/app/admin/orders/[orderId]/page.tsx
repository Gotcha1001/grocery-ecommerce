import { getOrderById } from "@/server-actions/order/getOrderById";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { statusStyles } from "../page";
import OrderStatus from "@/components/admin/OrderStatus";

interface OrderPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderId } = await params;

  const result = await getOrderById(orderId);

  if (!result.success || !result.order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <FaBoxOpen size={50} className="mb-4 text-muted" />

        <h1 className="text-xl font-semibold text-text">Order not found</h1>

        <p className="mt-2 text-sm text-muted">
          The order you are looking for does not exist
        </p>

        <Link
          href={"/admin/orders"}
          className="mt-5 rounded-lg bg-primary py-2 px-4 text-sm font-semibold"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const order = result.order;

  const subtotal = order.items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  const shippingFee = 0;
  const tax = subtotal * 0.02;
  const total = subtotal + tax + shippingFee;

  const orderStatus = order.orderStatus.toLowerCase();
  const paymentStatus = order.paymentStatus.toLowerCase();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted transition hover:text-primary"
        >
          <FaArrowLeft size={13} />
          Back to Orders
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text">
              Order {order.orderId}
            </h1>

            <p className="mt-1 text-sm text-muted">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${
              statusStyles[order.orderStatus]
            }`}
          >
            {order.orderStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Order Items */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-text">Order Items</h2>
            </div>

            <div className="divide-y divide-border">
              {order.items.map((item) => {
                const image =
                  item.product.images.find((image) => image.isMain)?.imageUrl ??
                  null;

                const itemPrice = Number(item.price);
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div key={item.id} className="flex gap-4 p-5">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center">
                      <Image
                        width={80}
                        height={80}
                        src={image || ""}
                        alt={item.product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <p className="truncate font-medium text-text">
                        {item.product.name}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {item.product.category}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {item.product.unit} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-center">
                      <p className="font-medium text-text">
                        ${itemTotal.toFixed(2)}
                      </p>
                      <p className="font-medium text-text">
                        ${itemPrice.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Information */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-text">Customer Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase text-muted">Name</p>
                <p className="mt-1 text-sm font-medium text-text">
                  {order.user.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-muted">
                  Email
                </p>
                <p className="mt-1 break-all text-sm font-medium text-text">
                  {order.user.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-muted">
                  Phone
                </p>
                <p className="mt-1 text-sm font-medium text-text">
                  {order.address.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <FaMapMarkerAlt className="text-primary" />

              <h2 className="font-semibold text-text">Delivery Address</h2>
            </div>

            <div className="p-5 text-sm text-muted">
              <p className="font-medium text-text">
                {order.address.firstName} {order.address.lastName}
              </p>

              <p className="mt-1">{order.address.street}</p>

              <p>
                {order.address.city}, {order.address.state}{" "}
                {order.address.postalCode}
              </p>

              <p>{order.address.country}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-text">Order Summary</h2>
            </div>

            <div className="space-y-3 p-5 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-muted">
                <span>Shipping</span>

                <span className="font-medium text-success">Free</span>
              </div>

              <div className="flex justify-between text-muted">
                <span>Tax (2%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="my-4 border-t border-border" />

              <div className="flex justify-between text-base font-semibold text-text">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-text">Payment Information</h2>
            </div>

            <div className="space-y-4 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Payment Method</span>

                <span className="font-medium text-text">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">Payment Status</span>

                <span className="flex items-center gap-1.5 font-medium text-success">
                  <FaCheckCircle size={13} />
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <OrderStatus orderId={order.id} orderStatus={order.orderStatus} />
        </div>
      </div>
    </div>
  );
}
