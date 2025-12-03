"use client";

import React, { useMemo, useState } from "react";
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

type ProductStock = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  category: string;
  status: "active" | "inactive";
};

type DailySales = {
  date: string;
  orders: number;
  revenue: number;
};

type ProductSales = {
  name: string;
  sold: number;
  revenue: number;
  category: string;
};

type RegionSales = {
  region: string;
  totalOrders: number;
  totalRevenue: number;
  topProduct: string;
};

// ====== DUMMY DATA ======
const stockData: ProductStock[] = [
  { id: "1", name: "Samsung Galaxy S22 Ultra", sku: "HP-S22U", stock: 12, category: "Smartphone", status: "active" },
  { id: "2", name: "iPhone 14 Pro Max", sku: "IPH-14PM", stock: 8, category: "Smartphone", status: "active" },
  { id: "3", name: "Xiaomi Mi 11 Lite", sku: "XMI-11LT", stock: 15, category: "Smartphone", status: "inactive" },
  { id: "4", name: "Sony WH-1000XM5", sku: "SONY-WHXM5", stock: 7, category: "Audio", status: "active" },
  { id: "5", name: "JBL Flip 6", sku: "JBL-FLP6", stock: 23, category: "Audio", status: "active" },
  { id: "6", name: "Apple AirPods Pro 2", sku: "APP-AP2", stock: 10, category: "Audio", status: "inactive" },
  { id: "7", name: "GoPro Hero 11 Black", sku: "GOPRO-H11", stock: 5, category: "Camera", status: "active" },
  { id: "8", name: "Canon EOS M50 Mark II", sku: "CAN-M50M2", stock: 3, category: "Camera", status: "active" },
  { id: "9", name: "SSD Samsung 980 Pro 1TB", sku: "SSD-980P1T", stock: 18, category: "Storage", status: "active" },
  { id: "10", name: "Seagate Barracuda 2TB", sku: "SEA-BRC2T", stock: 30, category: "Storage", status: "active" },
];

const dailySales: DailySales[] = [
  { date: "01 Nov", orders: 18, revenue: 3250000 },
  { date: "02 Nov", orders: 22, revenue: 4200000 },
  { date: "03 Nov", orders: 17, revenue: 3100000 },
  { date: "04 Nov", orders: 26, revenue: 5400000 },
  { date: "05 Nov", orders: 24, revenue: 5100000 },
  { date: "06 Nov", orders: 21, revenue: 4300000 },
  { date: "07 Nov", orders: 29, revenue: 6200000 },
];

const productSales: ProductSales[] = [
  { name: "Samsung Galaxy S22 Ultra", sold: 19, revenue: 32000000, category: "Smartphone" },
  { name: "iPhone 14 Pro Max", sold: 15, revenue: 31500000, category: "Smartphone" },
  { name: "JBL Flip 6", sold: 28, revenue: 53200000, category: "Audio" },
  { name: "Sony WH-1000XM5", sold: 11, revenue: 60500000, category: "Audio" },
  { name: "SSD Samsung 980 Pro 1TB", sold: 21, revenue: 50400000, category: "Storage" },
  { name: "Seagate Barracuda 2TB", sold: 18, revenue: 17100000, category: "Storage" },
];

const regionSales: RegionSales[] = [
  { region: "DKI Jakarta", totalOrders: 42, totalRevenue: 82000000, topProduct: "Samsung Galaxy S22 Ultra" },
  { region: "Jawa Barat", totalOrders: 35, totalRevenue: 64500000, topProduct: "JBL Flip 6" },
  { region: "Jawa Timur", totalOrders: 27, totalRevenue: 54000000, topProduct: "iPhone 14 Pro Max" },
  { region: "Jawa Tengah", totalOrders: 19, totalRevenue: 31000000, topProduct: "SSD Samsung 980 Pro 1TB" },
  { region: "Bali", totalOrders: 12, totalRevenue: 21500000, topProduct: "Sony WH-1000XM5" },
];

