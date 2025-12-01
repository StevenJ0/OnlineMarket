"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface FilterSidebarProps {
  categories: { id: string; name: string }[];
  locations: string[];
}

export default function FilterSidebar({
  categories,
  locations,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil state awal dari URL
  const currentCategory = searchParams.get("category") || "";
  const currentLocation = searchParams.get("location") || "";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Jika nilai sama diklik lagi, hapus filter (toggle off)
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Reset page ke 1 jika filter berubah (opsional)
    // params.delete('page');

    router.push(`/search?${params.toString()}`);
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
      {/* Filter Kategori */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
          Kategori
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  currentCategory === cat.name
                    ? "bg-orange-500 border-orange-500"
                    : "border-slate-600 group-hover:border-orange-500"
                }`}
              >
                {currentCategory === cat.name && (
                  <div className="w-2 h-2 bg-white rounded-sm" />
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={currentCategory === cat.name}
                onChange={() => handleFilterChange("category", cat.name)}
              />
              <span
                className={`text-sm transition-colors ${
                  currentCategory === cat.name
                    ? "text-white font-medium"
                    : "text-slate-400 group-hover:text-slate-200"
                }`}
              >
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter Lokasi */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
          Lokasi Toko
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
          {locations.map((loc, idx) => (
            <label
              key={idx}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  currentLocation === loc
                    ? "border-orange-500"
                    : "border-slate-600 group-hover:border-orange-500"
                }`}
              >
                {currentLocation === loc && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={currentLocation === loc}
                onChange={() => handleFilterChange("location", loc)}
              />
              <span
                className={`text-sm transition-colors ${
                  currentLocation === loc
                    ? "text-white font-medium"
                    : "text-slate-400 group-hover:text-slate-200"
                }`}
              >
                {loc}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
