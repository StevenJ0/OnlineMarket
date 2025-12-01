"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    // Redirect ke halaman search dengan query param ?q=...
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative flex items-center bg-slate-900 border border-slate-700/50 rounded-2xl p-2 shadow-2xl w-full max-w-2xl mx-auto group focus-within:border-orange-500/50 transition-all"
    >
      <Search
        className="ml-4 text-slate-500 group-focus-within:text-orange-500 transition-colors"
        size={24}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari produk, toko, atau kategori..."
        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-3 text-lg outline-none"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-orange-500/20"
      >
        {isLoading ? "..." : "Cari"}
      </button>
    </form>
  );
}
