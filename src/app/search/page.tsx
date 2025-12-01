import Navbar from "@/components/navbar";
import SearchBar from "@/components/SearchBar";
import FilterSidebar from "@/components/FilterSidebar";
import { supabase } from "@/lib/supabase/supabaseClient";
import Link from "next/link";
import { Star, Store, MapPin, ShoppingBag, FilterX } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  categories: { name: string } | null;
  sellers: {
    store_name: string;
    kota?: string;
    provinsi?: string;
  } | null;
  product_images: { image_url: string; is_primary: boolean }[];
  product_reviews: { rating: number }[];
}

const formatRupiah = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

const calculateRating = (reviews: any[]) => {
  if (!reviews || reviews.length === 0) return { avg: 0, count: 0 };
  const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  return {
    avg: parseFloat((total / reviews.length).toFixed(1)),
    count: reviews.length,
  };
};

async function getFilterOptions() {
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  const { data: sellers } = await supabase
    .from("sellers")
    .select("kota")
    .not("kota", "is", null);

  const uniqueLocations = Array.from(
    new Set(sellers?.map((s) => s.kota).filter(Boolean) as string[])
  ).sort();

  return {
    categories: categories || [],
    locations: uniqueLocations,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; location?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const categoryFilter = params.category;
  const locationFilter = params.location;

  const filterOptions = await getFilterOptions();

  let sellerIdsFromSearch: string[] = [];

  if (query) {
    const { data: foundSellers } = await supabase
      .from("sellers")
      .select("id")
      .ilike("store_name", `%${query}%`);

    sellerIdsFromSearch = foundSellers?.map((s) => s.id) || [];
  }

  let dbQuery = supabase
    .from("products")
    .select(
      `
      id, name, price, description, status,
      categories!inner (name), 
      sellers!inner (
        store_name,
        kota,      
        provinsi
      ),
      product_images (image_url, is_primary),
      product_reviews (rating)
    `
    )
    .eq("status", "active");

  if (categoryFilter) {
    dbQuery = dbQuery.eq("categories.name", categoryFilter);
  }

  if (locationFilter) {
    dbQuery = dbQuery.eq("sellers.kota", locationFilter);
  }

  if (query) {
    const orConditions = [
      `name.ilike.%${query}%`,
      `description.ilike.%${query}%`,
    ];

    if (sellerIdsFromSearch.length > 0) {
      orConditions.push(`seller_id.in.(${sellerIdsFromSearch.join(",")})`);
    }

    dbQuery = dbQuery.or(orConditions.join(","));
  }

  const { data, error } = await dbQuery;
  const products = (data as any[]) || [];

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

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-white">
                {query ? `Hasil pencarian "${query}"` : "Semua Produk"}
              </h1>
              <div className="flex gap-2 text-sm text-slate-400 mt-1">
                {categoryFilter && (
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-orange-400">
                    Kategori: {categoryFilter}
                  </span>
                )}
                {locationFilter && (
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-blue-400">
                    Lokasi: {locationFilter}
                  </span>
                )}
              </div>
            </div>
            <span className="text-slate-400 text-sm">
              Ditemukan <strong>{products.length}</strong> produk
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- SIDEBAR FILTER (COMPONENT BARU) --- */}
          <FilterSidebar
            categories={filterOptions.categories}
            locations={filterOptions.locations}
          />

          {/* --- GRID PRODUK --- */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed h-full">
                <FilterX size={64} className="text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-slate-400">
                  Tidak ditemukan
                </h3>
                <p className="text-slate-500 text-center max-w-md mt-2">
                  Coba reset filter atau gunakan kata kunci lain.
                </p>
                {(categoryFilter || locationFilter) && (
                  <Link
                    href={`/search?q=${query}`}
                    className="mt-6 text-orange-500 hover:text-orange-400 font-semibold text-sm"
                  >
                    Hapus Semua Filter
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const primaryImage =
                    product.product_images.find((img: any) => img.is_primary) ||
                    product.product_images[0];
                  const imageUrl =
                    primaryImage?.image_url ||
                    "https://via.placeholder.com/400x300?text=No+Image";
                  const { avg, count } = calculateRating(
                    product.product_reviews
                  );

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
