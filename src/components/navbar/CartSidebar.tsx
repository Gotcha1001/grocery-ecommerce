import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import Link from "next/link";
import { FiMinus, FiPlus, FiShoppingCart, FiTrash2, FiX } from "react-icons/fi";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const cartItems = useCartStore((state) => state.cartItems);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const subTotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 z-50 bg-black/40" />
      )}

      {/* Sidbar */}
      <aside
        className={`fixed right-0 top-0 z-60 flex h-dvh w-full max-w-105 flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-5">
          <div>
            <h2 className="text-lg font-semibold text-text">Your Cart</h2>
            <p className="mt-0.5 text-xs text-muted">
              {cartCount} items in your cart
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-background text-muted transition hover:bg-border hover:text-text"
          >
            <FiX size={19} />
          </button>
        </div>

        {/* CartItems */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background">
                <FiShoppingCart size={28} className="text-muted" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text">
                Your cart is empty
              </h3>
              <p className="mt-2 max-w-xs text-sm text-muted">
                Add some products to your cart and they will appear here
              </p>
              <Link
                href={"/products"}
                onClick={onClose}
                className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 border-b border-border pb-5"
                >
                  {/* Product Image */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background">
                    <Image
                      src={item.image || ""}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  {/* Product Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="line-clamp-2 text-sm font-medium text-text">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-xs text-muted">{item.unit}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        type="button"
                        className="shrink-0 cursor-pointer text-muted transition hover:text-error"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center overflow-hidden rounded-md border border-border">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          type="button"
                          className="flex h-7 w-7 cursor-pointer items-center justify-center text-muted transition hover:bg-background hover:text-primary"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="flex h-7 w-8 items-center justify-center border-x border-border text-xs font-medium text-text">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          type="button"
                          className="flex h-7 w-7 cursor-pointer items-center justify-center text-muted transition hover:bg-background hover:text-primary"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                      {/* Price */}
                      <p className="text-sm font-semibold text-text">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="border-t border-border bg-white px-5 py-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted">Subtotal</span>
            <span className="text-lg font-semibold text-text">
              ${subTotal.toFixed(2)}
            </span>
          </div>
          <p className="mb-4 text-xs leading-5 text-muted">
            Delivery charges and taxes will be calculated at checkout.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              type="button"
              className="cursor-pointer rounded-lg border border-primary py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
            >
              Cancel
            </button>
            <Link
              href={"/checkout"}
              className="flex cursor-pointer items-center justify-center rounded-lg bg-primary py-3 text-sm font-medium text-white transition hover:bg-primary-hover"
              onClick={onClose}
            >
              Checkout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
