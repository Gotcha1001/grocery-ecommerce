"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const search = query.trim();

    if (!search) return;

    const timeout = setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [router, query]);

  return (
    <div className="hidden items-center gap-2 rounded-full border border-border px-3 lg:flex">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="text"
        placeholder="Search Products"
        className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-muted"
      />
      <FaSearch className="text-muted" size={14} />
    </div>
  );
}
