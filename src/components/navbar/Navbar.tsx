"use client";
import Link from "next/link";
import { FiPackage } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import Avatar from "./Avatar";
import { useState } from "react";
import CartSidebar from "./CartSidebar";
import GroceryAssistant from "./GroceryAssistant";
import { LuSparkles } from "react-icons/lu";
import { useAuthModal } from "@/store/authModalStore";
import { authClient } from "@/lib/auth-client";
import SearchInput from "./SearchInput";
import MobileSearchInput from "./MobileSearchInput";
import { useCartStore } from "@/store/cart-store";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const { openLogin } = useAuthModal();

  const cartItems = useCartStore((state) => state.cartItems);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsAIOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-primary-hover"
      >
        <LuSparkles size={18} />
        <span>Ask AI</span>
      </button>
      <nav className="relative z-40 flex items-center justify-between border-b border-border bg-white px-6 py-4 transition-all md:px-16 lg:px-24 xl:px-32">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <FiPackage size={22} />
          </div>
          <span className="text-xl font-bold text-text">
            Grocery<span className="text-primary">Cart</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 sm:flex">
          <Link href={"/"} className="transition hover:text-primary">
            Home
          </Link>
          <Link href={"/products"} className="transition hover:text-primary">
            Products
          </Link>
          <Link href={"/contact"} className="transition hover:text-primary">
            Contact
          </Link>

          {/* Search Input */}
          <SearchInput />
          {/* Cart */}
          <button
            onClick={() => {
              setCartOpen(true);
            }}
            className="relative cursor-pointer"
            type="button"
          >
            <IoCartOutline
              className="text-muted transition hover:text-primary"
              size={24}
            />

            {cartCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Avatar / Login */}
          <div onClick={openLogin} className="flex items-center gap-2">
            {session ? (
              <Avatar />
            ) : (
              <button className="cursor-pointer rounded-full bg-primary px-6 py-2 text-sm text-white transition hover:bg-primary-hover">
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="sm:hidden"
          type="button"
        >
          <span className="flex flex-col gap-1.5">
            <span className="h-0.5 w-5 rounded-full bg-muted"></span>
            <span className="ml-1 h-0.5 w-4.5 rounded-full bg-muted"></span>
          </span>
        </button>
        {/* Mobile Menu */}
        <div
          className={`absolute left-0 top-full z-50 w-full flex-col items-start gap-4 border-b border-border bg-white px-5 py-5 text-sm shadow-md sm:hidden ${open ? "flex" : "hidden"}`}
        >
          <Link href={"/"} className="transition hover:text-primary">
            Home
          </Link>
          <Link href={"/products"} className="transition hover:text-primary">
            Products
          </Link>
          <Link href={"/contact"} className="transition hover:text-primary">
            Contact
          </Link>

          {/* Modile Search */}
          <MobileSearchInput />
          {/* Modile Cart */}
          <button
            onClick={() => {
              setOpen(false);
              setCartOpen(true);
            }}
            className="flex w-full cursor-pointer items-center gap-3 text-left transition hover:text-primary"
          >
            <div className="relative">
              <IoCartOutline size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] text-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="">Cart</span>
          </button>
          {/* Avatar / Login */}
          <div className="flex items-center gap-2">
            {session ? (
              <Avatar mobile />
            ) : (
              <button className="cursor-pointer rounded-full bg-primary px-6 py-2 text-sm text-white transition hover:bg-primary-hover">
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
      {/* cartsidebar */}
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      <GroceryAssistant onClose={() => setIsAIOpen(false)} open={isAIOpen} />
    </>
  );
}
