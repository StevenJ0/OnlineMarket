"use client";

import { useEffect, useState } from "react";
import {
  Download,
  Search,
  Loader2,
  Star,
  ShoppingBag,
  Store,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminProductsView = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Helpers ---

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return parseFloat((total / reviews.length).toFixed(1));
  };

  // --- Fetch Data ---

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      const json = await res.json();

      if (json.success) {
        const processedData = json.data.map((item: any) => ({
          ...item,
          avgRating: calculateRating(item.product_reviews),
        }));

        const sortedData = processedData.sort(
          (a: any, b: any) => b.avgRating - a.avgRating
        );

        setProducts(sortedData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Auth Check ---

  useEffect(() => {
    const fecthSessionAndChecckRole = async () => {
      try {
        const res = await fetch("/api/auth/session", { credentials: "include" });
        const data = await res.json();
        if (!data.loggedIn) {
          window.location.href = "/login";
          return;
        }

        console.log(data.user.email);

        // Security Note: Idealnya validasi role dilakukan di Middleware / Server Side juga
        if (data.user.email !== "stevenjonathanalfredo785@gmail.com") {
          window.location.href = "/";
        }
        console.log("Session data:", data);
      } catch (err) {
        console.error("Gagal mengambil sesi:", err);
      }
    };

    fecthSessionAndChecckRole();
    getProducts();
  }, []);

  // --- Filter Logic ---

  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sellers?.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- PDF Generation ---

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("LAPORAN DAFTAR PRODUK & RATING", 14, 20);
    doc.setFontSize(10);
    doc.text("Diurutkan berdasarkan Rating (Tertinggi ke Terendah)", 14, 26);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleString("id-ID")}`, 14, 32);

    const tableColumn = [
      "No",
      "Nama Produk",
      "Kategori",
      "Toko",
      "Provinsi",
      "Harga",
      "Rating",
    ];
    const tableRows: any[] = [];

    filteredProducts.forEach((item: any, index: number) => {
      const rowData = [
        index + 1,
        item.name,
        item.categories?.name || "-",
        item.sellers?.store_name || "-",
        item.sellers?.provinces?.name || "-",
        formatRupiah(item.price),
        item.avgRating > 0 ? `${item.avgRating} / 5` : "Belum ada rating",
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [249, 115, 22] }, // Orange color
      columnStyles: {
        6: { fontStyle: "bold", halign: "center" },
      },
    });

    doc.save("Laporan_Produk_Rating.pdf");
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Laporan Produk
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Monitoring rating dan sebaran produk per wilayah.
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all text-sm font-medium hover:border-orange-500/50"
        >
          <Download size={18} />
          <span>Download Laporan PDF</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 mb-6 backdrop-blur-md">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari produk, toko, atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={40} className="animate-spin text-orange-500 mb-4" />
            <p>Mengambil data produk & menghitung rating...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p>Tidak ada data produk ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-xs font-semibold">
                <tr>
                  <th className="p-4 pl-6">Produk</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Toko & Lokasi</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredProducts.map((item) => {
                  // LOGIC IMAGE: Cari yg primary, kalau tidak ada ambil index 0
                  const displayImage =
                    item.product_images?.find((img: any) => img.is_primary)
                      ?.image_url || item.product_images?.[0]?.image_url;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/50 transition-colors group"
                    >
                      {/* Produk Column */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-4">
                          {/* Image Wrapper */}
                          <div className="w-16 h-16 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 shadow-sm relative group-hover:border-slate-600 transition-colors">
                            {displayImage ? (
                              <img
                                src={displayImage}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <ShoppingBag
                                size={20}
                                className="text-slate-600"
                              />
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex flex-col gap-1">
                            <p className="font-bold text-white line-clamp-2 leading-tight w-48 group-hover:text-orange-400 transition-colors">
                              {item.name}
                            </p>
                            <p className="text-[10px] font-mono text-slate-500 bg-slate-950/50 px-1.5 py-0.5 rounded w-fit border border-slate-800">
                              ID: {item.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                          {item.categories?.name || "Uncategorized"}
                        </span>
                      </td>

                      {/* Toko & Lokasi */}
                      <td className="p-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 text-white font-medium text-xs mb-0.5">
                            <Store size={12} className="text-orange-500" />
                            <span>{item.sellers?.store_name}</span>
                          </div>
                          <p className="text-slate-500 text-xs">
                            {item.sellers?.provinces?.name ||
                              "Lokasi Tidak Diketahui"}
                          </p>
                        </div>
                      </td>

                      {/* Harga */}
                      <td className="p-4 font-mono text-slate-300">
                        {formatRupiah(item.price)}
                      </td>

                      {/* Rating */}
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="flex items-center gap-1">
                            <Star
                              size={14}
                              className={`fill-current ${
                                item.avgRating > 0
                                  ? "text-yellow-500"
                                  : "text-slate-700"
                              }`}
                            />
                            <span
                              className={`font-bold ${
                                item.avgRating > 0
                                  ? "text-white"
                                  : "text-slate-600"
                              }`}
                            >
                              {item.avgRating > 0 ? item.avgRating : "-"}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-600 mt-1">
                            {item.product_reviews?.length || 0} Ulasan
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <div className="bg-slate-950/50 p-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center">
            <span>
              Menampilkan {filteredProducts.length} produk diurutkan berdasarkan
              rating tertinggi.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsView;