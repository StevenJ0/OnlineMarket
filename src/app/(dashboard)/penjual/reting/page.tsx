"use client";

import { useMemo, useState, useCallback } from "react";
import {
  Star,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  ChevronDown,
  MapPin,
  User,
} from "lucide-react";

// --- TIPE DATA (Sesuai Tabel DB & Hasil Join) ---

type Sentiment = "positive" | "neutral" | "negative";

// Merepresentasikan satu baris di tabel 'product_reviews' + Join Users/Provinces
type ReviewDB = {
  id: string; // UUID
  rating: number; // 1-5
  comment: string;
  created_at: string;
  
  // Logika Identitas (Sesuai SRS: Visitor vs Registered)
  user_name?: string; // Hasil join ke tabel users jika user_id tidak null
  guest_name?: string; // Dari kolom guest_name
  guest_province?: string; // Hasil join ke tabel provinces
};

// Merepresentasikan Agregasi Produk untuk Dashboard
type ProductReviewSummary = {
  id: string; // UUID product
  name: string; // products.name
  imageUrl: string; // product_images.image_url (is_primary)
  
  // Field Agregasi (Dihitung dari kumpulan reviews)
  avgRating: number;
  totalReviews: number;
  reviews: ReviewDB[];
  
  // Data Analitik (Simulasi Frontend)
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
  trend: "up" | "down" | "flat";
};

// --- MOCK DATA (Struktur Valid DB) ---

const MOCK_REVIEWS_DATA: ProductReviewSummary[] = [
  {
    id: "p1",
    name: "Kopi Arabica 250gr",
    imageUrl: "https://images.pexels.com/photos/2968881/pexels-photo-2968881.jpeg?auto=compress&cs=tinysrgb&w=400",
    avgRating: 4.8,
    totalReviews: 3,
    positivePercent: 90,
    neutralPercent: 7,
    negativePercent: 3,
    trend: "up",
    reviews: [
      {
        id: "r1",
        rating: 5,
        comment: "Rasanya enak banget, aromanya kuat. Pengiriman ke Surabaya cepat.",
        created_at: "2 jam lalu",
        guest_name: "Budi Santoso", // Visitor
        guest_province: "Jawa Timur" // SRS Requirement
      },
      {
        id: "r2",
        rating: 5,
        comment: "Packing rapi, bijinya fresh.",
        created_at: "Kemarin",
        user_name: "Dewi Member", // Registered User
      },
      {
        id: "r3",
        rating: 4,
        comment: "Overall mantap, cuma sedikit pahit di akhir.",
        created_at: "3 hari lalu",
        guest_name: "Andi Wijaya",
        guest_province: "Jawa Barat"
      },
    ],
  },
  {
    id: "p2",
    name: "Teh Hijau Premium",
    imageUrl: "https://images.pexels.com/photos/373888/pexels-photo-373888.jpeg?auto=compress&cs=tinysrgb&w=400",
    avgRating: 4.2,
    totalReviews: 2,
    positivePercent: 70,
    neutralPercent: 20,
    negativePercent: 10,
    trend: "flat",
    reviews: [
      {
        id: "r4",
        rating: 4,
        comment: "Tehnya wangi dan segar.",
        created_at: "Kemarin",
        guest_name: "Sri Aminah",
        guest_province: "DKI Jakarta"
      },
      {
        id: "r5",
        rating: 5,
        comment: "Rasanya lembut, favorit keluarga.",
        created_at: "4 hari lalu",
        user_name: "Rahmat Hidayat"
      },
    ],
  },
];

