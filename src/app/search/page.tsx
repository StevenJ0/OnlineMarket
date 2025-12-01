import Navbar from "@/components/navbar";
import SearchBar from "@/components/SearchBar";
import { supabase } from "@/lib/supabase/supabaseClient";
import Link from "next/link";
import { Star, Store, MapPin, Filter, ShoppingBag } from "lucide-react";

// --- Tipe Data ---
// (Kita gunakan tipe data yang mirip dengan Home, tapi perlu detail Lokasi untuk SRS)
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  categories: { name: string } | null;
  sellers: {
    store_name: string;
    kota?: string; // Tambahkan ini
    provinsi?: string; // Tambahkan ini
    // Hapus bagian addresses: { ... } yang lama
  } | null;
  product_images: { image_url: string; is_primary: boolean }[];
  product_reviews: { rating: number }[];
}

// --- Helper Rupiah ---
const formatRupiah = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

// --- Helper Rating ---
const calculateRating = (reviews: any[]) => {
  if (!reviews || reviews.length === 0) return { avg: 0, count: 0 };
  const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  return {
    avg: parseFloat((total / reviews.length).toFixed(1)),
    count: reviews.length,
  };
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";

  console.log("🔍 Mencari keyword:", query); // Debug 1: Cek keyword masuk

  // --- QUERY DATABASE ---
  let dbQuery = supabase.from("products").select(`
      id, name, price, description, status,
      categories (name),
      sellers (
        store_name,
        kota,      
        provinsi
      ),
      product_images (image_url, is_primary),
      product_reviews (rating)
    `);
  // .eq("status", "active") <--- SAYA KOMENTARI DULU UNTUK TEST

  if (query) {
    // Menggunakan raw string agar lebih aman terhadap karakter spesial
    // Pastikan mencari ke deskripsi hanya jika deskripsi tidak null (otomatis dihandle ilike biasanya)
    dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  }

  const { data, error } = await dbQuery;

  // Debug 2: Cek apa yang dikembalikan Supabase
  if (error) {
    console.error("❌ Supabase Error:", error.message);
  } else {
    console.log(`✅ Ditemukan ${data?.length} produk.`);
    if (data && data.length > 0) {
      console.log("Sample status produk pertama:", (data[0] as any).status);
    }
  }

  const products = (data as unknown as Product[]) || [];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      <div className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Pencarian */}
        <div className="mb-8">
          <div className="mb-6">
            <SearchBar defaultValue={query} />
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">
              {query ? `Hasil pencarian untuk "${query}"` : "Semua Produk"}
            </h1>
            <span className="text-slate-400 text-sm">
              Ditemukan <strong>{products.length}</strong> produk
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- SIDEBAR FILTER (UI Only untuk SRS) --- */}
          {/* Implementasi filter lokasi fungsional butuh State Management Client Side */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6 hidden lg:block">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4 text-white font-bold">
                <Filter size={18} /> Filter
              </div>

              {/* Filter Lokasi (Mockup untuk SRS) */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Lokasi
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded bg-slate-800 border-slate-700"
                    />{" "}
                    Jabodetabek
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded bg-slate-800 border-slate-700"
                    />{" "}
                    Jawa Tengah
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded bg-slate-800 border-slate-700"
                    />{" "}
                    Luar Jawa
                  </label>
                </div>
              </div>

              <div className="border-t border-slate-800 my-4"></div>

              {/* Filter Harga */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Harga
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Min"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Max"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* --- GRID PRODUK --- */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
                <ShoppingBag size={64} className="text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-slate-400">
                  Produk tidak ditemukan
                </h3>
                <p className="text-slate-500">
                  Coba kata kunci lain atau kurangi filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const primaryImage =
                    product.product_images.find((img) => img.is_primary) ||
                    product.product_images[0];
                  const imageUrl =
                    primaryImage?.image_url ||
                    "https://via.placeholder.com/400x300?text=No+Image";
                  const { avg, count } = calculateRating(
                    product.product_reviews
                  );

                  // Ambil Lokasi Toko
                  const sellerData = product.sellers as any;
                  const cityName =
                    sellerData?.kota || sellerData?.provinsi || "Indonesia";

                  return (
                    <Link
                      href={`/product/${product.id}`}
                      key={product.id}
                      className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-orange-500/50 hover:shadow-xl transition-all flex flex-col"
                    >
                      <div className="relative aspect-[4/3] bg-slate-800 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.sellers?.store_name && (
                          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                            <div className="flex items-center gap-1 text-xs text-white/90">
                              <MapPin size={12} className="text-orange-500" />
                              {cityName}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <div className="text-xs text-orange-400 font-semibold mb-1">
                          {product.categories?.name}
                        </div>
                        <h3 className="text-white font-medium line-clamp-2 mb-2 group-hover:text-orange-400 transition-colors">
                          {product.name}
                        </h3>

                        <div className="mt-auto">
                          <div className="text-lg font-bold text-white mb-2">
                            {formatRupiah(product.price)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-slate-800 pt-3">
                            <div className="flex items-center gap-1">
                              <Store size={12} /> {product.sellers?.store_name}
                            </div>
                            <div className="flex items-center gap-1 ml-auto">
                              <Star
                                size={12}
                                className={
                                  avg > 0
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-slate-600"
                                }
                              />
                              <span>{avg > 0 ? avg : "Baru"}</span>
                              {count > 0 && <span>({count})</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
