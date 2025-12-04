"use client";

import React, { useMemo, useState } from "react";
// Pastikan library ini sudah diinstall: npm install chart.js react-chartjs-2
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  BarChart3,
  Boxes,
  TrendingDown,
  MapPin,
  PieChart,
  LineChart as LineChartIcon,
  FileDown,
  AlertTriangle
} from "lucide-react";

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// --- TIPE DATA (Disesuaikan dengan Database) ---

// Representasi tabel 'products' + join 'categories'
type ProductStock = {
  id: string; // UUID
  name: string;
  stock: number;
  price: number;
  category_name: string; // Hasil join categories.name
  status: "active" | "inactive";
};

// Representasi agregasi dari 'order_items'
type DailySales = {
  date: string;
  items_sold: number; // Sum quantity
  revenue: number;    // Sum price * quantity
};

// Representasi penjualan per produk
type ProductSales = {
  name: string;
  items_sold: number;
  revenue: number;
  category_name: string;
};

// Representasi join addresses -> provinces
type RegionSales = {
  region: string; // provinces.name
  totalOrders: number;
  totalRevenue: number;
  topProduct: string;
};

// ====== DUMMY DATA (Struktur Valid DB) ======

const MOCK_STOCK: ProductStock[] = [
  { id: "p1", name: "Samsung Galaxy S22 Ultra", stock: 12, price: 17500000, category_name: "Smartphone", status: "active" },
  { id: "p2", name: "iPhone 14 Pro Max", stock: 8, price: 21000000, category_name: "Smartphone", status: "active" },
  { id: "p3", name: "Xiaomi Mi 11 Lite", stock: 15, price: 3500000, category_name: "Smartphone", status: "inactive" },
  { id: "p4", name: "Sony WH-1000XM5", stock: 1, price: 5500000, category_name: "Audio", status: "active" }, // Stok Kritis
  { id: "p5", name: "JBL Flip 6", stock: 23, price: 1900000, category_name: "Audio", status: "active" },
  { id: "p6", name: "Apple AirPods Pro 2", stock: 10, price: 3500000, category_name: "Audio", status: "inactive" },
  { id: "p7", name: "GoPro Hero 11 Black", stock: 0, price: 7500000, category_name: "Camera", status: "active" }, // Stok Habis
  { id: "p8", name: "SSD Samsung 980 Pro", stock: 18, price: 2400000, category_name: "Storage", status: "active" },
];

const MOCK_DAILY_SALES: DailySales[] = [
  { date: "01 Nov", items_sold: 18, revenue: 3250000 },
  { date: "02 Nov", items_sold: 22, revenue: 4200000 },
  { date: "03 Nov", items_sold: 17, revenue: 3100000 },
  { date: "04 Nov", items_sold: 26, revenue: 5400000 },
  { date: "05 Nov", items_sold: 24, revenue: 5100000 },
  { date: "06 Nov", items_sold: 21, revenue: 4300000 },
  { date: "07 Nov", items_sold: 29, revenue: 6200000 },
];

const MOCK_PRODUCT_SALES: ProductSales[] = [
  { name: "Samsung Galaxy S22 Ultra", items_sold: 19, revenue: 32000000, category_name: "Smartphone" },
  { name: "iPhone 14 Pro Max", items_sold: 15, revenue: 31500000, category_name: "Smartphone" },
  { name: "JBL Flip 6", items_sold: 28, revenue: 53200000, category_name: "Audio" },
  { name: "Sony WH-1000XM5", items_sold: 11, revenue: 60500000, category_name: "Audio" },
];

const MOCK_REGION_SALES: RegionSales[] = [
  { region: "DKI Jakarta", totalOrders: 42, totalRevenue: 82000000, topProduct: "Samsung Galaxy S22 Ultra" },
  { region: "Jawa Barat", totalOrders: 35, totalRevenue: 64500000, topProduct: "JBL Flip 6" },
  { region: "Jawa Timur", totalOrders: 27, totalRevenue: 54000000, topProduct: "iPhone 14 Pro Max" },
  { region: "Bali", totalOrders: 12, totalRevenue: 21500000, topProduct: "Sony WH-1000XM5" },
];

