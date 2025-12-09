"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { ShoppingBag, ArrowRight, Star, Tag } from "lucide-react";
import { useState, useEffect } from "react";

// Tipe data
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
  category: { id: string; name: string; slug: string } | null;
  product_images: ProductImage[];
  seller: Seller | null;
  product_reviews: ProductReview[];
}

const formatRupiah = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

const calculateRating = (reviews: ProductReview[]) => {
  if (!reviews || reviews.length === 0) return { avg: 0, count: 0 };

  const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const avg = total / reviews.length;

  return {
    avg: parseFloat(avg.toFixed(1)),
    count: reviews.length,
  };
};

export default function HomeView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllCategories = async () => {
    try {
      const res = await fetch("/api/categories", { method: "GET" });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Fetch products
  const getAllProducts = async () => {
    try {
      const res = await fetch("/api/product", { method: "GET" });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [catData, productData] = await Promise.all([
        getAllCategories(),
        getAllProducts(),
      ]);

      setCategories((catData.data || []).flat());
      setProducts(productData || []);

      setLoading(false);
    };

    fetchData();
  }, []);

  console.log(categories);
  console.log(products);
  // === RETURN VIEW ===
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-900 border border-slate-800 text-orange-400 text-xs font-semibold mb-6">
            MARKETPLACE TERPERCAYA #1
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6">
            Temukan Barang <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Impianmu Disini
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
            Platform jual beli terbaik dengan ribuan produk berkualitas.
          </p>

          <div className="mb-10">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* KATEGORI */}
      <section className="py-12 border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Kategori Pilihan</h2>
            <Link
              href="/categories"
              className="text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-orange-500/50"
              >
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                  <Tag size={20} />
                </div>
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUK TERBARU */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Produk Terbaru
            </h2>
            <p className="text-slate-400">Barang baru di-upload minggu ini</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading...</div>
        ) : products.length === 0 ? (
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
                  className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-orange-500/50"
                >
                  {/* IMAGE */}
                  <div className="relative aspect-[4/3]">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-1">
                      {product.name}
                    </h3>

                    <p className="text-lg font-bold text-orange-500 mb-2">
                      {formatRupiah(product.price)}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Star
                        size={12}
                        className={
                          ratingAvg > 0 ? "text-yellow-500" : "text-slate-600"
                        }
                      />
                      <span>{ratingAvg > 0 ? ratingAvg : "Baru"}</span>
                      {reviewCount > 0 && <span>({reviewCount})</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

// Ikon toko
function StoreIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
    </svg>
  );
}
