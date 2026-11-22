"use client";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { IoCartOutline } from "react-icons/io5";

interface ProductCardType {
  id: string;
  name: string;
  category: string;
  price: string;
  oldPrice: string | null;
  unit: string;
  slug: string;
  image: string | null;
}

interface ProductCardProps {
  product: ProductCardType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      unit: product.unit,
      image: product.image,
    });

    toast.success("Added to cart");
  };

  return (
    <div className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white w-full">
      <Link
        href={`/products/${product.slug}`}
        className="group flex items-center justify-center px-2"
      >
        <Image
          src={product.image || ""}
          alt={product.name}
          width={400}
          height={400}
          className="group-hover:scale-105 transition w-40 h-40 object-contain"
        />
      </Link>
      <div className="text-gray-500/60 text-sm">
        <p className="">{product.category}</p>
        <p className="text-gray-700 font-medium text-lg truncate w-full">
          {product.name}
        </p>
        <div className="flex items-end justify-between mt-3">
          <p className="md:text-xl text-base font-medium text-primary">
            {product.price}{" "}
            <span className="text-gray-500/60 md:text-sm text-xs line-through">
              {product.oldPrice}
            </span>
          </p>
          <div className="text-primary">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1 bg-[#E8F7EF] border border-primary-hover md:w-[80px]w-[64px] h-[34px] rounded text-primary font-medium p-3"
            >
              <IoCartOutline size={16} className="text-primary" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
