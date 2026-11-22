"use client";
import { useAuthModal } from "@/store/authModalStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoginRedirectHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { openLogin } = useAuthModal();

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      openLogin();

      // removing the /?login=true
      router.replace(pathname);
    }
  }, [searchParams, openLogin, router, pathname]);

  return null;
}
