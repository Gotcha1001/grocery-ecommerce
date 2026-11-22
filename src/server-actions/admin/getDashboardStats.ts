import { db } from "@/db/db";
import { requireAdmin } from "../auth/requireAdmin";
import { count } from "drizzle-orm";
import { user } from "@/db/auth-schema";
import { order, product } from "@/db/schema";

export async function getDashboardStats() {
  try {
    await requireAdmin();

    const [customersResult, ordersResult, productsResult] = await Promise.all([
      db
        .select({
          count: count(),
        })
        .from(user),
      db
        .select({
          count: count(),
        })
        .from(order),
      db
        .select({
          count: count(),
        })
        .from(product),
    ]);

    return {
      success: true,
      stats: {
        totalCustomers: customersResult[0]?.count ?? 0,
        totalOrders: ordersResult[0]?.count ?? 0,
        totalProducts: productsResult[0]?.count ?? 0,
      },
    };
  } catch (error) {
    console.error("GET_DASHBOARD_STATS_ERROR:", error);

    return {
      success: false,
      stats: {
        totalCustomers: 0,
        totalOrders: 0,
        totalProducts: 0,
      },
      message: "Failed to fetch dashboard stats.",
    };
  }
}
