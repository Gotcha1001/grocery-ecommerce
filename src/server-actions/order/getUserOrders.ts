import { db } from "@/db/db";
import { getCurrentUser } from "../auth/getCurrentUser";
import { desc, eq } from "drizzle-orm";
import { order } from "@/db/schema";

export async function getUserOrders() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        orders: [],
        message: "You must be logged in.",
      };
    }

    const orders = await db.query.order.findMany({
      where: eq(order.userId, currentUser.id),
      with: {
        address: true,
        items: {
          with: {
            product: {
              // NEW: needed so each item can show its thumbnail
              with: { images: true },
            },
          },
        },
      },
      orderBy: desc(order.createdAt), // latest first
    });

    return { success: true, orders };
  } catch (error) {
    console.error("GET_USER_ORDERS_ERROR:", error);
    return {
      success: false,
      orders: [],
      message: "Failed to fetch orders.",
    };
  }
}

// Handy type for the components
export type UserOrder = Awaited<
  ReturnType<typeof getUserOrders>
>["orders"][number];
