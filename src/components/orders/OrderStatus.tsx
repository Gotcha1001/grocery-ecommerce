import { FaBan, FaBox, FaCheckCircle, FaClock, FaTruck } from "react-icons/fa";
import type { IconType } from "react-icons";

export type StatusKey =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

// DB values may be "pending", "Delivered", "Out For Delivery" etc.
// Normalise them so the UI never breaks on casing/spacing.
export function normaliseStatus(raw: string): StatusKey {
  const key = raw
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  const known: StatusKey[] = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];
  return (known as string[]).includes(key) ? (key as StatusKey) : "pending";
}

export const STATUS_META: Record<
  StatusKey,
  { label: string; icon: IconType; badge: string }
> = {
  pending: {
    label: "Pending",
    icon: FaClock,
    badge: "bg-accent/10 text-accent",
  },
  confirmed: {
    label: "Confirmed",
    icon: FaCheckCircle,
    badge: "bg-primary/10 text-primary",
  },
  processing: {
    label: "Processing",
    icon: FaBox,
    badge: "bg-accent/10 text-accent",
  },
  shipped: {
    label: "Shipped",
    icon: FaTruck,
    badge: "bg-primary/10 text-primary",
  },
  out_for_delivery: {
    label: "Out for delivery",
    icon: FaTruck,
    badge: "bg-primary/10 text-primary",
  },
  delivered: {
    label: "Delivered",
    icon: FaCheckCircle,
    badge: "bg-success/10 text-success",
  },
  cancelled: {
    label: "Cancelled",
    icon: FaBan,
    badge: "bg-red-500/10 text-red-600",
  },
};

// Steps shown in the little progress tracker (cancelled orders skip it)
export const PROGRESS_STEPS: StatusKey[] = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

export function progressIndex(status: StatusKey): number {
  // pending sits "before" the first step; out_for_delivery counts as shipped
  if (status === "pending") return -1;
  if (status === "out_for_delivery") return PROGRESS_STEPS.indexOf("shipped");
  return PROGRESS_STEPS.indexOf(status);
}
