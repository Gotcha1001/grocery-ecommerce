import { db } from "@/db/db";
import { requireAdmin } from "../auth/requireAdmin";
import { desc } from "drizzle-orm";
import { product } from "@/db/schema";

export async function getProducts() {
  try {
    await requireAdmin();

    const products = await db.query.product.findMany({
      with: {
        images: true,
      },
      orderBy: desc(product.createdAt),
    });

    const productsWithMainImage = products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.images.find((image) => image.isMain)?.imageUrl ?? null,
    }));
    return {
      success: true,
      products: productsWithMainImage,
    };
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR", error);

    return {
      success: false,
      products: [],
      message: "Failed to fetch products.",
    };
  }
}
