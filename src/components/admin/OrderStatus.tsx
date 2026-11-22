"use client";
import { updateOrderStatus } from "@/server-actions/order/updateOrderStatus";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle, FaClock } from "react-icons/fa";

interface OrderStatusProps {
  orderId: string;
  orderStatus: string;
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderStatus({
  orderId,
  orderStatus,
}: OrderStatusProps) {
  const router = useRouter();

  const [status, setStatus] = useState(orderStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);

    const result = await updateOrderStatus(orderId, status);

    setIsUpdating(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Order status updated successfully.");
    router.refresh();
  };
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-semibold text-text">Order Status</h2>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F7EF] text-primary">
            {orderStatus === "Delivered" ? (
              <FaCheckCircle size={16} />
            ) : (
              <FaClock size={16} />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-text">{orderStatus}</p>

            <p className="text-xs text-muted">Current order status</p>
          </div>
        </div>

        <select
          value={status}
          disabled={isUpdating}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          disabled={isUpdating || status === orderStatus}
          onClick={handleStatusUpdate}
          className="mt-3 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
        >
          {isUpdating ? "Updating Status..." : "Update Status"}
        </button>
      </div>
    </div>
  );
}
