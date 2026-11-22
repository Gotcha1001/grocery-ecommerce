"use server";
import { db } from "@/db/db";
import { requireAdmin } from "../auth/requireAdmin";
import { eq } from "drizzle-orm";
import { order } from "@/db/schema";

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await requireAdmin();

    const existingOrder = await db.query.order.findFirst({
      where: eq(order.id, orderId),
    });

    if (!existingOrder) {
      return {
        success: false,
        message: "Order not found.",
      };
    }

    await db
      .update(order)
      .set({
        orderStatus: status,
        updatedAt: new Date(),
      })
      .where(eq(order.id, orderId));

    return {
      success: true,
      message: "Order status updated successfully",
    };
  } catch (error) {
    console.error("UPDATE_ORDER_STATUS_ERROR:", error);

    return {
      success: false,
      message: "Failed to update order status.",
    };
  }
}
