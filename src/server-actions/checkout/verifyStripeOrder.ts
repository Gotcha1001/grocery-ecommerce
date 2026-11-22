"use server";

import { db } from "@/db/db";
import { getCurrentUser } from "../auth/getCurrentUser";
import { order } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function verifyStripeOrder(sessionId: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        orderExists: false,
        message: "You must be logged in.",
      };
    }

    if (!sessionId) {
      return {
        success: false,
        orderExists: false,
        message: "Missing Stripe session ID.",
      };
    }

    const [existingOrder] = await db
      .select({
        id: order.id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      })
      .from(order)
      .where(eq(order.stripeCheckoutSessionId, sessionId))
      .limit(1);

    if (!existingOrder) {
      return {
        success: true,
        orderExists: false,
      };
    }

    return {
      success: true,
      orderExists: true,
      order: existingOrder,
    };
  } catch (error) {
    console.error("VERIFY_STRIPE_ORDER_ERROR:", error);

    return {
      success: false,
      orderExists: false,
      message: "Failed to verify Stripe order.",
    };
  }
}
