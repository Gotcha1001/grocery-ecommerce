// import { db } from "@/db/db";
// import { order, orderItem, product } from "@/db/schema";
// import { stripe } from "@/lib/stripe";
// import { generateOrderNumber } from "@/utils/generateOrderNumber";
// import { and, eq, gte, inArray, sql } from "drizzle-orm";
// import { headers } from "next/headers";
// import Stripe from "stripe";

// export async function POST(req: Request) {
//   console.log("[webhook] hit");
//   try {
//     const body = await req.text();

//     const headerList = await headers();
//     const signature = headerList.get("stripe-signature");

//     if (!signature) {
//       return new Response("Missing Stripe Signature.", {
//         status: 400,
//       });
//     }

//     let event: Stripe.Event;

//     try {
//       event = stripe.webhooks.constructEvent(
//         body,
//         signature,
//         process.env.STRIPE_WEBHOOK_SECRET!,
//       );
//     } catch (error) {
//       console.error("STRIPE_WEBHOOK_ERROR:", error);

//       return new Response("Invalid Stripe Signature.", {
//         status: 400,
//       });
//     }
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object as Stripe.Checkout.Session;

//       // Only create the order after successful payment.
//       if (session.payment_status !== "paid") {
//         return new Response("Payment not completed.", {
//           status: 200,
//         });
//       }
//       const { userId, addressId, items } = session.metadata ?? {};

//       if (!userId || !addressId || !items) {
//         return new Response("Missing checkout metadata.", {
//           status: 400,
//         });
//       }

//       // Prevent duplicate order creation.
//       const [existingOrder] = await db
//         .select({
//           id: order.id,
//         })
//         .from(order)
//         .where(eq(order.stripeCheckoutSessionId, session.id))
//         .limit(1);

//       if (existingOrder) {
//         return new Response("Order already created.", {
//           status: 200,
//         });
//       }
//       let checkoutItems: {
//         productId: string;
//         quantity: number;
//       }[];
//       try {
//         checkoutItems = JSON.parse(items);
//       } catch (error) {
//         console.error("STRIPE_WEBHOOK_ITEMS_PARSE_ERROR:", error);
//         return new Response("Invalid checkout items.", {
//           status: 400,
//         });
//       }

//       if (checkoutItems.length === 0) {
//         return new Response("Checkout contains no items.", {
//           status: 400,
//         });
//       }

//       const productIds = checkoutItems.map((item) => item.productId);

//       try {
//         await db.transaction(async (tx) => {
//           const products = await tx
//             .select({
//               id: product.id,
//               name: product.name,
//               price: product.price,
//               stock: product.stock,
//             })
//             .from(product)
//             .where(inArray(product.id, productIds));

//           if (products.length !== checkoutItems.length) {
//             throw new Error("One or more products are no longer available");
//           }

//           let subtotal = 0;

//           const orderItems = checkoutItems.map((item) => {
//             const productData = products.find(
//               (product) => product.id === item.productId,
//             );

//             if (!productData) {
//               throw new Error("Product not found.");
//             }

//             if (item.quantity <= 0) {
//               throw new Error("Invalid product quantity");
//             }

//             if (item.quantity > productData.stock) {
//               throw new Error(
//                 `Only ${productData.stock} ${
//                   productData.stock === 1 ? "item" : "items"
//                 } of "${productData.name}" are available`,
//               );
//             }

//             const price = Number(productData.price);

//             subtotal += price * item.quantity;

//             return {
//               id: crypto.randomUUID(),
//               productId: item.productId,
//               quantity: item.quantity,
//               price: productData.price,
//             };
//           });
//           const shippingFee = 0;
//           const tax = subtotal * 0.02;

//           const totalAmount = subtotal + shippingFee + tax;

//           // Verify Stipe charged the same
//           // amount calculated by our server.

//           if (
//             session.amount_total === null ||
//             session.amount_total !== Math.round(totalAmount * 100)
//           ) {
//             throw new Error(
//               "Stripe payment amount does not match order total.",
//             );
//           }

//           const orderId = crypto.randomUUID();

//           const orderNumber = generateOrderNumber();

//           // Create Order
//           await tx.insert(order).values({
//             id: orderId,
//             orderId: orderNumber,
//             userId,
//             addressId,
//             totalAmount: totalAmount.toFixed(2),
//             paymentMethod: "stripe",
//             paymentStatus: "paid",
//             orderStatus: "confirmed",
//             stripePaymentIntentId:
//               typeof session.payment_intent === "string"
//                 ? session.payment_intent
//                 : null,
//             stripeCheckoutSessionId: session.id,
//           });

//           // Create order items.
//           await tx.insert(orderItem).values(
//             orderItems.map((item) => ({
//               ...item,
//               orderId,
//             })),
//           );

//           // Decrease the product stock.
//           for (const item of orderItems) {
//             const updatedProduct = await tx
//               .update(product)
//               .set({
//                 stock: sql`${product.stock} - ${item.quantity}`,
//               })
//               .where(
//                 and(
//                   eq(product.id, item.productId),
//                   gte(product.stock, item.quantity),
//                 ),
//               )
//               .returning({
//                 id: product.id,
//               });

//             if (updatedProduct.length === 0) {
//               throw new Error(
//                 "Stock changed while creating the order. Please try again.",
//               );
//             }
//           }
//         });
//       } catch (error) {
//         console.error("STRIPE_ORDER_CREATION_ERROR:", error);
//       }
//       return new Response("Webhook received.", {
//         status: 200,
//       });
//     }
//   } catch (error) {
//     console.error("STRIPE_ORDER_CREATION_ERROR:", error);
//     return new Response(
//       error instanceof Error ? error.message : "Failed to create order.",
//       {
//         status: 500,
//       },
//     );
//   }
// }

