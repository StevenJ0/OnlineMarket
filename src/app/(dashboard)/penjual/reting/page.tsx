"use client";

import { useMemo, useState, useCallback } from "react";
import {
  Star,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

type Sentiment = "positive" | "neutral" | "negative";

type Review = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type ProductReviewSummary = {
  id: string;
  name: string;
  sku: string;
  imageUrl: string;
  avgRating: number;
  totalReviews: number;
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
  trend: "up" | "down" | "flat";
  reviews: Review[];
};

const MOCK_REVIEWS: ProductReviewSummary[] = [
  {
    id: "1",
    name: "Kopi Arabica 250gr",
    sku: "KOPI-AR-250",
    imageUrl:
      "https://images.pexels.com/photos/2968881/pexels-photo-2968881.jpeg?auto=compress&cs=tinysrgb&w=400",
    avgRating: 4.8,
    totalReviews: 3,
    positivePercent: 90,
    neutralPercent: 7,
    negativePercent: 3,
    trend: "up",
    reviews: [
      {
        id: "r1",
        customerName: "Budi Santoso",
        rating: 5,
        comment:
          "Rasanya enak banget, aromanya kuat dan pengiriman super cepat.",
        createdAt: "2 jam lalu",
      },
      {
        id: "r2",
        customerName: "Dewi Lestari",
        rating: 5,
        comment: "Packing rapi, bijinya fresh, pasti repeat order lagi.",
        createdAt: "Kemarin",
      },
      {
        id: "r3",
        customerName: "Andi Wijaya",
        rating: 4,
        comment:
          "Overall mantap, cuma sedikit pahit di akhir tapi masih oke.",
        createdAt: "3 hari lalu",
      },
    ],
  },
  {
    id: "2",
    name: "Teh Hijau Premium",
    sku: "TEH-HIJAU",
    imageUrl:
      "https://images.pexels.com/photos/373888/pexels-photo-373888.jpeg?auto=compress&cs=tinysrgb&w=400",
    avgRating: 4.2,
    totalReviews: 2,
    positivePercent: 70,
    neutralPercent: 20,
    negativePercent: 10,
    trend: "flat",
    reviews: [
      {
        id: "r1",
        customerName: "Sri Aminah",
        rating: 4,
        comment: "Tehnya wangi dan segar, cocok diminum malam hari.",
        createdAt: "Kemarin",
      },
      {
        id: "r2",
        customerName: "Rahmat Hidayat",
        rating: 5,
        comment: "Rasanya lembut, tidak terlalu pahit, favorit keluarga.",
        createdAt: "4 hari lalu",
      },
    ],
  },
  {
    id: "3",
    name: "Gula Aren Cair 500ml",
    sku: "GULA-AREN-500",
    imageUrl:
      "https://images.pexels.com/photos/3735196/pexels-photo-3735196.jpeg?auto=compress&cs=tinysrgb&w=400",
    avgRating: 3.6,
    totalReviews: 1,
    positivePercent: 55,
    neutralPercent: 25,
    negativePercent: 20,
    trend: "down",
    reviews: [
      {
        id: "r1",
        customerName: "Yuni Rahma",
        rating: 3,
        comment:
          "Rasanya oke, tapi tutup botol agak susah dibuka dan suka bocor.",
        createdAt: "3 hari lalu",
      },
    ],
  },
  {
    id: "4",
    name: "Susu Oat Barista 1L",
    sku: "SUSU-OAT-1L",
    imageUrl:
      "https://images.pexels.com/photos/5931265/pexels-photo-5931265.jpeg?auto=compress&cs=tinysrgb&w=400",
    avgRating: 4.9,
    totalReviews: 4,
    positivePercent: 92,
    neutralPercent: 5,
    negativePercent: 3,
    trend: "up",
    reviews: [
      {
        id: "r1",
        customerName: "Nadia Putri",
        rating: 5,
        comment: "Creamy banget, cocok untuk latte art di kedai kopi saya.",
        createdAt: "1 jam lalu",
      },
      {
        id: "r2",
        customerName: "Arya Nugraha",
        rating: 5,
        comment: "Rasa seimbang, tidak terlalu manis, pelanggan suka.",
        createdAt: "Kemarin",
      },
      {
        id: "r3",
        customerName: "Lina Marlina",
        rating: 4,
        comment: "Enak, cuma kadang agak susah ditemui stoknya.",
        createdAt: "5 hari lalu",
      },
      {
        id: "r4",
        customerName: "Yoga Pratama",
        rating: 5,
        comment: "Alternatif susu sapi terbaik untuk kopi menurut saya.",
        createdAt: "1 minggu lalu",
      },
    ],
  },
];

// ---------- KOMPOSISI UI KECIL ----------

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
    ) : null;

  const trendLabel =
    product.trend === "up"
      ? "Rating naik"
      : product.trend === "down"
      ? "Rating turun"
      : "Stabil";

  const placeholdersCount = Math.max(0, 5 - product.reviews.length);

  // state untuk thumb scrollbar custom
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(100);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const { scrollTop, scrollHeight, clientHeight } = el;

      if (scrollHeight <= clientHeight) {
        setThumbTop(0);
        setThumbHeight(100);
        return;
      }

      const ratio = clientHeight / scrollHeight;
      const h = Math.max(ratio * 100, 20); // min 20%
      const maxTop = 100 - h;
      const top = (scrollTop / (scrollHeight - clientHeight)) * maxTop;

      setThumbHeight(h);
      setThumbTop(top);
    },
    [setThumbTop, setThumbHeight]
  );

  return (
    <article
      className="group flex flex-col gap-3 rounded-xl border border-slate-800 bg-gradient-to-br from-[#020617] via-[#020617] to-[#0b1220] p-4 shadow-md shadow-black/40 transition hover:-translate-y-[1px] hover:border-[#ff7a1a] hover:shadow-[0_0_40px_rgba(248,115,22,0.35)]"
      onMouseLeave={onCollapse}
    >
      {/* HEADER PRODUK - klik untuk toggle */}
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
            <h3 className="text-sm font-semibold text-slate-50">
              {product.name}
            </h3>
            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              SKU: {product.sku}
            </p>

            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
              <StarRating rating={product.avgRating} />
              <span className="font-semibold text-slate-50">
                {product.avgRating.toFixed(1)}
              </span>
              <span>({product.totalReviews} ulasan)</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="inline-flex items-center gap-1 rounded-full bg-[#020617] px-2.5 py-1 text-[11px]">
              {trendIcon}
              <span className="text-slate-300">{trendLabel}</span>
            </div>
            <div className="flex flex-wrap gap-1 text-[10px]">
              <span
                className={`rounded-full px-2 py-0.5 ${sentimentColor(
                  "positive"
                )}`}
              >
                Positif {product.positivePercent}%
              </span>
              <span
                className={`rounded-full px-2 py-0.5 ${sentimentColor(
                  "neutral"
                )}`}
              >
                Netral {product.neutralPercent}%
              </span>
              <span
                className={`rounded-full px-2 py-0.5 ${sentimentColor(
                  "negative"
                )}`}
              >
                Negatif {product.negativePercent}%
              </span>
            </div>
          </div>
        </div>

        <div className="ml-2 mt-1 flex items-center">
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition ${
              expanded ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </button>

      {/* INFO KECIL */}
      {!expanded && (
        <p className="mt-1 text-[11px] text-slate-500">
          Klik card ini untuk melihat detail komentar pelanggan.
        </p>
      )}

      {/* LIST REVIEW - hanya muncul kalau expanded */}
      {expanded && (
        <div className="mt-1 rounded-lg border border-slate-800/70 bg-[#020617] p-3">
          <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Review terbaru (maks. 5 per produk)</span>
            <span className="text-[10px]">
              Menampilkan {product.reviews.length} dari 5 slot
            </span>
          </div>

          {/* wrapper grid: kolom komentar + kolom scrollbar custom */}
          <div className="grid grid-cols-[minmax(0,1fr)_8px] gap-2">
            {/* area scroll komentar */}
            <div
              className="custom-scroll max-h-52 overflow-y-auto pr-2"
              onScroll={handleScroll}
            >
              <div className="space-y-2">
                {/* review nyata */}
                {product.reviews.slice(0, 5).map((review) => (
                  <div
                    key={review.id}
                    className="rounded-md border border-slate-800 bg-[#020617] px-2.5 py-2 text-xs"
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-100">
                          {review.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[11px] font-medium text-slate-100">
                            {review.customerName}
                          </p>
                          <span className="text-[10px] text-slate-500">
                            {review.createdAt}
                          </span>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-[11px] text-slate-200">
                      {review.comment}
                    </p>
                  </div>
                ))}

                {/* placeholder sampai 5 slot */}
                {Array.from({ length: placeholdersCount }).map((_, i) => (
                  <div
                    key={`placeholder-${i}`}
                    className="rounded-md border border-dashed border-slate-800 bg-[#020617] px-2.5 py-2 text-[11px] text-slate-500"
                  >
                    Slot review kosong — belum ada ulasan tambahan untuk produk
                    ini.
                  </div>
                ))}
              </div>
            </div>

            {/* scrollbar custom ala stok hampir habis */}
            <div className="flex h-52 items-stretch">
              <div className="relative mx-auto h-full w-[4px] rounded-full bg-slate-900/60">
                <div
                  className="absolute left-0 right-0 rounded-full bg-[#ff7a1a]"
                  style={{
                    top: `${thumbTop}%`,
                    height: `${thumbHeight}%`,
                  }}
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
  const [ratingFilter, setRatingFilter] = useState<"all" | "good" | "bad">(
    "all"
  );
  const [period, setPeriod] = useState<"7" | "30" | "90">("7");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return MOCK_REVIEWS.filter((item) => {
      const matchName =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());

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
          <h2 className="mt-3 text-lg font-semibold text-slate-50">
            Hasil Review Produk
          </h2>
          <p className="text-xs text-slate-400">
            Klik salah satu produk untuk melihat detail komentar pelanggan.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-1 rounded-full bg-[#020617] px-1 py-1 text-xs">
            <button
              onClick={() => setRatingFilter("all")}
              className={`rounded-full px-3 py-1 transition ${
                ratingFilter === "all"
                  ? "bg-[#ff7a1a] text-black"
                  : "text-slate-300 hover:bg-slate-800/70"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setRatingFilter("good")}
              className={`rounded-full px-3 py-1 transition ${
                ratingFilter === "good"
                  ? "bg-emerald-500 text-black"
                  : "text-slate-300 hover:bg-slate-800/70"
              }`}
            >
              Rating ≥ 4
            </button>
            <button
              onClick={() => setRatingFilter("bad")}
              className={`rounded-full px-3 py-1 transition ${
                ratingFilter === "bad"
                  ? "bg-rose-500 text-black"
                  : "text-slate-300 hover:bg-slate-800/70"
              }`}
            >
              Perlu perhatian
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
              <option value="90">90 hari terakhir</option>
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk / SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-44 rounded-xl border border-slate-700 bg-[#020617] pl-3 pr-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-[#ff7a1a]"
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
            onCollapse={() =>
              setExpandedId((prev) => (prev === product.id ? null : prev))
            }
          />
        ))}

        {filteredData.length === 0 && (
          <div className="col-span-full rounded-xl border border-slate-800 bg-[#020617] px-4 py-6 text-center text-sm text-slate-400">
            Tidak ada produk yang cocok dengan filter.
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

      {/* Global style untuk menyembunyikan native scrollbar di area komentar */}
      <style jsx global>{`
        .custom-scroll {
          scrollbar-width: none; /* Firefox */
        }
        .custom-scroll::-webkit-scrollbar {
          width: 0;
          height: 0; /* Chrome, Edge, Safari */
        }
      `}</style>
    </>
  );
}
