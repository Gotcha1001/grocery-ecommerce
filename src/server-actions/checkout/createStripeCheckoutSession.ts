"use server";
import { db } from "@/db/db";
import { getCurrentUser } from "../auth/getCurrentUser";
import { product } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { FaSleigh } from "react-icons/fa";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

interface CreateStripeCheckoutSessionData {
  addressId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingFee: number;
  tax: number;
}

export async function createStripeCheckoutSession(
  data: CreateStripeCheckoutSessionData,
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        message: "You must be logged in.",
      };
    }

    if (!data.addressId) {
      return {
        success: false,
        message: "Please select a delivery address.",
      };
    }

    if (data.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty.",
      };
    }

    const productIds = data.items.map((item) => item.productId);

    const products = await db
      .select({
        id: product.id,
        name: product.name,
        stock: product.stock,
        price: product.price,
      })
      .from(product)
      .where(inArray(product.id, productIds));

    if (products.length !== data.items.length) {
      return {
        success: false,
        message: "One or more products are no longer available.",
      };
    }
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      data.items.map((item) => {
        const productData = products.find(
          (product) => product.id === item.productId,
        );
        if (!productData) {
          throw new Error("Product not found.");
        }
        if (item.quantity <= 0) {
          throw new Error("Invalid product quantity");
        }

        if (item.quantity > productData.stock) {
          throw new Error(
            `Only ${productData.stock} ${productData.stock === 1 ? "item" : "items"} of "${productData.name}" are available.`,
          );
        }
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: productData.name,
            },
            unit_amount: Math.round(Number(productData.price) * 100),
          },
          quantity: item.quantity,
        };
      });

    // Add the tax
    if (data.tax > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Tax",
          },
          unit_amount: Math.round(data.tax * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.BETTER_AUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BETTER_AUTH_URL}/checkout`,

      metadata: {
        userId: currentUser.id,
        addressId: data.addressId,
        items: JSON.stringify(data.items),
        shippingFee: data.shippingFee,
        tax: data.tax,
      },
    });

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error("CREATE_STRIPE_CHECKOUT_SESSION_ERROR:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create Stripe checkout session.",
    };
  }
}
