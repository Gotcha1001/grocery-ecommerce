"use client";

import { getProductBySlug } from "@/server-actions/products/getProductBySlug";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type ProductType = NonNullable<
  Awaited<ReturnType<typeof getProductBySlug>>["product"]
>;

interface ProductPageComponentProps {
  product: ProductType;
}

export default function ProductPageComponent({
  product,
}: ProductPageComponentProps) {
  const mainImage =
    product.images.find((image) => image.isMain)?.imageUrl ||
    product.images[0].imageUrl ||
    "";

  const [thumbnail, setThumbnail] = useState(mainImage);
  const { addToCart } = useCartStore();
  const router = useRouter();

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
    }
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      unit: product.unit,
      image: mainImage,
    });

    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
    }
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      unit: product.unit,
      image: mainImage,
    });

    // Route the user to the checkout page
    router.push("/checkout");
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted sm:text-sm">
        <span>Home</span>
        <span>/</span>
        <span>Products</span>
        <span>/</span>
        <span className="text-primary">{product.name}</span>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row md:gap-12 lg:gap-16">
        {/* Product Images */}
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible">
              {product.images.map((image, index) => (
                <button
                  onClick={() => setThumbnail(image.imageUrl)}
                  type="button"
                  key={index}
                  className={`h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-white transition sm:h-20 sm:w-20 ${thumbnail === image.imageUrl ? "border-primary" : "border-border hover:border-primary"}`}
                >
                  <Image
                    src={image.imageUrl}
                    alt={`thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
            {/* Main Image */}
            <div className="h-72 w-full overflow-hidden rounded-lg border border-border bg-background sm:h-96 md:h-105">
              <Image
                src={thumbnail}
                alt={product.name}
                width={600}
                height={600}
                className="h-full w-full object-contain p-4 sm:p-6"
              />
            </div>
          </div>
        </div>
        {/* Information */}

        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-medium text-text sm:text-3xl lg:text-4xl">
            {product.name}
          </h2>
          <p className="mt-2 text-sm text-muted">{product.category}</p>
          <div className="mt-5">
            <p className="text-sm text-muted line-through sm:text-base">
              ${product.oldPrice}
            </p>
            <p className="mt-1 text-2xl font-medium text-primary sm:text-3xl">
              ${product.price}
            </p>
            <div className="mt-6">
              <p className="text-base font-medium text-text mb-4">
                About Product
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">
                {product.description}
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                type="button"
                className="w-full cursor-pointer rounded-lg bg-gray-100 py-3.5 font-medium text-text transition hover:bg-border"
              >
                {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                type="button"
                className="w-full cursor-pointer rounded-lg bg-primary py-3.5 font-medium text-white transition hover:bg-primary-hover"
              >
                {product.stock <= 0 ? "Out of Stock" : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