// ---------- KOMPOSISI UI ----------

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < fullStars ? "fill-yellow-400 text-yellow-400" : "text-slate-600"
          }`}
        />
      ))}
    </div>
  );
}

type ReviewCardProps = {
  product: ProductReviewSummary;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
};

function ReviewCard({ product, expanded, onExpand, onCollapse }: ReviewCardProps) {
  const sentimentColor = (type: Sentiment) => {
    if (type === "positive") return "bg-emerald-500/15 text-emerald-400";
    if (type === "neutral") return "bg-slate-500/10 text-slate-300";
    return "bg-rose-500/15 text-rose-400";
  };

  const trendIcon =
    product.trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-emerald-400" />
    ) : product.trend === "down" ? (
      <TrendingDown className="h-4 w-4 text-rose-400" />
    ) : (
      <div className="h-1 w-3 bg-slate-500 rounded-full" />
    );

  const trendLabel =
    product.trend === "up" ? "Rating naik" : product.trend === "down" ? "Rating turun" : "Stabil";

  // State untuk custom scrollbar
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(100);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight) {
      setThumbTop(0);
      setThumbHeight(100);
      return;
    }
    const ratio = clientHeight / scrollHeight;
    const h = Math.max(ratio * 100, 20);
    const maxTop = 100 - h;
    const top = (scrollTop / (scrollHeight - clientHeight)) * maxTop;
    setThumbHeight(h);
    setThumbTop(top);
  }, []);

  return (
    <article
      className="group flex flex-col gap-3 rounded-xl border border-slate-800 bg-gradient-to-br from-[#020617] via-[#020617] to-[#0b1220] p-4 shadow-md shadow-black/40 transition hover:-translate-y-[1px] hover:border-[#ff7a1a] hover:shadow-[0_0_40px_rgba(248,115,22,0.35)]"
      onMouseLeave={onCollapse}
    >
      {/* HEADER PRODUK */}
      <button
        type="button"
        onClick={expanded ? onCollapse : onExpand}
        className="flex w-full items-start gap-3 text-left"
      >
        <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-1 items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-50">{product.name}</h3>
            {/* SKU DIHAPUS - Tidak ada di DB */}
            
            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
              <StarRating rating={product.avgRating} />
              <span className="font-semibold text-slate-50">{product.avgRating.toFixed(1)}</span>
              <span>({product.totalReviews} ulasan)</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="inline-flex items-center gap-1 rounded-full bg-[#020617] px-2.5 py-1 text-[11px]">
              {trendIcon}
              <span className="text-slate-300">{trendLabel}</span>
            </div>
            <div className="flex flex-wrap gap-1 text-[10px]">
              <span className={`rounded-full px-2 py-0.5 ${sentimentColor("positive")}`}>Positif {product.positivePercent}%</span>
              <span className={`rounded-full px-2 py-0.5 ${sentimentColor("neutral")}`}>Netral {product.neutralPercent}%</span>
              <span className={`rounded-full px-2 py-0.5 ${sentimentColor("negative")}`}>Negatif {product.negativePercent}%</span>
            </div>
          </div>
        </div>

        <div className="ml-2 mt-1 flex items-center">
          <ChevronDown className={`h-4 w-4 text-slate-400 transition ${expanded ? "rotate-180" : "rotate-0"}`} />
        </div>
      </button>

      {/* INFO KECIL */}
      {!expanded && (
        <p className="mt-1 text-[11px] text-slate-500">Klik card ini untuk melihat detail komentar pelanggan.</p>
      )}

      {/* LIST REVIEW */}
      {expanded && (
        <div className="mt-1 rounded-lg border border-slate-800/70 bg-[#020617] p-3">
          <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Ulasan Pelanggan</span>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_8px] gap-2">
            <div className="custom-scroll max-h-52 overflow-y-auto pr-2" onScroll={handleScroll}>
              <div className="space-y-2">
                {product.reviews.map((review) => (
                  <div key={review.id} className="rounded-md border border-slate-800 bg-[#020617] px-2.5 py-2 text-xs">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Avatar Initials */}
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-slate-100 ${review.user_name ? 'bg-blue-600' : 'bg-slate-700'}`}>
                          {(review.user_name || review.guest_name || "A").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-[11px] font-medium text-slate-100">
                              {review.user_name || review.guest_name || "Anonim"}
                            </p>
                            {/* Tampilkan Badge Provinsi jika Guest (Sesuai SRS) */}
                            {review.guest_province && (
                              <span className="flex items-center gap-0.5 text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                                <MapPin size={8} /> {review.guest_province}
                              </span>
                            )}
                            {/* Tampilkan Badge User jika Registered */}
                            {review.user_name && (
                              <span className="text-[9px] bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded">
                                Member
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">{review.created_at}</span>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-[11px] text-slate-200 mt-1">"{review.comment}"</p>
                  </div>
                ))}
                
                {product.reviews.length === 0 && (
                  <div className="text-center text-slate-500 py-4 text-xs">Belum ada ulasan.</div>
                )}
              </div>
            </div>

            {/* Custom Scrollbar Track */}
            <div className="flex h-52 items-stretch">
              <div className="relative mx-auto h-full w-[4px] rounded-full bg-slate-900/60">
                <div
                  className="absolute left-0 right-0 rounded-full bg-[#ff7a1a]"
                  style={{ top: `${thumbTop}%`, height: `${thumbHeight}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

// ---------- PANEL UTAMA ----------

function ProductReviewsPanel() {
  const [ratingFilter, setRatingFilter] = useState<"all" | "good" | "bad">("all");
  const [period, setPeriod] = useState<"7" | "30" | "90">("7");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return MOCK_REVIEWS_DATA.filter((item) => {
      // Hapus pencarian SKU karena tidak ada di DB
      const matchName = item.name.toLowerCase().includes(search.toLowerCase());
      
      let matchRating = true;
      if (ratingFilter === "good") matchRating = item.avgRating >= 4;
      if (ratingFilter === "bad") matchRating = item.avgRating < 4;

      return matchName && matchRating;
    });
  }, [ratingFilter, search]);

  return (
    <section className="h-full w-full rounded-2xl border border-slate-800 bg-[#020617] px-6 py-5 shadow-[0_0_0_1px_rgba(15,23,42,0.8)]">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0b1220] px-3 py-1 text-xs text-slate-400">
            <MessageCircle className="h-3.5 w-3.5 text-[#ff7a1a]" />
            <span>Insight Review Produk</span>
          </div>
          <h2 className="mt-3 text-lg font-semibold text-slate-50">Ulasan & Rating Pembeli</h2>
          <p className="text-xs text-slate-400">
            Pantau feedback dari User Terdaftar maupun Pengunjung Tamu.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-1 rounded-full bg-[#020617] px-1 py-1 text-xs">
            <button
              onClick={() => setRatingFilter("all")}
              className={`rounded-full px-3 py-1 transition ${ratingFilter === "all" ? "bg-[#ff7a1a] text-black" : "text-slate-300 hover:bg-slate-800/70"}`}
            >
              Semua
            </button>
            <button
              onClick={() => setRatingFilter("good")}
              className={`rounded-full px-3 py-1 transition ${ratingFilter === "good" ? "bg-emerald-500 text-black" : "text-slate-300 hover:bg-slate-800/70"}`}
            >
              Rating ≥ 4
            </button>
            <button
              onClick={() => setRatingFilter("bad")}
              className={`rounded-full px-3 py-1 transition ${ratingFilter === "bad" ? "bg-rose-500 text-black" : "text-slate-300 hover:bg-slate-800/70"}`}
            >
              Perlu Perhatian
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="h-9 rounded-xl border border-slate-700 bg-[#020617] px-3 text-xs text-slate-300 outline-none focus:border-[#ff7a1a]"
            >
              <option value="7">7 hari terakhir</option>
              <option value="30">30 hari terakhir</option>
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-44 rounded-xl border border-slate-700 bg-[#020617] px-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-[#ff7a1a]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* List Review */}
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {filteredData.map((product) => (
          <ReviewCard
            key={product.id}
            product={product}
            expanded={expandedId === product.id}
            onExpand={() => setExpandedId(product.id)}
            onCollapse={() => setExpandedId((prev) => (prev === product.id ? null : prev))}
          />
        ))}

        {filteredData.length === 0 && (
          <div className="col-span-full rounded-xl border border-slate-800 bg-[#020617] px-4 py-6 text-center text-sm text-slate-400">
            Tidak ada ulasan produk yang cocok.
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- DEFAULT EXPORT HALAMAN ----------
export default function RetingPage() {
  return (
    <>
      <div className="min-h-screen bg-[#020617] p-6">
        <ProductReviewsPanel />
      </div>

      <style jsx global>{`
        .custom-scroll { scrollbar-width: none; }
        .custom-scroll::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>
    </>
  );
}