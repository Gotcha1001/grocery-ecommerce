import { db } from "@/db/db";
import { requireAdmin } from "../auth/requireAdmin";
import { eq } from "drizzle-orm";
import { order } from "@/db/schema";

export async function getOrderById(orderId: string) {
  try {
    await requireAdmin();

    const orderData = await db.query.order.findFirst({
      where: eq(order.id, orderId),

      with: {
        user: true,
        address: true,

        items: {
          with: {
            product: {
              with: {
                images: true,
              },
            },
          },
        },
      },
    });
    if (!orderData) {
      return {
        success: false,
        order: null,
        message: "Order not found",
      };
    }

    return {
      success: true,
      order: orderData,
    };
  } catch (error) {
    console.error("GET_ORDER_BY_ID_ERROR:", error);

    return {
      success: false,
      order: null,
      message: "Failed to fetch order.",
    };
  }
}
