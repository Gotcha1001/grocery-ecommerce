import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import toast from "react-hot-toast";

interface GroceryProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  oldPrice: string | null;
  unit: string;
  stock: number;
  image: string | null;
}

export interface GrocerySuggestion {
  name: string;
  quantity: number;
  product: GroceryProduct | null;
}

interface GrocerySuggestionsListProps {
  suggestions: GrocerySuggestion[];
}

export default function GrocerySuggestionsList({
  suggestions,
}: GrocerySuggestionsListProps) {
  const { addToCart } = useCartStore();

  const handleAddToCart = (suggestion: GrocerySuggestion) => {
    const product = suggestion.product;

    if (!product) return;

    if (!product.image) {
      toast.error("This product has no image.");
      return;
    }

    if (product.stock < suggestion.quantity) {
      toast.error(`Only ${product.stock} ${product.name} available.`);
      return;
    }

    for (let i = 0; i < suggestion.quantity; i++) {
      addToCart({
        id: product.name,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image,
        unit: product.unit,
      });
    }
    toast.success(`${product.name} added to cart.`);
  };

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion) => {
        const product = suggestion.product;

        if (!product) {
          return (
            <div
              key={suggestion.name}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div>
                <p className="text-sm font-medium text-text">
                  {suggestion.name}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Not available in our store
                </p>
              </div>
            </div>
          );
        }

        const isOutOfStock = product.stock < suggestion.quantity;

        return (
          <div
            key={product.id}
            className="rounded-xl border border-border bg-card p-3"
          >
            <div className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-background">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center">No Image</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text">
                  {product.name}
                </p>
                <p className="mt-1 text-xs text-muted">{product.unit}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-text">
                    ${Number(product.price).toLocaleString()}
                  </p>
                  <span className="text-xs text-muted">
                    Qty: {suggestion.quantity}
                  </span>
                </div>
                {isOutOfStock && (
                  <p className="mt-1 text-xs text-red-500">Not enough stock</p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleAddToCart(suggestion)}
              type="button"
              disabled={isOutOfStock}
              className="mt-3 rounded-lg bg-primary px-6 py-2.5 text-xs font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOutOfStock ? "Out Of Stock" : "Add To Cart"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
