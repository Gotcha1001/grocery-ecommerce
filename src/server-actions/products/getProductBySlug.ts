import { db } from "@/db/db";
import { product } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getProductBySlug(slug: string) {
  try {
    const productData = await db.query.product.findFirst({
      where: eq(product?.slug, slug),

      with: {
        images: true,
      },
    });

    if (!productData) {
      return {
        success: false,
        product: null,
        message: "Product not found",
      };
    }

    return {
      success: true,
      product: productData,
    };
  } catch (error) {
    console.error("GET_PRODUCT_BY_SLUG_ERROR:", error);

    return {
      success: false,
      product: null,
      message: "Failed to fetch product",
    };
  }
}
