import Navbar from "@/components/navbar";
import { supabase } from "@/lib/supabase/init";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import {
  ShoppingBag,
  ArrowRight,
  Search,
  Tag,
  Star,
  MapPin,
} from "lucide-react";

interface ProductImage {
  image_url: string;
  is_primary: boolean;
}

interface ProductReview {
  rating: number;
}

interface Seller {
  store_name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  categories: {
    name: string;
    slug: string;
  } | null;
  product_images: ProductImage[];
  sellers: Seller | null;
  product_reviews: ProductReview[];
}

const formatRupiah = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const calculateRating = (reviews: ProductReview[]) => {
  if (!reviews || reviews.length === 0) return { avg: 0, count: 0 };

  const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const avg = total / reviews.length;

  return {
    avg: parseFloat(avg.toFixed(1)),
    count: reviews.length,
  };
};

async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      price,
      description,
      categories (name, slug),
      sellers (store_name),
      product_images (image_url, is_primary), 
      product_reviews (rating)
    `
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data as unknown as Product[];
}

async function getCategories() {
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug")
    .limit(6);
  return data || [];
}

export default async function Home() {
  const products = await getFeaturedProducts();
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navbar Fixed di atas */}
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Gradients (Efek visual) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-900 border border-slate-800 text-orange-400 text-xs font-semibold mb-6 animate-fade-in">
            MARKETPLACE TERPERCAYA #1
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Temukan Barang <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Impianmu Disini
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Platform jual beli terbaik dengan ribuan produk berkualitas. Belanja
            aman, cepat, dan banyak promo menarik setiap harinya.
          </p>

          {/* Search Bar Besar */}
          <div className="mb-10">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* --- KATEGORI SECTION --- */}
      <section className="py-12 border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Kategori Pilihan</h2>
            <Link
              href="/categories"
              className="text-orange-400 text-sm font-semibold hover:text-orange-300 flex items-center gap-1"
            >
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-orange-500/50 hover:bg-slate-800 transition-all group"
              >
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-colors">
                  <Tag size={20} />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRODUK TERBARU SECTION --- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Produk Terbaru
            </h2>
            <p className="text-slate-400">Barang baru di-upload minggu ini</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed">
            <ShoppingBag className="mx-auto text-slate-600 mb-4" size={48} />
            <p className="text-slate-400">
              Belum ada produk tersedia saat ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const primaryImage =
                product.product_images.find((img) => img.is_primary) ||
                product.product_images[0];
              const imageUrl =
                primaryImage?.image_url ||
                "https://via.placeholder.com/400x300?text=No+Image";

              const { avg: ratingAvg, count: reviewCount } = calculateRating(
                product.product_reviews
              );

              return (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image Wrapper */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.categories && (
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-semibold text-white border border-white/10">
                        {product.categories.name}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-white font-semibold mb-1 line-clamp-2 group-hover:text-orange-400 transition-colors">
                      {product.name}
                    </h3>

                    <div className="mt-auto pt-4">
                      <p className="text-lg font-bold text-orange-500 mb-2">
                        {formatRupiah(product.price)}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
                        <div className="flex items-center gap-1">
                          <StoreIcon className="w-3 h-3" />
                          <span className="truncate max-w-[100px]">
                            {product.sellers?.store_name || "Official Store"}
                          </span>
                        </div>
                        {/* Tampilan Rating Dinamis */}
                        <div className="flex items-center gap-1">
                          <Star
                            size={12}
                            className={`fill-current ${
                              ratingAvg > 0
                                ? "text-yellow-500"
                                : "text-slate-600"
                            }`}
                          />
                          <span
                            className={
                              ratingAvg > 0
                                ? "text-white font-medium"
                                : "text-slate-500"
                            }
                          >
                            {ratingAvg > 0 ? ratingAvg : "Baru"}
                          </span>
                          {reviewCount > 0 && (
                            <span className="text-slate-600">
                              ({reviewCount})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* --- CTA BANNER --- */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ingin Mulai Berjualan?
            </h2>
            <p className="text-white/90 mb-8 max-w-md">
              Buka toko Anda sekarang secara gratis dan jangkau jutaan pembeli
              potensial di seluruh Indonesia.
            </p>
            <Link
              href="/buka-toko"
              className="bg-white text-orange-600 font-bold py-3 px-8 rounded-xl hover:bg-slate-100 transition shadow-lg inline-block"
            >
              Buka Toko Gratis
            </Link>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
      </section>
    </main>
  );
}

// Icon helper kecil
function StoreIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
  );
}
