import { db } from "@/db/db";
import { requireAdmin } from "../auth/requireAdmin";
import { desc } from "drizzle-orm";
import { order } from "@/db/schema";

export async function getAllOrders() {
  try {
    await requireAdmin();

    const orders = await db.query.order.findMany({
      with: {
        user: true,
        address: true,
        items: {
          with: {
            product: true,
          },
        },
      },

      orderBy: desc(order.createdAt),
    });

    return {
      success: true,
      orders,
    };
  } catch (error) {
    console.error("GET_ALL_ORDERS_ERROR:", error);

    return {
      success: false,
      orders: [],
      message: "Failed to fetch orders.",
    };
  }
}