export default function ReportPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");

  // ====== PERHITUNGAN DATA ======
  const totalProducts = MOCK_STOCK.length;
  const totalActive = MOCK_STOCK.filter((p) => p.status === "active").length;
  const totalInactive = MOCK_STOCK.filter((p) => p.status === "inactive").length;
  const totalStock = MOCK_STOCK.reduce((sum, p) => sum + p.stock, 0);
  const totalRevenueLast7Days = MOCK_DAILY_SALES.reduce((sum, d) => sum + d.revenue, 0);

  const sortedByStock = useMemo(
    () => [...MOCK_STOCK].sort((a, b) => b.stock - a.stock),
    []
  );

  const sortedTopProducts = useMemo(
    () => [...MOCK_PRODUCT_SALES].sort((a, b) => b.items_sold - a.items_sold),
    []
  );

  // ====== CHART CONFIGURATION ======
  
  // 1. Tren Penjualan
  const dailySalesChartData = useMemo(() => ({
    labels: MOCK_DAILY_SALES.map((d) => d.date),
    datasets: [{
      label: "Pendapatan",
      data: MOCK_DAILY_SALES.map((d) => d.revenue),
      borderColor: "#ff7a1a",
      backgroundColor: "rgba(255, 122, 26, 0.12)",
      borderWidth: 2,
      tension: 0.35,
    }],
  }), []);

  // 2. Produk Terlaris
  const topProductChartData = useMemo(() => ({
    labels: sortedTopProducts.map((p) => p.name),
    datasets: [{
      label: "Unit Terjual",
      data: sortedTopProducts.map((p) => p.items_sold),
      backgroundColor: "#22c55e",
      borderRadius: 6,
    }],
  }), [sortedTopProducts]);

  // 3. Stok Produk (Color Logic sesuai SRS < 2)
  const stockChartData = useMemo(() => ({
    labels: sortedByStock.map((p) => p.name),
    datasets: [{
      label: "Jumlah Stok",
      data: sortedByStock.map((p) => p.stock),
      backgroundColor: sortedByStock.map((p) =>
        p.stock < 2 ? "#ef4444" : p.stock < 5 ? "#f59e0b" : "#10b981"
      ),
      borderRadius: 6,
    }],
  }), [sortedByStock]);

  // 4. Region Chart
  const filteredRegionData = selectedRegion === "ALL" 
    ? MOCK_REGION_SALES 
    : MOCK_REGION_SALES.filter((r) => r.region === selectedRegion);

  const regionChartData = useMemo(() => ({
    labels: filteredRegionData.map((r) => r.region),
    datasets: [{
      label: "Order",
      data: filteredRegionData.map((r) => r.totalOrders),
      backgroundColor: "#38bdf8",
      borderRadius: 6,
    }],
  }), [filteredRegionData]);

  // Handler Download (Fitur SRS)
  const handleDownloadPDF = (type: string) => {
    alert(`Mengunduh Laporan ${type} (Simulasi)`);
  };

  // Helper Warna Badge
  const getStockBadge = (stock: number) => {
    if (stock < 2) return "bg-red-500/15 text-red-400"; // Kritis (SRS Requirement)
    if (stock < 5) return "bg-yellow-500/15 text-yellow-400";
    return "bg-green-500/15 text-green-400";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Laporan Penjualan & Stok
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Analisis performa toko, sebaran stok, dan demografi pembeli.
        </p>
      </div>

      {/* ACTION BUTTONS (SRS Requirement for PDF Reports) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button onClick={() => handleDownloadPDF("Stok")} className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-700 bg-[#111418] hover:border-[#ff7a1a] transition-colors text-sm text-slate-300 hover:text-white">
          <FileDown className="w-4 h-4" /> Laporan Stok (PDF)
        </button>
        <button onClick={() => handleDownloadPDF("Terlaris")} className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-700 bg-[#111418] hover:border-[#ff7a1a] transition-colors text-sm text-slate-300 hover:text-white">
          <FileDown className="w-4 h-4" /> Laporan Produk Laris (PDF)
        </button>
        <button onClick={() => handleDownloadPDF("Restock")} className="flex items-center justify-center gap-2 p-3 rounded-xl border border-red-900/50 bg-red-900/10 hover:border-red-500 transition-colors text-sm text-red-400">
          <AlertTriangle className="w-4 h-4" /> Laporan Perlu Restock (PDF)
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Produk */}
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-4 shadow-md shadow-black/40">
          <p className="text-xs text-slate-400 flex items-center gap-2 mb-2">
            <Boxes className="w-4 h-4 text-slate-500" /> Total Produk
          </p>
          <p className="text-2xl font-bold text-white">{totalProducts}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            {totalActive} aktif • {totalInactive} tidak aktif
          </p>
        </div>

        {/* Total Stok */}
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-4 shadow-md shadow-black/40">
          <p className="text-xs text-slate-400 flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-slate-500" /> Total Stok
          </p>
          <p className="text-2xl font-bold text-white">{totalStock} unit</p>
          <p className="text-[11px] text-slate-500 mt-1">Akumulasi seluruh barang</p>
        </div>

        {/* Revenue */}
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-4 shadow-md shadow-black/40">
          <p className="text-xs text-slate-400 flex items-center gap-2 mb-2">
            <LineChartIcon className="w-4 h-4 text-slate-500" /> Revenue (7 Hari)
          </p>
          <p className="text-2xl font-bold text-[#ff7a1a]">
            Rp {totalRevenueLast7Days.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Region */}
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-4 shadow-md shadow-black/40">
          <p className="text-xs text-slate-400 flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-slate-500" /> Jangkauan Wilayah
          </p>
          <p className="text-2xl font-bold text-white">{MOCK_REGION_SALES.length} provinsi</p>
          <p className="text-[11px] text-slate-500 mt-1">Berdasarkan alamat kirim</p>
        </div>
      </div>

      {/* ROW 1: Tren Penjualan & Produk Terlaris */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr,1.2fr] gap-6">
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-4">Tren Penjualan (Harian)</h2>
          <Line data={dailySalesChartData} options={{ responsive: true, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.05)' } } } }} />
        </div>
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-4">Top Produk Terlaris</h2>
          <Bar data={topProductChartData} options={{ indexAxis: "y", responsive: true }} />
        </div>
      </div>

      {/* ROW 2: Stok Produk & Laporan Wilayah */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr,1.2fr] gap-6">
        <div className="space-y-4">
           {/* Chart Stok */}
          <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4">Grafik Sebaran Stok</h2>
            <Bar data={stockChartData} options={{ responsive: true, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.05)' } } } }} />
          </div>
          
          {/* Tabel Stok */}
          <div className="bg-[#111418] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-800 font-semibold text-white">Daftar Stok Produk</div>
            <div className="max-h-[260px] overflow-y-auto custom-scrollbar">
              {sortedByStock.map((p) => (
                <div key={p.id} className="grid grid-cols-[1.6fr,0.7fr,0.7fr] px-6 py-3 border-b border-slate-800/50 hover:bg-slate-900/30 text-sm">
                  <div>
                    <div className="text-white font-medium">{p.name}</div>
                    <div className="text-xs text-slate-500">ID: {p.id}</div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] ${getStockBadge(p.stock)}`}>
                      {p.stock} unit
                    </span>
                  </div>
                  <div className="text-slate-400">{p.category_name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Laporan Wilayah (Provinsi) */}
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Laporan Wilayah</h2>
            <select 
              value={selectedRegion} 
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-[#050815] border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1"
            >
              <option value="ALL">Semua</option>
              {MOCK_REGION_SALES.map((r) => <option key={r.region} value={r.region}>{r.region}</option>)}
            </select>
          </div>
          <div className="h-48 mb-4">
             <Bar data={regionChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar">
            {filteredRegionData.map((r) => (
              <div key={r.region} className="flex justify-between items-center p-3 rounded-xl border border-slate-800 bg-[#0b0f17]">
                 <div>
                    <p className="text-sm font-medium text-white">{r.region}</p>
                    <p className="text-[10px] text-slate-400">Top: {r.topProduct}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-slate-300">{r.totalOrders} order</p>
                    <p className="text-xs text-[#ff7a1a] font-semibold">Rp {r.totalRevenue.toLocaleString("id-ID")}</p>
                 </div>
              </div>
            ))}
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