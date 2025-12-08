"use client";

import React, { useMemo, useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Tooltip, Legend,
} from "chart.js";
import {
  BarChart3, Boxes, TrendingDown, MapPin, PieChart,
  LineChart as LineChartIcon, FileDown, AlertTriangle, Loader2
} from "lucide-react";

// Registrasi ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

// --- TIPE DATA FRONTEND ---
type ProductStock = {
  id: string;
  name: string;
  stock: number;
  price: number;
  category_name: string;
  rating: number;
  status: "active" | "inactive";
  items_sold: number;
};

type DailySales = {
  date: string;
  items_sold: number;
  revenue: number;
};

type RegionSales = {
  region: string;
  totalOrders: number;
  totalRevenue: number;
  topProduct: string;
};

export default function ReportPage() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  
  // STATE DATA
  const [stockData, setStockData] = useState<ProductStock[]>([]);
  const [dailySales, setDailySales] = useState<DailySales[]>([]);
  const [regionSales, setRegionSales] = useState<RegionSales[]>([]);

  // 1. FETCH API (Load Data Real)
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch('/api/penjual/report'); // Memanggil API kita
        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message || "Gagal memuat data");
        }

        const { data } = json;
        setStockData(data.stockData || []);
        setDailySales(data.dailySalesData || []);
        setRegionSales(data.regionSalesData || []);

      } catch (err: any) {
        console.error("Error:", err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- 2. AGREGASI DATA UNTUK KARTU ---
  const totalProducts = stockData.length;
  const totalActive = stockData.filter((p) => p.status === "active").length;
  const totalInactive = stockData.filter((p) => p.status === "inactive").length;
  const totalStock = stockData.reduce((sum, p) => sum + p.stock, 0);
  const totalRevenue7Days = dailySales.reduce((sum, d) => sum + d.revenue, 0); // Total Revenue dari data harian yang diambil

  // Sorting
  const sortedByStock = useMemo(() => [...stockData].sort((a, b) => b.stock - a.stock), [stockData]);
  
  // Top Produk berdasarkan PENJUALAN (items_sold) yang dihitung di service
  const sortedTopProducts = useMemo(() => [...stockData].sort((a, b) => b.items_sold - a.items_sold).slice(0, 5), [stockData]);

  // Filter Region
  const filteredRegionData = useMemo(() => 
    selectedRegion === "ALL" ? regionSales : regionSales.filter((r) => r.region === selectedRegion),
  [selectedRegion, regionSales]);

  // --- 3. FUNGSI PDF (SRS 12, 13, 14) ---
  const formatRupiah = (val: number) => "Rp " + val.toLocaleString("id-ID");

  const generateReportStockByStock = () => {
    const doc = new jsPDF();
    doc.text("Laporan Stok Produk (Urut Stok)", 14, 20);
    const data = [...stockData].sort((a, b) => b.stock - a.stock);
    const tableBody = data.map((item) => [item.name, item.stock, item.rating, item.category_name, formatRupiah(item.price)]);
    autoTable(doc, { head: [["Nama", "Stok", "Rating", "Kategori", "Harga"]], body: tableBody, startY: 30 });
    doc.save("Laporan_Stok_By_Stok.pdf");
  };

  const generateReportStockByRating = () => {
    const doc = new jsPDF();
    doc.text("Laporan Stok Produk (Urut Rating)", 14, 20);
    const data = [...stockData].sort((a, b) => b.rating - a.rating);
    const tableBody = data.map((item) => [item.name, item.rating, item.stock, item.category_name, formatRupiah(item.price)]);
    autoTable(doc, { head: [["Nama", "Rating", "Stok", "Kategori", "Harga"]], body: tableBody, startY: 30 });
    doc.save("Laporan_Stok_By_Rating.pdf");
  };

  const generateReportLowStock = () => {
    const doc = new jsPDF();
    doc.setTextColor(220, 38, 38); doc.text("Laporan Produk Kritis (Restock < 2)", 14, 20);
    const data = stockData.filter((p) => p.stock < 2);
    const tableBody = data.map((item) => [item.name, item.stock, item.category_name, formatRupiah(item.price)]);
    autoTable(doc, { head: [["Nama", "Sisa Stok", "Kategori", "Harga"]], body: tableBody, startY: 30 });
    doc.save("Laporan_Perlu_Restock.pdf");
  };

  // --- 4. CONFIG CHART.JS ---
  
  // A. Tren Penjualan Harian
  const dailySalesChartData = useMemo(() => ({
    labels: dailySales.map((d) => d.date),
    datasets: [{
      label: "Pendapatan",
      data: dailySales.map((d) => d.revenue),
      borderColor: "#ff7a1a",
      backgroundColor: "rgba(255, 122, 26, 0.12)",
      borderWidth: 2,
      pointRadius: 4,
      tension: 0.35,
    }],
  }), [dailySales]);

  // B. Top Produk Terlaris (Berdasarkan items_sold)
  const topProductChartData = useMemo(() => ({
    labels: sortedTopProducts.map((p) => p.name),
    datasets: [{
      label: "Unit Terjual",
      data: sortedTopProducts.map((p) => p.items_sold),
      backgroundColor: "#22c55e",
      borderRadius: 6,
    }],
  }), [sortedTopProducts]);

  // C. Stok Produk
  const stockChartData = useMemo(() => ({
    labels: sortedByStock.slice(0, 10).map((p) => p.name), // Limit 10 produk agar grafik rapi
    datasets: [{
      label: "Jumlah Stok",
      data: sortedByStock.slice(0, 10).map((p) => p.stock),
      backgroundColor: sortedByStock.slice(0, 10).map((p) => p.stock < 2 ? "#ef4444" : p.stock < 5 ? "#f59e0b" : "#10b981"),
      borderRadius: 6,
    }],
  }), [sortedByStock]);

  // D. Region Sales
  const regionChartData = useMemo(() => ({
    labels: filteredRegionData.map((r) => r.region),
    datasets: [{
      label: "Order",
      data: filteredRegionData.map((r) => r.totalOrders),
      backgroundColor: "#38bdf8",
      borderRadius: 6,
    }],
  }), [filteredRegionData]);

  // Helper UI
  const getStockBadge = (stock: number) => {
    if (stock < 2) return "bg-red-500/15 text-red-400";
    if (stock < 5) return "bg-yellow-500/15 text-yellow-400";
    return "bg-green-500/15 text-green-400";
  };

  const getStatusBadge = (status: "active" | "inactive") =>
    status === "active" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400";

  // --- RENDER ---

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#050815] text-slate-400">
      <Loader2 className="animate-spin mr-2 text-[#ff7a1a]" /> Memuat laporan...
    </div>
  );

  if (errorMsg) return (
    <div className="flex h-screen items-center justify-center bg-[#050815] text-red-400 p-4 text-center">
      <AlertTriangle className="mx-auto mb-2 h-8 w-8" />
      <p>{errorMsg}</p>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* HEADER */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-[#ff7a1a] rounded-full" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Laporan Penjualan & Stok</h1>
            <p className="text-slate-400 text-sm mt-1">Ringkasan performa toko, penjualan, dan stok.</p>
          </div>
        </div>
      </div>

      {/* BUTTON DOWNLOAD SRS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button onClick={generateReportStockByStock} className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-700 bg-[#111418] hover:border-[#ff7a1a] transition-colors text-sm text-slate-300 hover:text-white">
          <FileDown className="w-4 h-4 text-[#ff7a1a]" /> 
          <div className="text-left"><span className="block font-semibold">Laporan Stok</span><span className="text-[10px] text-slate-500">Urut Stok</span></div>
        </button>
        <button onClick={generateReportStockByRating} className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-700 bg-[#111418] hover:border-[#ff7a1a] transition-colors text-sm text-slate-300 hover:text-white">
          <FileDown className="w-4 h-4 text-green-400" />
          <div className="text-left"><span className="block font-semibold">Laporan Rating</span><span className="text-[10px] text-slate-500">Urut Rating</span></div>
        </button>
        <button onClick={generateReportLowStock} className="flex items-center justify-center gap-2 p-3 rounded-xl border border-red-900/50 bg-red-900/10 hover:border-red-500 transition-colors text-sm text-red-400">
          <AlertTriangle className="w-4 h-4" />
          <div className="text-left"><span className="block font-semibold">Perlu Restock</span><span className="text-[10px] text-red-300/60">Stok &lt; 2 Unit</span></div>
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 shadow-md">
          <div className="flex items-center justify-between"><p className="text-xs text-slate-400 flex items-center gap-2"><Boxes className="w-4 h-4 text-slate-500" /> Total Produk</p></div>
          <p className="text-2xl font-bold text-white">{totalProducts}</p>
          <p className="text-[11px] text-slate-500">{totalActive} aktif • {totalInactive} tidak aktif</p>
        </div>

        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 shadow-md">
          <p className="text-xs text-slate-400 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-slate-500" /> Total Stok</p>
          <p className="text-2xl font-bold text-white">{totalStock} unit</p>
          <p className="text-[11px] text-slate-500">Seluruh gudang</p>
        </div>

        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 shadow-md">
          <p className="text-xs text-slate-400 flex items-center gap-2"><LineChartIcon className="w-4 h-4 text-slate-500" /> Pendapatan (7 Hari)</p>
          <p className="text-2xl font-bold text-[#ff7a1a]">Rp {totalRevenue7Days.toLocaleString("id-ID")}</p>
        </div>

        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 shadow-md">
          <p className="text-xs text-slate-400 flex items-center gap-2"><PieChart className="w-4 h-4 text-slate-500" /> Sebaran Pembeli</p>
          <p className="text-2xl font-bold text-white">{regionSales.length} provinsi</p>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr,1.2fr] gap-6">
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-[#ff7a1a]/15 text-[#ff7a1a]"><LineChartIcon className="w-5 h-5" /></div>
            <div><h2 className="text-lg font-semibold text-white">Tren Penjualan (Harian)</h2><p className="text-xs text-slate-400">Total pendapatan per hari.</p></div>
          </div>
          {dailySales.length > 0 ? <Line data={dailySalesChartData} options={{ responsive: true, scales: { x: { grid: { color: 'rgba(255,255,255,0.04)' } }, y: { grid: { color: 'rgba(255,255,255,0.04)' } } } }} /> : <p className="text-center text-sm text-slate-500 py-10">Belum ada transaksi minggu ini.</p>}
        </div>

        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400"><BarChart3 className="w-5 h-5" /></div>
            <div><h2 className="text-lg font-semibold text-white">Top Produk Terlaris</h2><p className="text-xs text-slate-400">Berdasarkan unit terjual.</p></div>
          </div>
          <Bar data={topProductChartData} options={{ indexAxis: "y", responsive: true }} />
        </div>
      </div>

      {/* TABLE & REGION ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr,1.2fr] gap-6">
        <div className="bg-[#111418] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-[#ff7a1a]" />
            <h2 className="text-lg font-semibold text-white">Laporan Daftar Stok Produk</h2>
          </div>
          
          <div className="grid grid-cols-[1.6fr,0.7fr,0.7fr,0.7fr] px-6 py-3 text-xs font-semibold text-slate-500 uppercase border-b border-slate-800">
            <span>Produk</span><span>Stok</span><span>Kategori</span><span>Status</span>
          </div>

          <div className="max-h-[260px] overflow-y-auto custom-scrollbar">
            {sortedByStock.map((p) => (
              <div key={p.id} className="grid grid-cols-[1.6fr,0.7fr,0.7fr,0.7fr] px-6 py-3 items-center hover:bg-slate-900/40 border-b border-slate-800/30">
                <div>
                  <p className="text-sm text-white">{p.name}</p>
                  <p className="text-[10px] text-slate-500 flex gap-1">Price: {formatRupiah(p.price)}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] w-fit ${getStockBadge(p.stock)}`}>{p.stock} unit</span>
                <p className="text-sm text-slate-300">{p.category_name}</p>
                <span className={`px-2 py-1 rounded-full text-[10px] w-fit ${getStatusBadge(p.status)}`}>{p.status === "active" ? "Active" : "Inactive"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-400"><MapPin className="w-5 h-5" /></div>
              <h2 className="text-lg font-semibold text-white">Laporan Wilayah</h2>
            </div>
            <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="bg-[#050815] border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none">
              <option value="ALL">Semua Daerah</option>
              {regionSales.map((r) => <option key={r.region} value={r.region}>{r.region}</option>)}
            </select>
          </div>
          
          <div className="h-48">
             {regionSales.length > 0 ? (
               <Bar data={regionChartData} options={{ responsive: true, maintainAspectRatio: false }} />
             ) : <p className="text-slate-500 text-sm h-full flex items-center justify-center">Belum ada data wilayah</p>}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ff7a1a; border-radius: 9999px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #050815; }
      `}</style>
    </div>
  );
}