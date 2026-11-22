"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiLogOut, FiPackage } from "react-icons/fi";

interface AvatarProps {
  mobile?: boolean;
}

export default function Avatar({ mobile = false }: AvatarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      return toast.error("Failed to Logout");
    }

    toast.success("Logged out successfully");
    router.refresh();
  };

  return (
    <div className="relative">
      {/* Avatar */}
      <div
        onClick={(e) => {
          e.stopPropagation(); // Prevents the login modal from opening
          setOpen(!open);
        }}
        className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-border transition hover:border-primary"
      >
        <Image src={"/avatar.png"} alt="Avatar" fill />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          onClick={(e) => e.stopPropagation()} // Extra safety
          className={`z-50 overflow-hidden rounded-xl border border-border bg-card p-2 shadow-lg bg-background ${
            mobile ? "relative mt-3 w-full" : "absolute right-0 top-12 w-48"
          }`}
        >
          <Link
            href={"/orders"}
            onClick={() => setOpen(false)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text transition hover:bg-background hover:text-primary"
          >
            <FiPackage size={18} />
            <span>My Orders</span>
          </Link>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text transition hover:bg-background hover:text-primary"
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
