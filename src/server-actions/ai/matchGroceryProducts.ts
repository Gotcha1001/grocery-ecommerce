"use server";
import { db } from "@/db/db";
import { product } from "@/db/schema";
import { ilike, or } from "drizzle-orm";

interface GroceryItems {
  name: string;
  quantity: number;
}

export async function matchGroceryProducts(items: GroceryItems[]) {
  try {
    if (items.length === 0) {
      return {
        success: true,
        products: [],
      };
    }

    const matchedProducts = [];

    for (const item of items) {
      const productData = await db.query.product.findFirst({
        where: or(
          ilike(product.name, `%${item.name}`),
          ilike(product.description, `%${item.name}`),
        ),
        with: {
          images: true,
        },
      });

      if (!productData) {
        matchedProducts.push({
          name: item.name,
          quantity: item.quantity,
          product: null,
        });
        continue;
      }
      matchedProducts.push({
        name: item.name,
        quantity: item.quantity,
        product: {
          id: productData.id,
          name: productData.name,
          slug: productData.slug,
          price: productData.price,
          oldPrice: productData.oldPrice,
          unit: productData.unit,
          stock: productData.stock,
          image:
            productData.images.find((image) => image.isMain)?.imageUrl ?? null,
        },
      });
    }
    return {
      success: true,
      products: matchedProducts,
    };
  } catch (error) {
    console.error("MATCH_GROCERY_PRODUCTS_ERROR:", error);

    return {
      success: false,
      products: [],
      message: "Failed to match grocery products.",
    };
  }
}
