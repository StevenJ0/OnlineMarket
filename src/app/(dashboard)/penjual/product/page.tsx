"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CircleCheck,
  CircleX,
  FileText,
  Filter,
  Download,
  ArrowUpDown, // Icon untuk Sort
  ArrowUp,
  ArrowDown,
  Star,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ProductRow = {
  id: string;
  name: string;
  price: number;
  stock: number;
  rating: number;
  status: "active" | "inactive";
  categories: {
    id: string;
    name: string;
    slug: string | null;
    parent_id?: string | null;
  } | null;
};

export default function ProductPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [userSession, setUserSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [sortByRating, setSortByRating] = useState<"asc" | "desc" | null>(null);

  const getAllProducts = async (storeId: string) => {
    try {
      const res = await fetch("/api/penjual/product?storeId=" + storeId, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session", { method: "GET", credentials: "include" });
        const data = await res.json();
        setUserSession(data.user);
      } catch (err) {
        console.error("Gagal mengambil sesi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
    if (userSession?.id) {
      getAllProducts(userSession.id);
    }
  }, [userSession?.id]);

  // --- LOGIC FILTER & SORT ---
  const filteredProducts = useMemo(() => {
    let result = [...products]; // Copy array agar aman dimutasi sort

    // 1. Filter Query
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categories?.name.toLowerCase().includes(q)
      );
    }

    // 2. Filter Low Stock
    if (showLowStockOnly) {
      result = result.filter((p) => p.stock < 2);
    }

    // 3. Sort Rating
    if (sortByRating) {
      result.sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;

        if (sortByRating === "asc") {
          return ratingA - ratingB; // Rendah ke Tinggi
        } else {
          return ratingB - ratingA; // Tinggi ke Rendah
        }
      });
    }

    return result;
  }, [query, products, showLowStockOnly, sortByRating]);

  const handleAddProduct = () => router.push("/penjual/product/add");
  const handleEdit = (product: ProductRow) =>
    router.push(`/penjual/product/edit/${product.id}`);

  const handleDelete = (product: ProductRow) => {
    if (confirm(`Hapus produk "${product.name}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  };

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "inactive" : "active" }
          : p
      )
    );
  };

  const getStockBadgeColor = (stock: number) => {
    if (stock < 2) return "bg-red-500/15 text-red-400";
    if (stock < 5) return "bg-yellow-500/15 text-yellow-400";
    return "bg-green-500/15 text-green-400";
  };

  // --- FUNGSI GENERATE PDF (SRS 12, 13 & 14) ---
  const generateReport = (type: "STOCK_DESC" | "LOW_STOCK" | "RATING_DESC") => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString("id-ID");

    let reportTitle = "";
    let finalData: ProductRow[] = [...products];

    // SRS-12: Stock Descending
    if (type === "STOCK_DESC") {
      reportTitle = "Laporan Stok Produk (Urut Tertinggi)";
      finalData.sort((a, b) => b.stock - a.stock);
    }
    // SRS-14: Low Stock
    else if (type === "LOW_STOCK") {
      reportTitle = "Laporan Produk Segera Pesan (Stok < 2)";
      finalData = finalData.filter((p) => p.stock < 2);
    }
    // SRS-13: Rating Descending
    else if (type === "RATING_DESC") {
      reportTitle = "Laporan Rating Produk (Urut Tertinggi)";
      // Sort Rating Descending
      finalData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    // Header PDF
    doc.setFontSize(18);
    doc.text(reportTitle, 14, 22);
    doc.setFontSize(11);
    doc.text(`Tanggal: ${date}`, 14, 30);
    doc.text(`Total Item: ${finalData.length}`, 14, 36);

    // Tabel Data
    const tableColumn = ["No", "Nama Produk", "Kategori", "Harga (Rp)", "Stok", "Rating"];
    const tableRows: any[] = [];

    finalData.forEach((product, index) => {
      const productData = [
        index + 1,
        product.name,
        product.categories?.name || "-",
        product.price.toLocaleString("id-ID"),
        product.stock,
        product.rating || "0.0",
      ];
      tableRows.push(productData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 44,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [255, 122, 26] },
    });

    let fileName = "Laporan.pdf";
    if (type === "STOCK_DESC") fileName = "Laporan_Stok.pdf";
    if (type === "LOW_STOCK") fileName = "Laporan_Restock.pdf";
    if (type === "RATING_DESC") fileName = "Laporan_Rating.pdf";

    doc.save(fileName);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="w-full sm:max-w-md relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="w-full rounded-xl bg-[#050815] border border-slate-800 px-9 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]/70"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* 1. Tombol Filter Low Stock */}
          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
              showLowStockOnly
                ? "bg-red-500/10 border-red-500 text-red-400"
                : "bg-[#050815] border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Filter className="w-4 h-4" />
            {showLowStockOnly ? "Tampilkan Semua" : "Stok < 2"}
          </button>

          {/* 2. Tombol Sort Rating (Dropdown) */}
          <div className="relative group">
            <button className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                 sortByRating ? "border-[#ff7a1a] text-[#ff7a1a]" : "bg-[#050815] border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}>
              {sortByRating === "asc" ? <ArrowUp className="w-4 h-4" /> : sortByRating === "desc" ? <ArrowDown className="w-4 h-4" /> : <ArrowUpDown className="w-4 h-4" />}
              {sortByRating === "asc" ? "Rating Rendah" : sortByRating === "desc" ? "Rating Tinggi" : "Urutkan Rating"}
            </button>
             {/* Dropdown Menu Sort */}
             <div className="absolute right-0 mt-2 w-48 bg-[#111418] border border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 overflow-hidden">
                <button 
                    onClick={() => setSortByRating("desc")}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-xs hover:bg-slate-800 border-b border-slate-800/50 ${sortByRating === 'desc' ? 'text-[#ff7a1a]' : 'text-slate-300'}`}
                >
                    <ArrowDown className="w-3.5 h-3.5" />
                    Tertinggi ke Terendah
                </button>
                <button 
                    onClick={() => setSortByRating("asc")}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-xs hover:bg-slate-800 border-b border-slate-800/50 ${sortByRating === 'asc' ? 'text-[#ff7a1a]' : 'text-slate-300'}`}
                >
                    <ArrowUp className="w-3.5 h-3.5" />
                    Terendah ke Tertinggi
                </button>
                <button 
                    onClick={() => setSortByRating(null)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-xs text-slate-400 hover:bg-slate-800"
                >
                    <CircleX className="w-3.5 h-3.5" />
                    Reset Urutan
                </button>
             </div>
          </div>


          {/* 3. Tombol Download PDF */}
          <div className="relative group">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#050815] border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800">
              <FileText className="w-4 h-4" /> Laporan PDF
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-[#111418] border border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 overflow-hidden">
              <button
                onClick={() => generateReport("STOCK_DESC")}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-xs text-slate-300 hover:bg-slate-800 border-b border-slate-800/50"
              >
                <Download className="w-3.5 h-3.5 text-green-400" />
                <div>
                  <span className="block font-semibold">Laporan Stok (SRS-12)</span>
                  <span className="text-slate-500 text-[10px]">
                    Urut stok terbanyak & rating
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => generateReport("RATING_DESC")}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-xs text-slate-300 hover:bg-slate-800 border-b border-slate-800/50"
              >
                <Star className="w-3.5 h-3.5 text-yellow-400" />
                <div>
                  <span className="block font-semibold">Laporan Rating (SRS-13)</span>
                  <span className="text-slate-500 text-[10px]">
                    Urut rating tertinggi
                  </span>
                </div>
              </button>

              <button
                onClick={() => generateReport("LOW_STOCK")}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-xs text-slate-300 hover:bg-slate-800"
              >
                <Download className="w-3.5 h-3.5 text-red-400" />
                <div>
                  <span className="block font-semibold">Laporan Restock (SRS-14)</span>
                  <span className="text-slate-500 text-[10px]">
                    Stok kritis {"(< 2)"}
                  </span>
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={handleAddProduct}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff7a1a] to-[#ff9c3b] px-4 py-2.5 text-sm font-semibold text-black shadow-lg shadow-[#ff7a1a]/40 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#050815] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-[1.5fr,0.9fr,0.6fr,0.8fr,0.6fr,0.6fr] px-4 sm:px-6 py-3 border-b border-slate-800 text-[11px] font-semibold tracking-wide uppercase text-slate-500">
          <div>Produk</div>
          <div>Harga</div>
          <div>Stok</div>
          <div>Kategori</div>
          <div>Status</div>
          <div className="text-right">Aksi</div>
        </div>

        <div className="divide-y divide-slate-800 max-h-[520px] overflow-y-auto custom-scrollbar">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-[1.5fr,0.9fr,0.6fr,0.8fr,0.6fr,0.6fr] px-4 sm:px-6 py-3.5 items-center hover:bg-slate-900/40"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-100 shrink-0">
                  {product.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-100 truncate">
                    {product.name}
                  </p>
                  <p className="text-[10px] text-yellow-500 flex items-center gap-1">
                    ★ {product.rating || "0.0"}
                  </p>
                </div>
              </div>

              <div className="text-sm font-semibold text-[#ff7a1a]">
                Rp {product.price.toLocaleString("id-ID")}
              </div>

              <div>
                <span
                  className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-medium ${getStockBadgeColor(
                    product.stock
                  )}`}
                >
                  {product.stock} unit
                </span>
              </div>

              <div className="text-sm text-slate-300">
                {product.categories?.name}
              </div>

              <div>
                <button
                  onClick={() => toggleStatus(product.id)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    product.status === "active"
                      ? "bg-green-500/15 text-green-400"
                      : "bg-red-500/15 text-red-400"
                  } hover:opacity-80`}
                >
                  {product.status === "active" ? (
                    <CircleCheck className="w-3 h-3" />
                  ) : (
                    <CircleX className="w-3 h-3" />
                  )}
                  {product.status === "active" ? "Active" : "Inactive"}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-1.5 text-slate-300 hover:text-blue-400 bg-slate-900/40 rounded-full border border-slate-700/50"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  className="p-1.5 text-slate-300 hover:text-red-400 bg-slate-900/40 rounded-full border border-slate-700/50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              {showLowStockOnly
                ? "Tidak ada produk dengan stok menipis."
                : "Produk tidak ditemukan."}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff7a1a;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #050815;
        }
      `}</style>
    </div>
  );
}