export default function ReportPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");

  // ====== Perhitungan ringkasan ======
  const totalProducts = stockData.length;
  const totalActive = stockData.filter((p) => p.status === "active").length;
  const totalInactive = stockData.filter((p) => p.status === "inactive").length;
  const totalStock = stockData.reduce((sum, p) => sum + p.stock, 0);
  const totalRevenueLast7Days = dailySales.reduce(
    (sum, d) => sum + d.revenue,
    0
  );

  const sortedByStock = useMemo(
    () => [...stockData].sort((a, b) => b.stock - a.stock),
    []
  );

  const sortedTopProducts = useMemo(
    () => [...productSales].sort((a, b) => b.sold - a.sold),
    []
  );

  // ====== Grafik: Tren Penjualan Harian ======
  const dailySalesChartData = useMemo(
    () => ({
      labels: dailySales.map((d) => d.date),
      datasets: [
        {
          label: "Jumlah Order",
          data: dailySales.map((d) => d.orders),
          borderColor: "#ff7a1a",
          backgroundColor: "rgba(255, 122, 26, 0.12)",
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 5,
          tension: 0.35,
        },
      ],
    }),
    []
  );

  const dailySalesChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `Order: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255,255,255,0.04)" },
      },
      y: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255,255,255,0.04)" },
      },
    },
  };

  // ====== Grafik: Produk Terlaris ======
  const topProductChartData = useMemo(
    () => ({
      labels: sortedTopProducts.map((p) => p.name),
      datasets: [
        {
          label: "Unit Terjual",
          data: sortedTopProducts.map((p) => p.sold),
          backgroundColor: "#22c55e",
          borderRadius: 6,
        },
      ],
    }),
    [sortedTopProducts]
  );

  const topProductChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    indexAxis: "y" as const,
    scales: {
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255,255,255,0.04)" },
      },
      y: {
        ticks: { color: "#cbd5e1" },
        grid: { display: false },
      },
    },
  };

  // ====== Grafik: Stok Produk ======
  const stockChartData = useMemo(
    () => ({
      labels: sortedByStock.map((p) => p.name),
      datasets: [
        {
          label: "Jumlah Stok",
          data: sortedByStock.map((p) => p.stock),
          backgroundColor: sortedByStock.map((p) =>
            p.stock <= 5 ? "#ef4444" : p.stock <= 10 ? "#f59e0b" : "#10b981"
          ),
          borderRadius: 6,
        },
      ],
    }),
    [sortedByStock]
  );

  const stockChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  // ====== Region Filter ======
  const filteredRegionData =
    selectedRegion === "ALL"
      ? regionSales
      : regionSales.filter((r) => r.region === selectedRegion);

  const regionChartData = useMemo(
    () => ({
      labels: filteredRegionData.map((r) => r.region),
      datasets: [
        {
          label: "Order",
          data: filteredRegionData.map((r) => r.totalOrders),
          backgroundColor: "#38bdf8",
          borderRadius: 6,
        },
      ],
    }),
    [filteredRegionData]
  );

  const regionChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        displayColors: false,
        backgroundColor: "rgba(15,23,42,0.95)",
        titleColor: "#e5e7eb",
        bodyColor: "#e5e7eb",
        borderColor: "rgba(148,163,184,0.5)",
        borderWidth: 1,
        callbacks: {
          title: (items: any) => items[0]?.label,
          label: (ctx: any) => `Order: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#cbd5e1",
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
        },
        grid: { color: "rgba(255,255,255,0.04)" },
      },
      y: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255,255,255,0.04)" },
      },
    },
  };

  const getStockBadge = (stock: number) => {
    if (stock <= 3) return "bg-red-500/15 text-red-400";
    if (stock <= 10) return "bg-yellow-500/15 text-yellow-400";
    return "bg-green-500/15 text-green-400";
  };

  const getStatusBadge = (status: "active" | "inactive") =>
    status === "active"
      ? "bg-green-500/15 text-green-400"
      : "bg-red-500/15 text-red-400";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* HEADER */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-[#ff7a1a] rounded-full" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Laporan Penjualan & Stok
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Ringkasan grafik performa toko: tren penjualan, produk terlaris,
              stok, dan sebaran pembeli per daerah.
            </p>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Produk */}
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 shadow-md shadow-black/40">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-slate-500" />
              Total Produk
            </p>
          </div>
          <p className="text-2xl font-bold text-white">{totalProducts}</p>
          <p className="text-[11px] text-slate-500">
            {totalActive} aktif • {totalInactive} tidak aktif
          </p>
        </div>

        {/* Total Stok */}
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 shadow-md shadow-black/40">
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-500" />
            Total Stok Tersedia
          </p>
          <p className="text-2xl font-bold text-white">{totalStock} unit</p>
          <p className="text-[11px] text-slate-500">
            Menggabungkan semua produk aktif & tidak aktif
          </p>
        </div>

        {/* Revenue 7 hari */}
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 shadow-md shadow-black/40">
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <LineChartIcon className="w-4 h-4 text-slate-500" />
            Estimasi Revenue 7 Hari Terakhir
          </p>
          <p className="text-2xl font-bold text-[#ff7a1a]">
            Rp {totalRevenueLast7Days.toLocaleString("id-ID")}
          </p>
          <p className="text-[11px] text-slate-500">
            Dummy data untuk simulasi tren penjualan
          </p>
        </div>

        {/* Sebaran Daerah */}
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 shadow-md shadow-black/40">
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-slate-500" />
            Sebaran Daerah Pembeli
          </p>
          <p className="text-2xl font-bold text-white">
            {regionSales.length} provinsi
          </p>
          <p className="text-[11px] text-slate-500">
            Data dummy—bisa dihubungkan ke tabel order nanti
          </p>
        </div>
      </div>

      {/* ROW: Tren Penjualan + Produk Terlaris */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr,1.2fr] gap-6">
        {/* Tren Penjualan */}
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/40">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#ff7a1a]/15 text-[#ff7a1a]">
                <LineChartIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Tren Penjualan 7 Hari Terakhir
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Grafik jumlah order per hari (dummy).
                </p>
              </div>
            </div>
          </div>

          <Line data={dailySalesChartData} options={dailySalesChartOptions} />
        </div>

        {/* Produk Terlaris */}
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/40">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Top Produk Terlaris
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Berdasarkan unit yang terjual (dummy).
                </p>
              </div>
            </div>
          </div>

          <Bar data={topProductChartData} options={topProductChartOptions} />
        </div>
      </div>

      {/* ROW: Stok Produk + Per Daerah */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr,1.2fr] gap-6">
        {/* GRAFIK & TABEL STOK */}
        <div className="space-y-4">
          {/* Grafik stok */}
          <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/40">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-[#ff7a1a]/15 text-[#ff7a1a]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Grafik Sebaran Stok Produk
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Batang hijau: stok aman, kuning: menipis, merah: kritis.
                </p>
              </div>
            </div>

            <Bar data={stockChartData} options={stockChartOptions} />
          </div>

          {/* Tabel stok */}
          <div className="bg-[#111418] border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
            {/* Header tabel */}
            <div className="px-4 sm:px-6 py-4 border-b border-slate-800 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-[#ff7a1a]" />
              <h2 className="text-lg font-semibold text-white">
                Laporan Daftar Stok Produk
              </h2>
            </div>

            {/* Header kolom */}
            <div className="grid grid-cols-[1.6fr,0.7fr,0.7fr,0.7fr] px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase border-b border-slate-800">
              <span>Produk</span>
              <span>Stok</span>
              <span>Kategori</span>
              <span>Status</span>
            </div>

            {/* Isi */}
            <div className="max-h-[260px] overflow-y-auto divide-y divide-slate-800 custom-scrollbar">
              {sortedByStock.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-[1.6fr,0.7fr,0.7fr,0.7fr] px-4 sm:px-6 py-3 items-center hover:bg-slate-900/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-white">{p.name}</p>
                      <p className="text-[11px] text-slate-500">
                        ID: #{p.id} • SKU: {p.sku}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-1 rounded-full text-[11px] ${getStockBadge(
                      p.stock
                    )}`}
                  >
                    {p.stock} unit
                  </span>

                  <p className="text-sm text-slate-300">{p.category}</p>

                  <span
                    className={`px-2 py-1 rounded-full text-[11px] ${getStatusBadge(
                      p.status
                    )}`}
                  >
                    {p.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LAPORAN PER DAERAH */}
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/40 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Laporan Penjualan per Daerah
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kelompokkan berdasarkan provinsi pembeli (dummy).
                </p>
              </div>
            </div>

            {/* Filter region */}
            <div className="text-right">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-[#050815] border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]/70 focus:border-[#ff7a1a]"
              >
                <option value="ALL">Semua Daerah</option>
                {regionSales.map((r) => (
                  <option key={r.region} value={r.region}>
                    {r.region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grafik ringkas per daerah */}
          <div className="h-48">
            <Bar data={regionChartData} options={regionChartOptions} />
          </div>

          {/* List detail per daerah */}
          <div className="mt-2 max-h-[220px] overflow-y-auto custom-scrollbar space-y-2">
            {filteredRegionData.map((r) => (
              <div
                key={r.region}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#0b0f17] px-3 py-3 hover:border-sky-500/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/15 flex items-center justify-center text-sky-400 text-xs">
                    {r.region.split(" ")[0].slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {r.region}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Produk terpopuler:{" "}
                      <span className="text-slate-200">{r.topProduct}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <p className="text-slate-300">
                    {r.totalOrders} order
                  </p>
                  <p className="text-[#ff7a1a] font-semibold mt-0.5">
                    Rp {r.totalRevenue.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}

            {filteredRegionData.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">
                Tidak ada data untuk daerah yang dipilih.
              </p>
            )}
          </div>

          <p className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
            <TrendingDown className="w-3 h-3 text-slate-500" />
            Data di atas masih dummy, nanti bisa diambil dari tabel transaksi /
            order.
          </p>
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
