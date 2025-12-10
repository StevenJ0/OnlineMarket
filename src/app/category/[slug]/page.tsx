"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import { Star, ShoppingBag, ArrowLeft } from "lucide-react";

// --- Types ---
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

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  product_images: ProductImage[];
  seller: Seller | null;
  product_reviews: ProductReview[];
  category: Category | null;   // ⬅️ penting untuk filter
}

// --- Helper ---
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

// bikin nama kategori lebih rapih (elektronik-rumah → Elektronik Rumah)
const beautifySlug = (slug: string) =>
  slug
    .split("-")
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
    .join(" ");

export default function CategoryPage() {
  const params = useParams();
  const slug = (params.slug as string) || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryName = beautifySlug(slug);

  useEffect(() => {
    if (!slug) return;

    const fetchByCategory = async () => {
      try {
        setLoading(true);

        // 1. Ambil semua produk (sama seperti di Home)
        const res = await fetch("/api/product");
        const data = (await res.json()) as Product[] | null;

        const allProducts = data || [];

        // 2. Filter di sisi frontend berdasarkan category.slug
        const filtered = allProducts.filter(
          (p) => p.category?.slug === slug
        );

        setProducts(filtered);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchByCategory();
  }, [slug]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navbar fixed sama seperti Home */}
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      {/* HERO / HEADER KATEGORI */}
      <section className="relative pt-6 pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb + Back */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Link href="/" className="hover:text-orange-400">
                Beranda
              </Link>
              <span>/</span>
              <span className="text-slate-300">Kategori</span>
              <span>/</span>
              <span className="text-orange-400 font-medium">
                {categoryName}
              </span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-orange-400"
            >
              <ArrowLeft size={16} />
              Kembali ke Beranda
            </Link>
          </div>

          {/* Title */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="inline-block py-1 px-3 rounded-full bg-slate-900 border border-slate-800 text-orange-400 text-xs font-semibold mb-4">
                KATEGORI PRODUK
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                {categoryName}
              </h1>
              <p className="text-slate-400 max-w-xl">
                Jelajahi produk terbaik di kategori{" "}
                <span className="text-slate-200">{categoryName}</span> dengan
                penawaran menarik setiap hari.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LIST PRODUK */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            Memuat produk...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/60 rounded-3xl border border-slate-800 border-dashed">
            <ShoppingBag className="mx-auto text-slate-600 mb-4" size={48} />
            <p className="text-slate-300 mb-1">
              Belum ada produk di kategori ini.
            </p>
            <p className="text-slate-500 text-sm">
              Coba kategori lain atau cek kembali nanti.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-400">
                Menampilkan{" "}
                <span className="text-slate-200 font-semibold">
                  {products.length}
                </span>{" "}
                produk di kategori {categoryName}.
              </p>
            </div>

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
                    className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-orange-500/60 hover:-translate-y-1 transition-transform"
                  >
                    {/* IMAGE */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 space-y-2">
                      <h3 className="text-white font-semibold line-clamp-2">
                        {product.name}
                      </h3>

                      {product.seller && (
                        <p className="text-xs text-slate-400">
                          Toko:{" "}
                          <span className="text-slate-200">
                            {product.seller.store_name}
                          </span>
                        </p>
                      )}

                      <p className="text-lg font-bold text-orange-500">
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
          </>
        )}
      </section>
    </main>
  );
}
