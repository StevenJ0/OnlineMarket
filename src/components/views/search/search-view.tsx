"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import FilterSidebarProduk from "@/components/FilterSidebarProduk";
import FilterSidebarToko from "@/components/FilterSidebarToko";

export default function SearchView({ query }: { query: string }) {
  const [isProduk, setIsProduk] = useState(true);

  const [rawData, setRawData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(query || "");

  // FILTER STATE
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterLocation, setFilterLocation] = useState<string | null>(null);

  const [filterProvince, setFilterProvince] = useState<string | null>(null);
  const [filterCity, setFilterCity] = useState<string | null>(null);

  const getResult = async (keyword: string, isProductTab: boolean) => {
    try {
      const type = isProductTab ? "product" : "store";
      const res = await fetch(
        `/api/product/search?query=${encodeURIComponent(keyword)}&type=${type}`
      );
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.error("fetch error", err);
      return [];
    }
  };

  // FETCH DATA
  useEffect(() => {
    if (!input.trim()) {
      setRawData([]);
      return;
    }

    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      const result = await getResult(input, isProduk);
      if (!mounted) return;
      setRawData(result);
      setLoading(false);
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, [input, isProduk]);

  // APPLY FILTER
  useEffect(() => {
    let data = [...rawData];

    if (isProduk) {
      if (filterCategory)
        data = data.filter((p) => p.category?.name === filterCategory);

      if (filterLocation)
        data = data.filter((p) => {
          const seller = p.seller || {};
          // normalize casing because your API returns "KOTA JAKARTA SELATAN"
          const cityName = seller.city?.name || "";
          const provName = seller.province?.name || "";
          return (
            cityName.toLowerCase().includes(filterLocation.toLowerCase()) ||
            provName.toLowerCase().includes(filterLocation.toLowerCase())
          );
        });
    } else {
      if (filterProvince)
        data = data.filter((s) => s.province?.name === filterProvince);

      if (filterCity) data = data.filter((s) => s.city?.name === filterCity);
    }

    setFilteredData(data);
  }, [
    rawData,
    filterCategory,
    filterLocation,
    filterProvince,
    filterCity,
    isProduk,
  ]);

  const formatRupiah = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  // helper: pick image url from product
  const pickImage = (product: any) => {
    const imgs = product.images || [];
    if (!Array.isArray(imgs) || imgs.length === 0) return null;
    const primary = imgs.find((i: any) => i.is_primary === true);
    return primary?.image_url || imgs[0]?.image_url || null;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      <div className="flex gap-6 max-w-7xl mx-auto pt-20 px-4">

        {/* SIDEBAR */}
        <div className="hidden lg:block">
          {isProduk ? (
            <FilterSidebarProduk
              // you can keep these props or remove them since FilterSidebarProduk fetches its own data
              categories={[{ id: "1", name: "Laptop" }, { id: "2", name: "Keyboard" }]}
              locations={["Jakarta", "Bandung", "Surabaya"]}
              filterCategory={filterCategory}
              filterLocation={filterLocation}
              onCategoryChange={setFilterCategory}
              onLocationChange={setFilterLocation}
            />
          ) : (
            <FilterSidebarToko
              provinces={["Jawa Tengah", "Jawa Barat"]}
              cities={["Semarang", "Bandung"]}
              filterProvince={filterProvince}
              filterCity={filterCity}
              onProvinceChange={setFilterProvince}
              onCityChange={setFilterCity}
            />
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1">

          {/* SEARCH INPUT */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl"
            placeholder="Cari..."
          />

          {/* TAB PRODUK / TOKO */}
          <div className="flex gap-3 mt-4 mb-4">
            <button
              onClick={() => setIsProduk(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isProduk ? "bg-orange-600 text-white" : "bg-slate-800 text-slate-300"
              }`}
            >
              Produk
            </button>

            <button
              onClick={() => setIsProduk(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                !isProduk ? "bg-orange-600 text-white" : "bg-slate-800 text-slate-300"
              }`}
            >
              Toko
            </button>
          </div>

          {/* RESULT */}
          <div className="mt-6">
            {loading && <p className="text-slate-400">Loading...</p>}

            {!loading && filteredData.length === 0 && (
              <p className="text-slate-500">Tidak ditemukan.</p>
            )}

            {/* PRODUK */}
            {!loading && isProduk && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((p, i) => {
                  const imgUrl = pickImage(p) || "https://via.placeholder.com/600x400?text=No+Image";
                  const seller = p.seller || {};
                  const city = seller.city?.name || seller.city || "";
                  const province = seller.province?.name || seller.province || "";

                  return (
                    <Link
                      href={`/product/${p.id}`}
                      key={p.id || i}
                      className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-orange-500/50 hover:shadow-xl transition-all flex flex-col"
                    >
                      <div className="relative aspect-[4/3] bg-slate-800 overflow-hidden">
                        <img
                          src={imgUrl}
                          alt={p.name}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        />

                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                          <div className="flex items-center gap-1 text-xs text-white/90">
                            <svg className="w-3 h-3 text-orange-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zM12 11.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/></svg>
                            <span className="truncate">
                              {city || province || "Indonesia"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-white font-medium line-clamp-2 mb-2 group-hover:text-orange-400 transition-colors">
                          {p.name}
                        </h3>

                        <div className="text-lg font-bold text-white mb-2">
                          {typeof p.price === "number" ? formatRupiah(p.price) : "-"}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-slate-800 pt-3 mt-auto">
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3z"/></svg>
                            <span className="truncate">{seller.store_name || "Toko"}</span>
                          </div>

                          {/* placeholder rating (only show if available) */}
                          {p.reviews && Array.isArray(p.reviews) && (
                            <div className="flex items-center gap-1 ml-auto">
                              <svg className="w-3 h-3 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.847L19.335 24 12 20.201 4.665 24 6 15.595 0 9.748l8.332-1.73z"/></svg>
                              <span>{(p.reviews.reduce((a:any,b:any)=>a+(b.rating||0),0) / (p.reviews.length||1)).toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* TOKO */}
            {!loading && !isProduk && (
              <div className="space-y-3">
                {filteredData.map((s, i) => (
                <Link
                  href={`/store/${s.id}`}
                  key={s.id || i}
                  className="block p-4 bg-slate-900 rounded-xl hover:border hover:border-orange-500 transition-all"
                >
                  <h3 className="text-white font-medium">{s.store_name}</h3>

                  <p className="text-slate-400 text-sm mt-1">
                    {s.city?.name || s.city || ""}, {s.province?.name || s.province || ""}
                  </p>
                </Link>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
