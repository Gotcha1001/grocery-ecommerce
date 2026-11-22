"use server";
import { db } from "@/db/db";
import { product, productImage } from "@/db/schema";
import cloudinary from "@/lib/cloudinary";
import { eq } from "drizzle-orm";

export async function deleteProduct(productId: string) {
  try {
    // Get all images belonging to the product
    const images = await db
      .select({
        publicId: productImage.publicId,
      })
      .from(productImage)
      .where(eq(productImage.productId, productId));

    // Delete all images from Cloudinary
    await Promise.all(
      images.map((image) => cloudinary.uploader.destroy(image.publicId)),
    );

    // Delete product from database
    // Product images will also be deleted because of onDelete: "cascade"
    await db.delete(product).where(eq(product.id, productId));

    return {
      success: true,
      message: "Product deleted successfully.",
    };
  } catch (error) {
    console.error("DELETE_PRODUCT_ERROR:", error);

    return {
      success: false,
      message: "Failed to delete product",
    };
  }
}