import { db } from "@/db/db";
import { order, orderItem, product } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { generateOrderNumber } from "@/utils/generateOrderNumber";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  console.log("[webhook] hit");

  try {
    const body = await req.text();
    console.log("[webhook] body read, length:", body.length);

    const headerList = await headers();
    const signature = headerList.get("stripe-signature");

    if (!signature) {
      console.log("[webhook] missing signature");
      return new Response("Missing Stripe Signature.", {
        status: 400,
      });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error) {
      console.error("STRIPE_WEBHOOK_ERROR:", error);

      return new Response("Invalid Stripe Signature.", {
        status: 400,
      });
    }

    console.log("[webhook] verified:", event.type, event.id);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log(
        "[webhook] session:",
        session.id,
        "payment_status:",
        session.payment_status,
      );

      // Only create the order after successful payment.
      if (session.payment_status !== "paid") {
        console.log("[webhook] payment not paid, skipping");
        return new Response("Payment not completed.", {
          status: 200,
        });
      }

      const { userId, addressId, items } = session.metadata ?? {};

      if (!userId || !addressId || !items) {
        console.log("[webhook] missing metadata:", session.metadata);
        return new Response("Missing checkout metadata.", {
          status: 400,
        });
      }

      // Prevent duplicate order creation.
      console.log("[webhook] checking existing order");

      const [existingOrder] = await db
        .select({
          id: order.id,
        })
        .from(order)
        .where(eq(order.stripeCheckoutSessionId, session.id))
        .limit(1);

      console.log("[webhook] existing order check done:", !!existingOrder);

      if (existingOrder) {
        return new Response("Order already created.", {
          status: 200,
        });
      }

      let checkoutItems: {
        productId: string;
        quantity: number;
      }[];

      try {
        checkoutItems = JSON.parse(items);
      } catch (error) {
        console.error("STRIPE_WEBHOOK_ITEMS_PARSE_ERROR:", error);
        return new Response("Invalid checkout items.", {
          status: 400,
        });
      }

      if (checkoutItems.length === 0) {
        console.log("[webhook] checkout has no items");
        return new Response("Checkout contains no items.", {
          status: 400,
        });
      }

      const productIds = checkoutItems.map((item) => item.productId);

      try {
        console.log("[webhook] starting transaction");

        await db.transaction(async (tx) => {
          console.log("[webhook] tx: loading products");

          const products = await tx
            .select({
              id: product.id,
              name: product.name,
              price: product.price,
              stock: product.stock,
            })
            .from(product)
            .where(inArray(product.id, productIds));

          console.log("[webhook] tx: products loaded:", products.length);

          if (products.length !== checkoutItems.length) {
            throw new Error("One or more products are no longer available");
          }

          let subtotal = 0;

          const orderItems = checkoutItems.map((item) => {
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
                `Only ${productData.stock} ${
                  productData.stock === 1 ? "item" : "items"
                } of "${productData.name}" are available`,
              );
            }

            const price = Number(productData.price);

            subtotal += price * item.quantity;

            return {
              id: crypto.randomUUID(),
              productId: item.productId,
              quantity: item.quantity,
              price: productData.price,
            };
          });

          const shippingFee = 0;
          const tax = subtotal * 0.02;

          const totalAmount = subtotal + shippingFee + tax;

          console.log(
            "[webhook] tx: amounts - stripe:",
            session.amount_total,
            "calculated (cents):",
            Math.round(totalAmount * 100),
          );

          // Verify Stripe charged the same
          // amount calculated by our server.
          if (
            session.amount_total === null ||
            session.amount_total !== Math.round(totalAmount * 100)
          ) {
            throw new Error(
              "Stripe payment amount does not match order total.",
            );
          }

          const orderId = crypto.randomUUID();

          const orderNumber = generateOrderNumber();

          // Create order.
          console.log("[webhook] tx: inserting order");

          await tx.insert(order).values({
            id: orderId,
            orderId: orderNumber,
            userId,
            addressId,
            totalAmount: totalAmount.toFixed(2),
            paymentMethod: "stripe",
            paymentStatus: "paid",
            orderStatus: "confirmed",
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
            stripeCheckoutSessionId: session.id,
          });

          // Create order items.
          console.log("[webhook] tx: inserting order items");

          await tx.insert(orderItem).values(
            orderItems.map((item) => ({
              ...item,
              orderId,
            })),
          );

          // Decrease the product stock.
          console.log("[webhook] tx: updating stock");

          for (const item of orderItems) {
            const updatedProduct = await tx
              .update(product)
              .set({
                stock: sql`${product.stock} - ${item.quantity}`,
              })
              .where(
                and(
                  eq(product.id, item.productId),
                  gte(product.stock, item.quantity),
                ),
              )
              .returning({
                id: product.id,
              });

            if (updatedProduct.length === 0) {
              throw new Error(
                "Stock changed while creating the order. Please try again.",
              );
            }
          }

          console.log("[webhook] tx: done");
        });

        console.log("[webhook] transaction committed, order created");
      } catch (error) {
        console.error("STRIPE_ORDER_CREATION_ERROR:", error);

        // Return an error so the failure is visible and Stripe retries,
        // instead of silently acknowledging an event that created no order.
        return new Response("Order creation failed.", {
          status: 500,
        });
      }

      return new Response("Webhook received.", {
        status: 200,
      });
    }

    // Any other event type: acknowledge so Stripe doesn't retry.
    console.log("[webhook] ignoring event type:", event.type);

    return new Response("Event ignored.", {
      status: 200,
    });
  } catch (error) {
    console.error("STRIPE_WEBHOOK_UNEXPECTED_ERROR:", error);
    return new Response(
      error instanceof Error ? error.message : "Webhook failed.",
      {
        status: 500,
      },
    );
  }
}
